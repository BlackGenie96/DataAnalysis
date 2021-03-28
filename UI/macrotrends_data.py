import requests
from bs4 import BeautifulSoup
import pandas as pd
from time import sleep
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options

#class to store macrotrends data after scraping from macrotrends website
class MacroTrendsAPI:

    def __init__(self, master):
        #class variables
        self.table_options = []             #stores the table_options for different data types
        self.soup = None                    #stores the beautiful soup object
        self.col_headers = None             #column headers for the table
        self.col_data = None                #column data for the different headers

        #retrieve macrotrends stock screener page using selenium
        opts = Options()
        opts.add_argument('-headless')
        self.browser = Firefox(options=opts)
        self.browser.get('https://www.macrotrends.net/stocks/stock-screener')
        
        #parse html content
        self.soup = BeautifulSoup(self.browser.page_source, 'lxml')
        
        #get table options 
        data_options = self.soup.find(id='myPills1')
        
        #list containing table options id's
        col_opts = ['columns_overview', 'columns_descriptive', 'columns_dividend', 'columns_performance_st', 'columns_performance_lt', 'columns_ratios_income', 'columns_ratios_debt', 'columns_rev_earnings']

        #for each column option get the text
        for key,col in enumerate(col_opts):

            #extract table options text
            li = data_options.find(id=col)
            a  = li.find('a').text
            
            self.table_options.append(a)
        
    #function to get the table once the table option has been selected
    def getTable(self,selection=None):
        
        overview_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[1]/a'
        descriptive_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[2]/a'
        dividends_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[3]/a'
        performance_st_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[4]/a'
        performance_lt_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[5]/a'
        income_ratios_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[6]/a'
        debt_ratios_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[7]/a'
        revenue_earnings_but = '/html/body/div[1]/div[4]/div[2]/div/ul/li[8]/a'

        if selection == 'columns_overview':
            browser.find_element_by_xpath(overview_but).click()
        elif selection == 'columns_descriptive':
            browser.find_element_by_xpath(descriptive_but).click()
        elif selection == 'columns_dividend':
            browser.find_element_by_xpath(dividends_but).click()
        elif selection == 'columns_performance_st':
            browser.find_element_by_xpath(performance_st_but).click()
        elif selection == 'columns_performance_lt':
            browser.find_element_by_xpath(performance_lt_but).click()
        elif selection == 'columns_ratios_income':
            browser.find_element_by_xpath(income_ratios_but).click()
        elif selection == 'columns_ratios_debt':
            browser.find_element_by_xpath(debt_ratios_but).click()
        elif selection == 'columns_rev_earnings':
            browser.find_element_by_xpath(revenue_earnings_but).click()
        else:
            print('No data set selection made') 

        self.col_headers = []
        self.col_data = []
        #get content table from soup object
        table = self.soup.find(id='contentjqxGrid')
        col_table = table.find(id='columntablejqxGrid')
        for key,element in enumerate(list(col_table.children)):
            print(element.text)
            self.col_headers.append(element.text)
            self.col_data.append([])

        
        #get the data under the headers 
        table_data = table.find(id='contenttablejqxGrid')
        for key, element in enumerate(list(table_data.children)):       #rows
            for key1,item in enumerate(list(element.children)):           #columns
                print(item.text)
                self.col_data[key1].append(item.text)
            
        print(self.col_headers)
        print('\n')
        print(self.col_data)

        #put data into dataframe
        

