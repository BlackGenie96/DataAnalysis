import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime
import json
import requests

from investing_crypto_api import *
from scrollable_frame import *
import constants as const

class PlotCryptosFrame(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self,master)
        
        self.crypto_var = tk.StringVar()
        self.api = CryptoAPI()

        row = tk.Frame(self)
        lab = tk.Label(row, text='Cryptos Plotting', font=const.title_font)
        row.pack()
        lab.pack()

        #combobox for selecting crypto
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Crypto', font=const.font)
        self.cryptos = ttk.Combobox(row, width=27, textvariable=self.crypto_var)
        self.populateCryptosCombobox(master)
        row.pack(pady=15)
        lab.pack(side='left')
        self.cryptos.pack(side='right')
        self.cryptos.current(0)
        self.cryptos.bind("<<ComboboxSelected>>", self.cryptoSelected)

        #start date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='Start Date', width=30, font=const.font, relief='ridge')
        self.start_date = tk.Entry(row, width=25, font=const.font,relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.start_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)', font=const.hint_font)
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #end date definition
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='End Date', width=30, font=const.font, relief='ridge')
        self.end_date = tk.Entry(row, width=25, font=const.font, relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.end_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)',font=const.hint_font)
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #plot button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Plot Data', font=const.font, width=20, command=lambda:self.plotData(master))
        row.pack(pady=15)
        but.pack()

        #update all definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Update', font=const.font,width=20,command=lambda:self.updateData())
        row.pack(pady=15)
        but.pack()

        #back button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Back', width=20, command=lambda: self.goBack(master))
        row.pack(pady=15)
        but.pack()

    #handle back button click
    def goBack(self, master):
        from investing_select_data import SelectData
        master.switch_frame(SelectData)

    #function to populate combobox
    def populateCryptosCombobox(self, master):
        cryptos = self.api.getCryptoDict()
        temp = []

        #append each item to combobox 
        for i,crypto in enumerate(cryptos):
            temp.append(crypto['name'])

        self.cryptos['values'] = temp

    #handle combobox selected
    def cryptoSelected(self,event):
        selected = event.widget.get()
        self.api.setCrypto(selected)

    #handle plotting graphs
    def plotData(self, master):
        #check for inputs
        if self.api.getName() == None or self.api.getName() == "":
            mb.showinfo('Notice', 'Select a crypto')
            return
        #elif self.start_date.get() == None or self.start_date.get() == "":
        #    mb.showinfo('Notice', 'Enter start date')
        #    return
        #elif self.end_date.get() == None or self.end_date.get() == "":
        #    mb.showinfo('Notice', 'Enter end date')
        #    return
        
        #check for date in mongo db server
        result = requests.get(f"{const.server}/investing/crypto/get/{self.api.getName()}_{self.api.getCountry()}/{self.start_date.get().replace('/','')}/{self.end_date.get().replace('/','')}", headers=const.headers).json()
        print('Result for getting:',result['data'][0]['data'])

        if result['success'] == 1:
            df = pd.DataFrame(result['data'][0]['data'])
            print('DataFrame: \n',df)

            df.drop(df.columns[[0,6,7]], axis=1, inplace=True)
            #draw candles
            const.drawCandles(df, self.api.getName(), self.api.getCountry())

        else: 
            self.updateData()
            self.plotData(master)

    #function to handle updating data in database server
    def updateData(self):
        #check for crypto
        if self.api.getName() == None or self.api.getName() == "":
            mb.showinfo('Notice', 'Select a crypto')
            return

        #get most recent 
        data = {
            'crypto_name' : f"{self.api.getName()}_{self.api.getCountry()}"
        }

        recent = requests.get(f'{const.server}/investing/crypto/get/recent',data=json.dumps(data),headers=const.headers)
        
        if recent.status_code == 404: 
            #get historical data
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.setToDate(now.strftime('%d/%m/%Y'))
            
            historical = self.api.getCryptoData()
            j = json.loads(historical)
            dat = j['historical']
            
            #send data to mongodb server
            const.saveDataInServer(dat, 'investing/crypto','crypto_name',self.api)

            mb.showinfo('Notice', f'Data on {self.api.getName()} updated successfully.')
        elif recent.status_code == 200:
            #get recent data
            rec = recent.json()
            #recent_date = rec['date']
            print('\n',rec,'\n')

            rec_list = rec['data'][0]['data']
            last_date = rec_list[-1:]
            recent_date = last_date['date']
            print("Recent Date", recent_date)
            self.api.setFromDate(recent_date)
            now = datetime.datetime.now()
            self.api.setToDate(now.strftime('%d/%m/%Y'))

            historical = self.api.getCryptoData()
            j = json.loads(historical)
            dat = j['historical']

            #send data to mongodb server
            const.saveDataInServer(dat,'investing/crypto', 'crypto_name', self.api)
            
            mb.showinfo('Notice', f'Data on {self.api.getName()} updated successfully.')

        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', recent.json()['message'])