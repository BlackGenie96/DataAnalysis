import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime

from investing_bonds_api import *
from scrollable_frame import *
from constants import *

class PlotBondsFrame(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self, master)

        self.country_var = tk.StringVar()
        self.bond_var = tk.StringVar()
        self.api = BondsAPI()

        row = tk.Frame(self)
        lab = tk.Label(row, text='Bonds Plotting',font=font)
        row.pack()
        lab.pack()

        #combobox for selecting country
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Country', font=('Arial',12, 'bold'))
        self.countries = ttk.Combobox(row, width=27, textvariable=self.country_var)
        self.populateCountriesCombobox(master)
        row.pack(pady=15)
        lab.pack(side='left')
        self.countries.pack(side='right')
        self.countries.current(0)
        self.countries.bind("<<ComboboxSelected>>", self.countrySelected)

        #combobox for selecting bond
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Bond', font=('Arial', 12, 'bold'))
        self.bonds = ttk.Combobox(row, width=27, textvariable=self.bond_var)
        row.pack(pady=15)
        lab.pack(side='left')
        self.bonds.pack(side='right')
        self.bonds.bind("<<ComboboxSelected>>", self.bondSelected)

        #start date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='Start Date', width=30, font=('Arial', 12, 'bold'), relief='ridge')
        self.start_date = tk.Entry(row, width=25, font=('Arial', 12, 'bold'),relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.start_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)',font=hint_font)
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #end date definition
        big_row = tk.Frame(self)
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

    #function to populate countries combobox
    def populateCountriesCombobox(self,master):
        countries = self.api.getCountries()
        temp = []

        #append each item to the combobox values
        for i,country in enumerate(countries):
            temp.append(country)

        self.countries['values'] = temp
    
    #function to handle selection of country 
    def countrySelected(self, event):
        selected = event.widget.get()
        self.api.setCountry(selected)

        #get bonds dict for bonds combobox
        bonds = self.api.getBondsDict(country=selected)
        temp = []

        #for each bond append into combobox values
        for i,bond in enumerate(bonds):
            temp.append(bond['name'])

        self.bond['values'] = temp

    #function to handle the selection bond 
    def bondSelected(self,event):
        selected = event.widget.get()
        self.api.setBond(selected)

    #function to handle plotting of graphs
    def plotData(self, master):
        #check for inputs
        if self.api.getCountry() == None or self.api.getCountry() == "":
            mb.showinfo('Notice', 'Select a country')
            return
        elif self.api.getBond() == None or self.api.getBond() == "":
            mb.showinfo('Notice', 'Select a bond')
            return
        elif self.start_date.get() == None or self.start_date.get() == "":
            mb.showinfo('Notice', 'Enter start date')
            return
        elif self.end_date.get() == None or self.end_date.get() == "":
            mb.showinfo('Notice', 'Enter end date')
            return
        
        #check for date in mongo db server
        data = {
            'bond_name': self.api.getBond(),
            'start_date' : datetime.datetime.strptime(self.start_date.get(), '%d/%m/%Y'),
            'end_date' : datetime.datetime.strptime(self.end_date.get(), '%d/%m/%Y')
        }

        result = requests.post(f'{server}/investing/bonds/get', data=json.dumps(data), headers=headers).json()
        
        if result['success'] == 1:
            df = pd.DateFrame.from_dict(result['data'], orient='index')
            #TODO: plot candle sticks
        else: 
            self.updateData()
            self.plotData(master)

    #function to handle updating data in database server
    def updateData(self):
        #check for bond 
        if self.api.getBond() == None or self.api.getBond() == "":
            mb.showinfo('Notice', 'Select a bond')
            return
        elif self.api.getCountry() == None or self.api.getCountry() == "":
            mb.showinfo('Notice', 'Select a country')

        #get most recent 
        data = {
            'bond_name' : self.api.getBond()
        }

        recent = requests.post(f'{server}/investing/bonds/get/recent',data=json.dumps(data),headers=headers)
        print(recent)

        if recent.status_code == 404: 
            #get historical data
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.setToDate(now.strftime('%d/%m/%Y'))

            historical = self.api.getBondData()
            print('historical')
            print(historical)

            #send data to mongodb server
            data = {
                'bond_name': self.api.getBond(),
                'data' : historical['historical']
            }

            r = requests.post(f'{server}/investing/bonds/create', data=json.dumps(data),headers=headers).json()

            if r['success'] == 1:
                mb.showinfo("Notice", r['message'])
            else:
                mb.showinfo('Notice', r['message'])

        elif recent.status_code == 200:
            #get recent data
            recent_data = self.api.getBondRecentData()
            print(recent_data)

            #update existing instance
            r = requests.post(f'{server}/investing/bonds/update',data=json.dumps(data),headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else: 
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', r['message'])