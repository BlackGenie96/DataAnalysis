import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime

from investing_crypto_api import *
from scrollable_frame import *
from constants import *

class PlotCryptosFrame(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self,master)
        
        self.crypto_var = tk.StringVar()
        self.api = CryptoAPI()

        row = tk.Frame(self)
        lab = tk.Label(row, text='Cryptos Plotting', font=title_font)
        row.pack()
        lab.pack()

        #combobox for selecting crypto
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Crypto', font=font)
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
        lab = tk.Label(row, text='Start Date', width=30, font=font, relief='ridge')
        self.start_date = tk.Entry(row, width=25, font=font,relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.start_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)', font=hint_font)
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #end date definition
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='End Date', width=30, font=('Arial', 12, 'bold'), relief='ridge')
        self.end_date = tk.Entry(row, width=25, font=('Arial', 12, 'bold'), relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.end_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)',font=hint_font)
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #plot button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Plot Data', font=('Arial', 12, 'bold'), width=20, command=lambda:self.plotData(master))
        row.pack(pady=15)
        but.pack()

        #update all definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Update All', font=('Arial', 12, 'bold'),width=20)
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
        if self.api.getCrypto() == None or self.api.getCrypto() == "":
            mb.showinfo('Notice', 'Select a crypto')
            return
        elif self.start_date.get() == None or self.start_date.get() == "":
            mb.showinfo('Notice', 'Enter start date')
            return
        elif self.end_date.get() == None or self.end_date.get() == "":
            mb.showinfo('Notice', 'Enter end date')
            return
        
        #check for date in mongo db server
        data = {
            'crypto_name': self.api.getCrypto(),
            'start_date' : datetime.datetime.strptime(self.start_date.get(), '%d/%m/%Y').isoformat(),
            'end_date' : datetime.datetime.strptime(self.end_date.get(), '%d/%m/%Y').isoformat()
        }

        result = requests.post(f'{server}/investing/crypto/get', data=json.dumps(data), headers=headers).json()
        
        if result['success'] == 1:
            df = pd.DateFrame.from_dict(result['data'], orient='index')
            #TODO: plot candle sticks
        else: 
            self.updateData()
            self.plotData(master)

    #function to handle updating data in database server
    def updateData(self):
        #check for bond 
        if self.api.getCrypto() == None or self.api.getCrypto() == "":
            mb.showinfo('Notice', 'Select a crypto')
            return

        #get most recent 
        data = {
            'crypto_name' : self.api.getCrypto()
        }

        recent = requests.post(f'{server}/investing/crypto/get/recent',data=json.dumps(data),headers=headers)
        print(recent)

        if recent.status_code == 404: 
            #get historical data
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.setToDate(now.strftime('%d/%m/%Y'))

            historical = self.api.getCryptoData()
            print('historical')
            dat = json.loads(historical)
            print(dat['historical'])

            #send data to mongodb server
            data = {
                'commodity_name': self.api.getCrypto(),
                'data' : dat['historical']
            }

            r = requests.post(f'{server}/investing/get/recent/create', data=json.dumps(data),headers=headers).json()

            if r['success'] == 1:
                mb.showinfo("Notice", r['message'])
            else:
                mb.showinfo('Notice', r['message'])

        elif recent.status_code == 200:
            #get recent data
            recent_data = self.api.getCryptoRecentData()
            print(recent_data)

            #update existing instance
            r = requests.post(f'{server}/investing/commodities/update',data=json.dumps(data),headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else: 
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', r['message'])