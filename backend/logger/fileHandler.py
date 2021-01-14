import os
import uuid
import datetime
import atexit

class FileHandler():
	'''
	In charge of handling files for the logger. This class will open, close, 
	and name files for the logger. Responsible for storing logs in safe place.
	In addition, it will pass file handles to different programs.
	'''

	def __init__(self, file_name):
		self.file_name = file_name
		self.full_name = file_name
		self.file_handle = None

		atexit.register(self.closeFile)

	def createName(self):
		''' Create and return the name of the file.
		The format is filename-uid-date 
		
		Returns:
		name (str) : the name of the file
		'''
		date = datetime.date.today().strftime("%b-%d-%Y")
		uid = str(uuid.uuid4())
		self.full_name =  self.file_name + "-" + uid + "-" + date + ".log"
		return self.full_name

	def getFileLocation(self):
		''' Return the location in which the file should be
		stored. Print this to stdout as well. Return value
		is platform-dependent
		
		Returns:
		location (str) : location log will be stored 
		'''
		
		curr_dir = os.getcwd()
		if(os.name == 'nt'):
			return curr_dir + "\..\logs\\"
		else:
			return curr_dir + "/../logs/"

	def openNewFileWrite(self):
		''' Open a new file to write to. Write the file to the
		location from getFileLocation and use the name created
		by createName. Set the class's file_handle as the new
		handle opened to write
		'''

		if os.path.exists(self.getFileLocation()):
			self.file_handle = open(self.getFullPath(), "a")
		else:
			os.mkdir(self.getFileLocation())
			self.file_handle = open(self.getFullPath(), "a")

	def getWriteHandle(self):
		''' Get the handle of the class for writing to the file
		
		Returns:
		File Handle (object) : File write handler
		'''
		if self.file_handle == None:
			self.openNewFileWrite()
		return self.file_handle
	
	def getFullPath(self):
		''' Get the full path of where the log is stored
		'''
		if (self.full_name != self.file_name): #File name has already been created
			 return self.getFileLocation() + self.full_name
		self.full_name = self.createName() #Name hasn't been created. Do it now.
		return self.getFileLocation() + self.full_name

	def closeFile(self):
		''' Close the file handle
		'''
		self.file_handle.close()
