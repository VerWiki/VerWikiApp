from fileHandler import FileHandler

import decorators
import os
from inspect import stack, getframeinfo

class Singleton(type):
	_instances = {}
	def __call__(cls, *args, **kwargs):
		if cls not in cls._instances:
			cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
		return cls._instances[cls]
        
class Logger(metaclass=Singleton):
	''' 
	Main class for logging functionalities.
	'''

	# A dictionary of processes id's corresponding to file handles
	process_file_handle = {}

	def __init__(self, file_name="session", level=0):
		self.level = level
		self.file_name = file_name
		self.fileHandler = FileHandler(self.file_name)
		self.writer = self.fileHandler.getWriteHandle()
	
	def debug(self, message:str):
		''' Write a debug message to the file using the writer

		Parameters:
		message (str) : The message you want to output.
		'''
		if self.level > 0:
			return
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("DEBUG:   " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")

	def warn(self, message):
		'''Write a warning message to the file using the writer
		
		Parameters:
		message (str) : The message you want to output.
		'''
		if self.level > 1:
			return
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("WARNING: " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")

	def error(self, message):
		'''Write an error message to the file using the writer
		
		Parameters:
		message (str) : The message you want to output.
		'''
		frameinfo = getframeinfo(stack()[1][0])
		self.writer.write("ERROR:   " + frameinfo.filename +\
						":" + str(frameinfo.lineno) + " : " + message + "\n")

