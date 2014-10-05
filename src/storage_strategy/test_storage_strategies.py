__author__ = 'Quantik'
import unittest
import os, sys
import json
from lib.local_storage_strategy import LocalStorageStrategy
from lib.remote_storage_strategy import RemoteStorageStrategy

TEST_FILE = 'test.json'
SERVER_HOST = 'http://localhost'
SERVER_PORT = 2000
SERVER_ENDPOINT='metadata'
SERVER_URL = '%s:%s/%s' % (SERVER_HOST, SERVER_PORT, SERVER_ENDPOINT)

TEST_DATA = [{'type':'course', 'searchValue':'course^course-Main Dishes'}, {'type':'course', 'searchValue':'course^course-Desserts'}, {'type': 'bogus', 'searchValue': 'hello'}]
class TestStorageStrategies(unittest.TestCase):
	def setUp(self):
		# self.local = LocalStorageStrategy(storage_path='test.json')
		self.node_data = TEST_DATA
		self.local_path = TEST_FILE
		self.remote_path = SERVER_URL
		self.remote = RemoteStorageStrategy(storage_path=self.remote_path)
		self.local = LocalStorageStrategy(storage_path=self.local_path)

	def test_base_strategy_initialization(self):
		self.assertEquals(self.local.storage_path, self.local_path)
		self.assertEquals(self.remote.storage_path, SERVER_URL)

	def test_exceptions(self):
		with self.assertRaises(ValueError) as context:
			LocalStorageStrategy()
		self.assertEqual(context.exception.message, 'No storage_path provided')

		with self.assertRaises(ValueError) as context:
			RemoteStorageStrategy()
		self.assertEqual(context.exception.message, 'No storage_path provided')

		with self.assertRaises(ValueError) as context:
			LocalStorageStrategy(storage_path='')
		self.assertEqual(context.exception.message, 'No storage_path provided')

	def test_local_strategy(self):
		self.local.store(self.node_data)
		self.assertTrue(os.path.exists(self.local_path))
		with open(self.local_path, 'r') as f:
			self.assertEquals(json.loads(f.readline()), self.node_data)

	def test_remote_strategy(self):
		self.remote.store_node(self.node_data)
		nodes = self.remote.retrieve()

		self.assertEquals(nodes, self.node_data)
	def tearDown(self):
		if os.path.exists(self.local_path):
			os.remove(self.local_path)