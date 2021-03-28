import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime

from investing_indices_api import *
from scrollable_frame import *

class PlotIndicesFrame(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self, master)

        self.index_var = tk.StringVar()
        self.country_var = tk.StringVar()
        self.api = IndicesAPI()

        row = tk.Frame(self)
        lab = tk.Label(row, text='Indices Plotting',font=('Arial',14, 'bold'))
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

        #combobox for selecting index
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Index',font=('Arial', 12, 'bold'))
        self.indices = ttk.Combobox(row, width=27,textvariable=self.index_var)
        row.pack(pady=15)
        lab.pack(side='left')
        self.indices.pack(side='right')
        self.indices.bind("<<ComboboxSelected>>", self.indexSelected)

        #start date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='Start Date',width=30, font=('Arial', 12, 'bold'), relief='ridge')
        self.start_date = tk.Entry(row, width=25, font=('Arial', 12, 'bold'), relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.start_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format (dd/mm/yyyy)',font=('Arial',10,'italic'))
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #end date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='End Date', font=('Arial', 12, 'bold'), width=30, relief='ridge')
        self.end_date = tk.Entry(row, width=25, font=('Arial', 12, 'bold'), relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.end_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format(dd/mm/yyyy)',font=('Arial', 10, 'italic'))
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #plot button definition
        row = tk.Frame(self)
        but = tk.Button(row, text="Plot Data", font=('Arial', 12, 'bold'), width=20, command=lambda: self.plotData(master))
        row.pack(pady=15)
        but.pack()

        #update all Button
        row = tk.Frame(self)
        but = tk.Button(row, text='Update All', font=('Arial', 12, 'bold'), width=20)
        row.pack(pady=15)
        but.pack()

        #back button
        row = tk.Frame(self)
        but = tk.Button(row, text='Back', width=20, command=lambda:self.goBack(master))
        row.pack(pady=15)
        but.pack()
    
    #handle back button
    def goBack(self, master):
        from investing_select_data import SelectData
        master.switch_frame(SelectData)
    
    #function to populate countries combobox
    def populateCountriesCombobox(self, master):
        countries = self.api.getIndicesCountries()  
        temp = []

        #append each country to combobox array
        for i, country in enumerate(countries):
            temp.append(country)

        self.countries['values'] = temp
    
    #function to handle country selection in combobox
    def countrySelected(self, event):
        selected = event.widget.get()
        self.api.setCountry(selected)

        #get indices dict for indices combobox
        indices = self.api.getIndicesDict(country=selected)
        temp = []

        #populate the indices combobox
        for i,index in enumerate(indices):
            temp.append(index['name'])

        self.indices['values'] = temp
    
    #function to handle selection of index in combobox
    def indexSelected(self,event):
        selected = event.widget.get()
        self.api.setIndex(selected)

    #function to handle plotting of data 
    def plotData(self,master):
        #check for inputs
        if self.api.getCountry() == None or self.api.getCountry() == '':
            mb.showinfo('Notice', 'Select a Country')
            return
        elif self.api.getIndex() == None or self.api.getIndex() == '':
            mb.showinfo('Notice', 'Select an Index')
            return
        elif self.start_date.get() == None or self.start_date.get() == '':
            mb.showinfo('Notice', 'Enter start date')
            return
        elif self.end_date.get() == None or self.end_date.get() == '':
            mb.showinfo('Notice', 'Enter end date')
            return
        
        #check for data in mongo db server
        data = {
            'index_name' : self.api.getIndex(),
            'country_name' : self.api.getCountry(),
            'start_date' : datetime.datetime.strptime(self.start_date.get(),'%d/%m/%Y'),
            'end_date' : datetime.datetime.strptime(self.end_date.get(), '%d/%m/%Y')
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept'      : 'text/plain'
        }

        result = requests.post('http://localhost:8080/investing/indices/get',json.dumps(data),headers=headers).json()

        if result['success'] == 1:
            df = pd.DataFrame.from_dict(result['data'],orient='index')
            #TODO: plot candle sticks
        else: 
            self.updateData()
            self.plotData(master)
        
    #function to update data in database server
    def updateData(self):
        #check for index name and country name
        if self.api.getIndex() == None or self.api.getIndex() == "":
            mb.showinfo('Notice', "Select an Index")
            return
        elif self.api.getCountry() == None or self.api.getCountry() == "":
            mb.showinfo('Notice', 'Select Country')
            return

        #get most recent record from server with this name
        data = {
            'index_name': self.api.getIndex(),
            'country_name': self.api.getCountry()
        }

        headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'text/plain'
        }

        recent = requests.post('http://localhost:8080/investing/indices/get/recent',data=json.dumps(data), headers=headers)
        print(recent)

        if recent.status_code == 404:
            #get historical data starting from 1980
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.toDate(now.strftime('%d/%m/%Y'))

            historical = self.api.getIndexData()
            print('historical')
            print(historical)

            #send data to mongodb server
            #create new instance
            data = {
                'index_name' : self.api.getIndex(),
                'country_name': self.api.getCountry(),
                'data' : historical['historical']
            }

            headers = {
                'Content-Type' : 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/indices/create', data=json.dumps(data), headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else:
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 200:
            #get recent data
            recent_data = self.api.getRecentIndexData()
            print(recent_data)

            #update existing instance
            data = {
                'index_name' : self.api.getIndex(),
                'country_name' : self.api.getCountry(),
                'data' : recent_data['recent']
            }

            headers = {
                'Content-Type' : 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/indices/update',data=json.dumps(data), headers=headers).json()
            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else:
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', r['message'])