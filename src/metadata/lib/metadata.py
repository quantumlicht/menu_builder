
class Metadata():
	def __init__(self, type='', storage=None, connector=None, force_sync=False):
		self._meta_type = type
		self._storage_strategy = storage
		self._connector = connector
		self._force_sync = force_sync
		self._metatype_data = []

	def _refresh_data(self):
		result = self._connector.get_data(self._meta_type)
		self._metatype_data = result

		self._storage_strategy.store(self._metatype_data, self._meta_type)
		return self._metatype_data

	def get_data(self):
		# try:

		if self._force_sync:
			data = self._refresh_data()
		else:
			data = self._storage_strategy.retrieve(self._meta_type)
		if data:
			# for x in data:
			# if x.get('type') == self._meta_type:
			# print '[Metadata::get_data] data: %s' % data

			self._metatype_data = [x.get('searchValue') for x in data if x.get('type') == self._meta_type]
			return self._metatype_data
		else:
			return self._refresh_data()
		# except IOError as e:
		# 	print "[MetaData::get_data] Exception Caught: %s. will try to refresh the data source." % e
		# 	return self._refresh_data()
