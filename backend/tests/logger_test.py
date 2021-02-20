import pytest

from logger.py import Logger, Level

class LoggerTest:
    def test_singleton_design_pattern(self):
        logger1 = Logger()
        logger2 = Logger()
        assert logger1 is logger2

    def test_debug_level_write_debug(self):
        logger = Logger(file_name="test", level=Level.debug)
        
    def test_debug_level_write_warning(self):
        logger = Logger(file_name="test", level=Level.debug)

    def test_debug_level_write_error(self):
        logger = Logger(file_naem="test", level=Level.debug)

    def test_warn_level_not_write_debug(self):
        logger = Logger(file_name="test", level=Level.warning)

    def test_warn_level_write_warning(self):
        logger = Logger(file_name="test", level=Level.warning)

    def test_warn_level_write_error(self):
        logger = Logger(file_name="test", level=Level.warning)
    
    def test_error_level_not_write_debug(self):
        logger = Logger(file_name="test", level=Level.error)

    def test_error_level_not_write_warning(self):
        logger = Logger(file_name="test", level=Level.error)

    def test_error_level_write_error(self):
        logger = Logger(file_name="test", level=Level.error)
