#local module imports
from menu import *                          #local module that has the menu definition root

#system module imports
import tkinter as tk
from tkinter import ttk as TTK
import tkinter.filedialog as fd
import tkinter.messagebox as mb
import re
import json

from app import *

#This is the start of the main function
if __name__ == "__main__":
    app = App()
    app.title('Data Collecting and Chart Viewer Tool')
    makemenu(app)
    app.mainloop()