import os
from base_storage_strategy import BaseStorageStrategy
import json
import os
JSON_FORMAT = 'json'
DEFAULT_STORAGE = 'default'
class LocalStorageStrategy(BaseStorageStrategy):

	#  Here we will assume that each level of the json data passed, with be equivalent to the path of the data to be passed
	def __init__(self, storage_path, format='json'):
		BaseStorageStrategy.__init__(self, storage_path)
		self._storage_format = format

	def store(self, nodes, type):

		if not os.path.exists(self._storage_path):
			os.makedirs(self._storage_path)

		path = '/'.join([self._storage_path, type + '.' + self._storage_format])
		if self._storage_format == JSON_FORMAT:
			print '[LocalStorageStrategy::store_node] writing to file %s' % path
			with open(path, 'w') as f:
				json.dump(nodes, f)
		else:
			raise ValueError("Storage type other than JSON not supported.")

	def retrieve(self, type):
		data = None
		path = '/'.join([self._storage_path, type + '.' + self._storage_format])
		try:
			print '[LocalStorageStrategy::retrieve] retrieving data from file %s' % path
			if os.path.exists(path):
				with open(path, 'r') as f:
					data = f.read()
			else:
				print '[LocalStorageStrategy::retrieve] file is does not exist yet.'
				# print 'DATA %s' % data
		except IOError as e:
			print 'Storage is empty or not accessible. %s' % e
			return data
		else:
			if data is not None and len(data) != 0:
				return json.loads(data)
				print '[LocalStorageStrategy::retrieve] returning from local storage: %s' % res
			return None
