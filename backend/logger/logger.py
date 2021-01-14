from fileHandler import FileHandler

import os
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
		self.writer.write("DEBUG: " + message + "\n")
	
if __name__ == "__main__":
	logger = Logger("omg")
	logger.debug("This is my first debug message")
	logger.fileHandler.closeFile()
