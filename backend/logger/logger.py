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
		if self.level > 0:
			return
		self.writer.write("DEBUG: " + message + "\n")

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

if __name__ == "__main__":
	logger = Logger(level=2)
	logger.debug("This is my first debug message")
	logger.warning("This is my first warning message")
	logger.error("This is my first error message")
	logger.fileHandler.closeFile()
