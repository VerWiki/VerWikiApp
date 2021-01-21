from fileHandler import FileHandler
from singleton import Singleton

import os
from inspect import stack, getframeinfo


class Logger(metaclass=Singleton):
    """
    Main class for logging functionalities.
    """

    def __init__(self, file_name="session", level=0):
        self.level = level
        fileHandler = FileHandler(file_name)
        self.writer = fileHandler.getWriteHandle()

    def debug(self, message):
        """Write a debug message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        if self.level > 0:
            return
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            "DEBUG:   "
            + frameinfo.filename
            + ":"
            + str(frameinfo.lineno)
            + " : "
            + message
            + "\n"
        )

    def warn(self, message):
        """Write a warning message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        if self.level > 1:
            return
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            "WARNING: "
            + frameinfo.filename
            + ":"
            + str(frameinfo.lineno)
            + " : "
            + message
            + "\n"
        )

    def error(self, message):
        """Write an error message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            "ERROR:   "
            + frameinfo.filename
            + ":"
            + str(frameinfo.lineno)
            + " : "
            + message
            + "\n"
        )

    def setLevel(self, level):
        """Set the level of the logger

        Parameters:
        level (int) : The new level of the logger
        """
        if isinstace(level, int) and level > -1 and level < 3:
            self.level = level
        else:
            raise Exception("The level must be an integer between 0-2 inclusive.")
