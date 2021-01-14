from fileHandler import FileHandler

import os
from inspect import stack, getframeinfo

''' 
Main class for logging functionalities.
'''
class Logger:

	def __init__(self, file_name="session", level=0):
		self.level = level
		self.file_name = file_name
		self.fileHandler = FileHandler(self.file_name)
		self.writer = self.fileHandler.getWriteHandle()
		self.frameinfo = getframeinfo(stack()[1][0])
	
	def debug(self, message):
		''' Write a debug message to the file using the writer
		'''
		if self.level > 0:
			return
		self.writer.write("DEBUG: " + self.frameinfo.filename +\
						":" + str(self.frameinfo.lineno + 1) + " : " + message + "\n")

	def warning(self, message):
		'''Write a warning message to the file using the writer
		'''
		if self.level > 1:
			return
		self.writer.write("WARNING: " + message + "\n")

	def error(self, message):
		'''Write an error message to the file using the writer
		'''
		self.writer.write("ERROR: " + message + "\n")
