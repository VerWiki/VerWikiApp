import unittest
from unittest.mock import MagicMock
import sys

sys.path.append('../logger')
from file_handler import FileHandler

class FileHandlerTest(unittest.TestCase):
    def setup(self):
        self.file_handler = FileHandler("test_name")
        self.name = self.file_handler.create_name()

    def test_create_name_is_string(self):
        self.setup()
        assert(isinstance(self.name, str))

    def test_create_name_contains_name(self):
        self.setup()
        assert(self.name.startswith("test_name"))

    def test_100_file_names_do_not_collide(self):
        self.setup()
        name_list = []
        for i in range(100):
            new_name = self.file_handler.create_name()
            assert(not new_name in name_list)
            name_list.append(new_name)

    def test_log_directory_is_string(self):
        self.setup()
        assert(isinstance(self.file_handler.get_log_directory(), str))

    
if __name__ == '__main__':
    unittest.main()
