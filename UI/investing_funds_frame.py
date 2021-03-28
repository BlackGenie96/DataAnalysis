import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime

from investing_funds_api import *
from scrollable_frame import *

class PlotFundsFrame(tk.Frame):

    def __init__(self, master):
        tk.Frame.__init__(self,master)

        self.fund_var = tk.StringVar()
        self.country_var = tk.StringVar()
        self.api = FundsAPI(master)

        row = tk.Frame(self)
        lab = tk.Label(row, text='Funds Plotting',font=('Arial', 14, 'bold'))
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

        #combobox to select fund
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Fund Name', font=('Arial', 12, 'bold'))
        self.funds = ttk.Combobox(row, width=27, textvariable=self.fund_var)
        row.pack(pady=15)
        lab.pack(side='left')
        self.funds.pack(side='right')
        self.funds.bind("<<ComboboxSelected>>", self.fundsSelected)
        
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
        but = tk.Button(row, text='Update All', width=20, font=('Arial',12,'bold'))
        row.pack(pady=15)
        but.pack()

        #back button definition
        row = tk.Frame(self)
        but = tk.Button(row, text='Back', width=20,command=lambda:self.goBack(master))
        row.pack(pady=10)
        but.pack()

    #handles going back
    def goBack(self, master):
        from investing_select_data import SelectData
        master.switch_frame(SelectData)

    #function to populate countries
    def populateCountriesCombobox(self, master):
        countries = self.api.getFundsCountries()
        temp = []

        #for each item append into combobox
        for i,country in enumerate(countries):
            temp.append(country)

        self.countries['values'] = temp
    
    #function to handle selection of country in combobox and retrieve appropriate funds
    def countrySelected(self, event):
        selected = event.widget.get()
        self.api.setCountry(selected)

        #get funds for funds combobox
        funds = self.api.getFundsDict(country=selected)
        temp = []

        #for each item append into funds combobox
        for i,fund in enumerate(funds):
            temp.append(fund['name'])
        
        self.funds['values'] = temp

    #function to handle selecting fund 
    def fundsSelected(self,event):
        print('Country:')
        print(self.api.getCountry())
        print('I am heres')
        selected = event.widget.get()
        self.api.setFund(selected)
        print('Fund:')
        print(self.api.getFund())

    #function to handle plotting of data from selected parameters.
    def plotData(self,master):
        if self.api.getFund() == None:
            mb.showinfo('Notice', 'Select a Fund')
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
            'fund_name' : self.api.getFund(),
            'country_name': self.api.getCountry(),
            'start_date' : datetime.datetime.strptime(self.start_date.get(),"%d/%m/%Y"),
            'end_date' : datetime.datetime.strptime(self.end_date.get(), "%d/%m/%Y")
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept' : 'text/plain'
        }

        result = requests.post('http://localhost:8080/investing/funds/get',json.dumps(data),headers=headers).json()

        if result['success'] == 1:
            df = pd.DataFrame.from_dict(result['data'],orient='index')
            #TODO : plot candle sticks using appropriate modules

        else:
            #update data
            self.updateData()
            self.plotData(master)


    #function to handle updating data in the database server
    def updateData(self):
        #input fund name and country name
        if self.api.getFund() == None:
            mb.showinfo('Notice', 'Select a Fund')
            return
        elif self.api.getCountry() == None:
            mb.showinfo('Notice','Select a Country')
            return

        #get most recent record from server
        data = {
            'fund_name':self.api.getFund(),
            'country_name':self.api.getCountry()
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept'      : 'text/plain'
        }
        recent = requests.post("http://localhost:8080/investing/funds/get/recent",json.dumps(data), headers=headers)
        print("Response from server")
        print(recent)

        #get the date
        #date = datetime.datetime.strptime(recent['updated_at'],"%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y")

        if recent.status_code == 404:
            #get historical data from 01/01/1980 to Date.now - 1 day
            self.api.setFromDate('01/01/1980')
            self.api.setToDate(datetime.datetime.strptime(datetime.datetime.now().isoformat(),"%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y")) 
            
            historical = self.api.getFundData()
            print(historical)

            #send data to mongodb server
            #create new instances
            data = {
                'fund_name' : self.api.getFund(),
                'country_name': self.api.getCountry(),
                'data' : historical['historical']
            }

            r = requests.post('http://localhost:8080/investing/funds/create',json.dumps(data)).json()

            if r['success'] == 1:
                mb.showinfo('Notice',r['message'])
            else:
                mb.showinfo('Notice',r['message'])
        
        elif recent.status_code == 200: 
            #get recent data for the country and stock
            recent_data = self.api.getRecentFundData()
            print(recent_data)

            #update existing instance
            data = {
                'fund_name' : self.api.getFund(),
                'country_name': self.api.getCountry(),
                'data' : recent_data['recent']
            }

            r = requests.post('http://localhost:8080/investing/funds/update',json.dumps(data)).json()

            if r['success'] == 1:
                mb.showinfo('Notice',r['message'])
            else:
                mb.showinfo('Notice',r['message'])

        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', r['message'])
        #continue exection of program after updating.