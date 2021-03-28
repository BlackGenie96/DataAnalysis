import tkinter as tk
import tkinter.messagebox as mb
from tkinter import ttk
import pandas as pd
import datetime

from investing_currency_cross_api import *
from scrollable_frame import *

class PlotCrossesFrame(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self, master)

        self.cross_var = tk.StringVar()
        self.api = CrossesAPI()

        row = tk.Frame(self)
        lab = tk.Label(row, text='Currency Crosses Plotting', font=('Arial', 14,'bold'))
        row.pack()
        lab.pack()

        #combobox for selecting currency crosses
        row = tk.Frame(self)
        lab = tk.Label(row, text='Select Currency Cross', font=('Arial',12, 'bold'))
        self.crosses = ttk.Combobox(row, width=27, textvariable=self.cross_var)
        self.populateCrossesCombobox(master)
        row.pack(pady=15)
        lab.pack(side='left')
        self.crosses.pack(side='right')
        self.crosses.current(0)
        self.crosses.bind("<<ComboboxSelected>>", self.crossSelected)

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

    #handle going back
    def goBack(self, master):
        from investing_select_data import SelectData
        master.switch_frame(SelectData)
    
    #function to populate crosses combobox
    def populateCrossesCombobox(self,master):
        crosses = self.api.getCrossesDict()
        temp = []

        #append to combobox array
        for i,cross in enumerate(crosses):
            temp.append(f"{cross['base']}/{cross['second']}")

        self.crosses['values'] = temp

    #handle selection of combobox item
    def crossSelected(self, event):
        selected = event.widget.get()
        self.api.setCross(selected)
    
    #plots data
    def plotData(self,master):
        if self.api.getCross() == None or self.api.getCross() == '':
            mb.showinfo('Notice', 'Select an Currency Cross')
            return
        elif self.start_date.get() == None or self.start_date.get() == '':
            mb.showinfo('Notice', 'Enter start date')
            return
        elif self.end_date.get() == None or self.end_date.get() == '':
            mb.showinfo('Notice', 'Enter end date')
            return
        
        #check for data in mongo db server
        data = {
            'currency_name' : self.api.getCross(),
            'start_date' : datetime.datetime.strptime(self.start_date.get(),'%d/%m/%Y'),
            'end_date' : datetime.datetime.strptime(self.end_date.get(), '%d/%m/%Y')
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept'      : 'text/plain'
        }

        result = requests.post('http://localhost:8080/investing/currency_crosses/get',json.dumps(data),headers=headers).json()

        if result['success'] == 1:
            df = pd.DataFrame.from_dict(result['data'],orient='index')
            #TODO: plot candle sticks
        else: 
            self.updateData()
            self.plotData(master)
    
    #function to update data in database server
    def updateData(self):
        #check for index name and country name
        if self.api.getCross() == None or self.api.getCross() == "":
            mb.showinfo('Notice', "Select an Index")
            return

        #get most recent record from server with this name
        data = {
            'currency_name': self.api.getCross(),
        }

        headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'text/plain'
        }

        recent = requests.post('http://localhost:8080/investing/currency_crosses/get/recent',data=json.dumps(data), headers=headers)
        print(recent)

        if recent.status_code == 404:
            #get historical data starting from 1980
            self.api.setFromDate('01/01/1980')
            now = datetime.datetime.now()
            self.api.toDate(now.strftime('%d/%m/%Y'))

            historical = self.api.getCrossesData()
            print('historical')
            print(historical)

            #send data to mongodb server
            #create new instance
            data = {
                'currency_name' : self.api.getCross(),
                'data' : historical['historical']
            }

            headers = {
                'Content-Type' : 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/currency_crosses/create', data=json.dumps(data), headers=headers).json()

            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else:
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 200:
            #get recent data
            recent_data = self.api.getCrossRecentData()
            print(recent_data)

            #update existing instance
            data = {
                'currency_name' : self.api.getCross(),
                'data' : recent_data['recent']
            }

            headers = {
                'Content-Type' : 'application/json',
                'Accept' : 'text/plain'
            }

            r = requests.post('http://localhost:8080/investing/currency_crosses/update',data=json.dumps(data), headers=headers).json()
            if r['success'] == 1:
                mb.showinfo('Notice', r['message'])
            else:
                mb.showinfo('Notice', r['message'])
        elif recent.status_code == 400 or recent.status_code == 500:
            mb.showinfo('Notice', r['message'])