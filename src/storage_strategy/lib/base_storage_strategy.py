__author__ = 'Quantik'

class BaseStorageStrategy():
		def __init__(self, storage_path):
			self._storage_path = storage_path
			# print '[BaseStorageStrategy::__init__] storage_path %s' % self._storage_path
			if not self._storage_path:
				raise ValueError('No storage_path provided')

