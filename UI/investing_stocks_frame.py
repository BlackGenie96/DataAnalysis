import tkinter
import tkinter.messagebox as mb
from tkinter import ttk
from time import sleep
import pandas as pd
import datetime

from investing_stocks_api import *
from scrollable_frame import *

#class to handle getting and displaying company profile
class PlotDataFrame(tk.Frame):

    def __init__(self, master):
        tk.Frame.__init__(self,master)

        self.stock_var = tk.StringVar()
        self.country_var = tk.StringVar()
        self.api = StocksAPI(master)

        row = tk.Frame(self)
        lab = tk.Label(row, text='Stock Plotting', font=('Arial', 14, 'bold'))
        row.pack()
        lab.pack()

        #combobox to select country
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Country', font=('Arial',12, 'bold'))
        self.countries = ttk.Combobox(row, width=27, textvariable=self.country_var)
        self.populateCountriesCombobox(master)
        row.pack(pady=15)
        lab.pack(side='left')
        self.countries.pack(side='right')
        self.countries.current(0)
        self.countries.bind("<<ComboboxSelected>>", self.countrySelected)

        #combobox to select stock
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Stock Name',font=('Arial', 12, 'bold'))
        self.stocks = ttk.Combobox(row, width=27, textvariable=self.stock_var)
        #self.stocks['values'] = ['Select Country First']
        row.pack(pady=15)
        lab.pack(side='left')
        self.stocks.pack(side='right')
        #self.stocks.current(0)
        self.stocks.bind("<<ComboboxSelected>>", self.stockSelected)

        #definition of Text widget to display stock information after retrieval
        '''row = tk.Frame(self)
        self.display = tk.Text(row, bg='white', wrap=tk.WORD, font=('Arial', 12), width=60, height=10)
        row.pack(pady=15)
        self.display.pack()'''

        #start date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='Start Date', font=('Arial',12, 'bold'),width=30,relief='ridge')
        self.start_date = tk.Entry(row, width=25, font=('Arial',12,'bold'), relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.start_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format (dd/mm/yyyy)', font=('Arial',10,'italic'))
        row.pack()
        hint.pack()
        big_row.pack(pady=15,padx=10)

        #end date definition
        big_row = tk.Frame(self)
        row = tk.Frame(big_row)
        lab = tk.Label(row, text='End Date', font=('Arial',12, 'bold'),width=30,relief='ridge')
        self.end_date = tk.Entry(row, width=25, font=('Arial',12,'bold'), relief='sunken')
        row.pack()
        lab.pack(side='left')
        self.end_date.pack(side='right')

        row = tk.Frame(big_row)
        hint = tk.Label(row, text='date format (dd/mm/yyyy)', font=('Arial',10,'italic'))
        row.pack()
        hint.pack()
        big_row.pack(pady=15, padx=10)

        #plot button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Plot Data', width=20, font=('Arial',12,'bold'),command=lambda:self.plotData(master))
        row.pack(pady=15)
        but.pack()

        #update all button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Update All', width=20, font=('Arial',12, 'bold'))
        row.pack(pady=15)
        but.pack()

        #back button
        row = tk.Frame(self)
        but = tk.Button(row, text='Back', width=20, command=lambda:self.goBack(master))
        row.pack(pady=10)
        but.pack()

    #handles back button click
    def goBack(self, master):
        from investing_select_data import SelectData
        master.switch_frame(SelectData)

    #function to populate the countries
    def populateCountriesCombobox(self, master):
        countries = self.api.getStockCountries()
        temp = []

        #for each item in the list append into combobox
        for i,country in enumerate(countries):
            temp.append(country)
        
        self.countries['values'] = temp

    #function to handle selection of country in combobox as well as retrieving appropriate stocks for that country
    def countrySelected(self, event):
        selected = event.widget.get()
        self.api.setCountry(selected)

        print('Country:')
        print(selected)

        #delete any data showing 
        '''if len(self.display.get('1.0','end-1c')) != 0:
            self.display.delete('1.0',tk.END)
            self.api.setCountry(None)
            self.api.setStock(None)'''

        #get the stocks for the stocks combo box
        stocks = self.api.getStocksDict(country=selected)
        temp = []

        #for each item append to stocks comboxbox
        for i,stock in enumerate(stocks):
            temp.append(stock['full_name'])

        self.stocks['values'] = temp

    #function to handle selecting stock
    def stockSelected(self, event):
        selected = event.widget.get()
        self.api.setStock(selected)
        print("Stock")
        print(selected)

    #function to handle plotting of data from selected parameters.
    def plotData(self,master):
        if self.api.getStock() == None:
            mb.showinfo('Notice', 'Select a Stock')
            return
        elif self.api.getCountry() == None:
            mb.showinfo('Notice','Select a Country')
            return

        #check start date and end date
        if self.start_date.get() == None:
            mb.showinfo('Notice', 'Enter start date')
            return
        elif self.end_date.get() == None:
            mb.showinfo('Notice', 'Enter end date')  
            return

        #first check for data in database
        data = {
            'stock_name' : self.api.getStock(),
            'country_name': self.api.getCountry(),
            'start_date' : self.start_date.get(),
            'end_date' : self.end_date.get()
        }

        print(json.dumps(data))

        headers= {
            'Content-Type': 'application/json',
            'Accept' : 'text/plain'
        }
        result = requests.post('http://localhost:8080/investing/stocks/get',data=json.dumps(data),headers=headers).json()
        print("Result: ")
        print(result)

        if len(result['data']) > 0:
            df = pd.DataFrame.from_dict(result['data'],orient='index')
            #TODO : plot candle sticks using appropriate modules

        else:
            #update data
            self.updateData()
            self.plotData(master)


    #function to handle updating data in the database server
    def updateData(self):
        #input stock name and country name
        if self.api.getStock() == None:
            mb.showinfo('Notice', 'Select a Stock')
            return
        elif self.api.getCountry() == None:
            mb.showinfo('Notice','Select a Country')
            return

        data = {'stock_name':self.api.getStock(),'country_name':self.api.getCountry()}
        headers = {'Content-Type':'application', 'Accept': 'text/plain'}
        print(json.dumps(data))
        #get most recent record from server
        recent = requests.post("http://localhost:8080/investing/stocks/get/recent",data=json.dumps(data),headers=headers)
        print("Response from server")
        print(recent)

        #get the date
        #date = datetime.datetime.strptime(recent['updated_at'],"%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y")

        if recent.status_code == 404:
            #get historical data from 01/01/1980 to Date.now - 1 day
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.setToDate(now.strftime("%d/%m/%Y")) 
            
            historical = self.api.getStockData()
            print("Historical")
            print(historical)

            #send data to mongodb server
            #create new instances
            data = {
                'stock_name' : self.api.getStock(),
                'country_name': self.api.getCountry(),
                'data' : historical['historical']
            }

            headers = {
                'Content-Type': 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/stocks/create',data=json.dumps(data),headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice',r['message'])
            else:
                mb.showinfo('Notice',r['message'])
        
        elif recent.status_code == 200: 
            #get recent data for the country and stock
            recent_data = self.api.getRecentStockData()
            print(recent_data)

            #update existing instance
            data = {
                'stock_name' : self.api.getStock(),
                'country_name': self.api.getCountry(),
                'data' : recent_data['recent']
            }

            headers = {
                'Content-Type': 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/stocks/update',json.dumps(data), headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice',r['message'])
            else:
                mb.showinfo('Notice',r['message'])

        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', recent.json()['message'])
        #continue exection of program after updating.