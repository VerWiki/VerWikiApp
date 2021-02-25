from file_handler import FileHandler
from singleton import Singleton

from datetime import datetime
import enum
import os
from inspect import stack, getframeinfo


class Level(enum.IntEnum):
    DEBUG = 0
    WARNING = 1
    ERROR = 2


class Logger(metaclass=Singleton):
    """
    Main class for logging functionalities.
    """

    def __init__(self, file_name="session", level=Level.DEBUG):
        self.level = level
        file_handler = FileHandler(file_name)
        self.writer = file_handler.get_write_handle()

    def debug(self, message):
        """Write a debug message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """

        if self.level > Level.DEBUG:
            return
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            f"({str(datetime.now().time())}) DEBUG:   {frameinfo.filename}:{str(frameinfo.lineno)} : {message}\n"
        )

    def warn(self, message):
        """Write a warning message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        if self.level > Level.WARNING:
            return
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            f"({str(datetime.now().time())}) WARNING: {frameinfo.filename}:{str(frameinfo.lineno)} : {message}\n"
        )

    def error(self, message):
        """Write an error message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            f"({str(datetime.now().time())}) ERROR:   {frameinfo.filename}:{str(frameinfo.lineno)} : {message}\n"
        )

    def info(self, message):
        """Write an info message to the file using the writer

        Parameters:
        message (str) : The message you want to output.
        """
        frameinfo = getframeinfo(stack()[1][0])
        self.writer.write(
            f"({str(datetime.now().time())}) INFO:   {frameinfo.filename}:{str(frameinfo.lineno)} : {message}\n"
        )

    def set_level(self, level):
        """Set the level of the logger

        Parameters:
        level (int) : The new level of the logger
        """
        if isinstace(level, Level):
            self.level = level
        else:
            raise Exception("The level must be an integer between 0-2 inclusive.")
