import unittest
from unittest import mock
from mock import MagicMock
from mock import patch
import sys
import os

sys.path.append("../logger")
from file_handler import FileHandler

from logger import Logger, Level


class LoggerTest(unittest.TestCase):
    def setup(self, level):
        self.logger = Logger("Logger_Test", level=level)
        self.writer = MagicMock()

    def test_singleton_design_pattern(self):
        logger1 = Logger()
        logger2 = Logger()
        assert logger1 is logger2

    @patch("file_handler.FileHandler.get_write_handle")
    def test_debug_level_write_debug(self, _handle):
        self.setup(Level.debug)
        _handle.return_value = self.writer

        self.logger.debug("message")

        self.logger.writer.write.assert_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_debug_level_write_warning(self, _handle):
        self.setup(Level.debug)
        _handle.return_value = self.writer

        self.logger.warn("message")

        self.logger.writer.write.assert_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_debug_level_write_error(self, _handle):
        self.setup(Level.debug)
        _handle.return_value = self.writer

        self.logger.error("message")

        self.logger.writer.write.assert_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_warn_level_not_write_debug(self, _handle):
        self.setup(Level.warning)
        _handle.return_value = self.writer

        self.logger.debug("message")

        self.logger.writer.write.assert_not_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_warn_level_write_warning(self, _handle):
        self.setup(Level.warning)
        _handle.return_value = self.writer

        self.logger.warn("message")

        self.logger.writer.write.assert_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_warn_level_write_error(self, _handle):
        self.setup(Level.warning)
        _handle.return_value = self.writer

        self.logger.error("message")

        self.logger.writer.write.assert_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_error_level_not_write_debug(self, _handle):
        self.setup(Level.error)
        _handle.return_value = self.writer

        self.logger.debug("message")

        self.logger.writer.write.assert_not_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_error_level_not_write_warning(self, _handle):
        self.setup(Level.error)
        _handle.return_value = self.writer

        self.logger.warn("message")

        self.logger.writer.write.assert_not_called()

    @patch("file_handler.FileHandler.get_write_handle")
    def test_error_level_write_error(self, _handle):
        self.setup(Level.error)
        _handle.return_value = self.writer

        self.logger.error("message")

        self.logger.writer.write.assert_called()


if __name__ == "__main__":
    unittest.main()
