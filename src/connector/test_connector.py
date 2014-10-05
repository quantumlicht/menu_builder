__author__ = 'Quantik'
import unittest
import os, sys
import json
from lib.connector import Connector
from lib.remote_storage_strategy import RemoteStorageStrategy

TEST_FILE = 'test.json'
SERVER_HOST = 'http://localhost'
SERVER_PORT = 2000
SERVER_ENDPOINT='metadata'
SERVER_URL = '%s:%s/%s' % (SERVER_HOST, SERVER_PORT, SERVER_ENDPOINT)

class TestConnector(unittest.TestCase):
	def setUp(self):
		pass

	def test_connector(self):
		pass

	def tearDown(self):
		pass