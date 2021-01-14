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
	
	def debug(self, message):
		''' Write a debug message to the file using the writer
		'''
		if self.level > 0:
			return
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("DEBUG: " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")

	def warn(self, message):
		'''Write a warning message to the file using the writer
		'''
		if self.level > 1:
			return
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("WARNING: " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")

	def error(self, message):
		'''Write an error message to the file using the writer
		'''
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("ERROR: " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")
