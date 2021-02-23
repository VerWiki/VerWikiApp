import unittest
from unittest.mock import MagicMock, Mock, patch
import sys
import os

sys.path.append("../logger")
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/logger")
from file_handler import FileHandler

NAME_OF_LOGS_DIR = "logs"


class FileHandlerTest(unittest.TestCase):
    def setup(self):
        self.file_handler = FileHandler("test_name")
        self.name = self.file_handler.create_name()

    def test_create_name_is_string(self):
        self.setup()
        assert isinstance(self.name, str)

    def test_create_name_contains_name(self):
        self.setup()
        assert self.name.startswith("test_name")

    def test_100_file_names_do_not_collide(self):
        self.setup()
        name_list = []
        for i in range(100):
            new_name = self.file_handler.create_name()
            assert not new_name in name_list
            name_list.append(new_name)

    def test_log_directory_is_string(self):
        self.setup()
        assert isinstance(self.file_handler.get_log_directory(), str)

    def test_open_new_file_write_exists_throws_error(self):
        self.setup()

        # Mock directory existing and return true
        _dir_exists = MagicMock()
        with patch("os.path.exists", _dir_exists):
            _dir_exists.return_value = True

            # Mock call to builtin open function
            _open = unittest.mock.mock_open()
            _open.side_effect = IOError()

            with patch("builtins.open", _open):
                self.assertRaises(IOError, self.file_handler.open_new_file_write)

    @patch("os.mkdir")
    def test_open_new_file_write_nonexistent_throws_error(self, _mkdir):
        self.setup()
        _dir_exists = MagicMock()
        with patch("os.path.exists", _dir_exists):
            _dir_exists.return_value = False

            # Mock call to builtin open function
            _open = unittest.mock.mock_open()
            _open.side_effect = IOError()

            with patch("builtins.open", _open):
                self.assertRaises(IOError, self.file_handler.open_new_file_write)

    @patch("file_handler.FileHandler.close_file")
    @patch("builtins.open")
    @patch("os.path.exists")
    def test_open_new_file_write_existing_directory(self, _dir_exists, _open, _close):
        self.setup()
        _dir_exists.return_value = True
        _close.return_value = True
        _open.return_value = "opened"
        self.file_handler.open_new_file_write()
        self.assertEqual("opened", self.file_handler.file_handle)

    @patch("os.mkdir")
    @patch("file_handler.FileHandler.close_file")
    @patch("builtins.open")
    @patch("os.path.exists")
    def test_open_new_file_write_non_existing_directory(
        self, _dir_exists, _open, _close, _mkdir
    ):
        self.setup()
        _dir_exists.return_value = False
        _close.return_value = True
        _open.return_value = "opened"
        self.file_handler.open_new_file_write()
        self.assertEqual("opened", self.file_handler.file_handle)

    @patch("file_handler.FileHandler.close_file")
    @patch("builtins.open")
    @patch("os.path.exists")
    @patch("os.mkdir")
    @patch("file_handler.FileHandler.open_new_file_write")
    def test_get_write_handle_returns_handle(
        self, _open_new_file, _mkdir, _dir_exists, _open, _close
    ):
        self.setup()

        _open_new_file.side_effect = self.set_file_handle_to_non_null
        self.file_handler.get_write_handle()

        self.assertTrue(self.file_handler.file_handle != None)

        self.file_handler.get_write_handle()
        _open_new_file.assert_called_once()

    def test_get_full_path_is_string(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert isinstance(full_path, str)

    def test_get_full_path_contains_name(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert self.file_handler.file_name in full_path

    def test_get_full_path_contains_dir_name(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert NAME_OF_LOGS_DIR in full_path

    @patch("file_handler.FileHandler.close_file")
    def test_close_file_throws_exception(self, _close):
        self.setup()
        self.set_file_handle_to_non_null()
        _close.side_effect = IOError()

        self.assertRaises(IOError, self.file_handler.close_file)

    def set_file_handle_to_non_null(self):
        self.file_handler.file_handle = MagicMock()

    @patch("os.mkdir")
    @patch("file_handler.FileHandler.close_file")
    @patch("builtins.open")
    @patch("os.path.exists")
    def test_open_new_file_write_non_existing_directory(
        self, _dir_exists, _open, _close, _mkdir
    ):
        self.setup()
        _dir_exists.return_value = False
        _close.return_value = True
        _open.return_value = "opened"
        self.file_handler.open_new_file_write()
        self.assertEqual("opened", self.file_handler.file_handle)

    @patch("file_handler.FileHandler.close_file")
    @patch("builtins.open")
    @patch("os.path.exists")
    @patch("os.mkdir")
    @patch("file_handler.FileHandler.open_new_file_write")
    def test_get_write_handle_returns_handle(
        self, _open_new_file, _mkdir, _dir_exists, _open, _close
    ):
        self.setup()

        _open_new_file.side_effect = self.set_file_handle_to_non_null
        self.file_handler.get_write_handle()

        self.assertTrue(self.file_handler.file_handle != None)

        self.file_handler.get_write_handle()
        _open_new_file.assert_called_once()

    def test_get_full_path_is_string(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert isinstance(full_path, str)

    def test_get_full_path_contains_name(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert self.file_handler.file_name in full_path

    def test_get_full_path_contains_dir_name(self):
        self.setup()
        full_path = self.file_handler.get_full_path()
        assert NAME_OF_LOGS_DIR in full_path

    def test_get_full_path_create_name_contains_name_name(self):
        self.setup()
        self.file_handler.full_name = self.file_handler.file_name
        full_path = self.file_handler.get_full_path()
        assert self.file_handler.file_name in full_path

    def test_get_full_path_create_name_contains_dir_name(self):
        self.setup()
        self.file_handler.full_name = self.file_handler.file_name
        full_path = self.file_handler.get_full_path()
        assert NAME_OF_LOGS_DIR in full_path

    @patch("file_handler.FileHandler.close_file")
    def test_close_file_throws_exception(self, _close):
        self.setup()
        self.set_file_handle_to_non_null()
        _close.side_effect = IOError()

        self.assertRaises(IOError, self.file_handler.close_file)

    @patch("builtins.open")
    def test_close_file_closes_file(self, _open):
        self.setup()
        _file = MagicMock()
        _open.return_value = _file
        self.file_handler.file_handle = _file

        self.file_handler.close_file()

        _file.close.assert_called()

    def set_file_handle_to_non_null(self):
        self.file_handler.file_handle = MagicMock()


if __name__ == "__main__":
    unittest.main()
