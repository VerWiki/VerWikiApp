import os
import uuid
import datetime
import atexit


class FileHandler:
    """
    In charge of handling files for the logger. This class will open, close,
    and name files for the logger. Responsible for storing logs in safe place.
    In addition, it will pass file handles to different programs.
    """

    def __init__(self, file_name):
        self.file_name = file_name
        self.full_name = file_name
        self.file_handle = None

        atexit.register(self.close_file)

    def create_name(self):
        """Create and return the name of the file.
        The format is filename-uid-date

        Returns:
        name (str) : the name of the file
        """
        date = datetime.date.today().strftime("%b-%d-%Y")
        uid = str(uuid.uuid4())
        self.full_name = self.file_name + "-" + uid + "-" + date + ".log"
        return self.full_name

    def get_file_location(self):
        """Return the location in which the file should be
        stored. Print this to stdout as well. Return value
        is platform-dependent

        Returns:
        location (str) : location log will be stored
        """

        curr_dir = os.getcwd()
        if os.name == "nt":
            return curr_dir + "\..\logs\\"
        else:
            return curr_dir + "/../logs/"

    def open_new_file_write(self):
        """Open a new file to write to. Write the file to the
        location from get_file_location and use the name created
        by create_name. Set the class's file_handle as the new
        handle opened to write
        """

        if os.path.exists(self.get_file_location()):
            try:
                self.file_handle = open(self.get_full_path(), "a")
            except IOError as e:
                print(e)
        else:
            os.mkdir(self.get_file_location())
            try:
                self.file_handle = open(self.get_full_path(), "a")
            except IOError as e:
                print(e)

    def get_write_handle(self):
        """Get the handle of the class for writing to the file

        Returns:
        File Handle (object) : File write handler
        """
        if self.file_handle == None:
            self.open_new_file_write()
        return self.file_handle

    def get_full_path(self):
        """Get the full path of where the log is stored"""
        if self.full_name != self.file_name:  # File name has already been created
            return self.get_file_location() + self.full_name
        self.full_name = self.create_name()  # Name hasn't been created. Do it now.
        return self.get_file_location() + self.full_name

    def close_file(self):
        """Close the file handle"""
        try:
            self.file_handle.close()
        except IOError as e:
            print(e)
