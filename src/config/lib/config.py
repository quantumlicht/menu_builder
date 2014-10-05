__author__ = 'Quantik'


class Config(object):
	def __init__(self, storage=None, data=dict(), type=None):
		self._storage = storage
		self._config = data

		if type is None or type == '':
			raise ValueError('the type cannot be None or empty.')

		self._type = type
	def save(self, data=None):
		if data is None:
			self._storage.store(self._config, self._type)
		else:
			print '[Config::save] data %s' % data
			self._storage.store(data, self._type)

	def retrieve(self):
		return self._storage.retrieve(self._type)
	@property
	def data(self):
		return self._config

	@data.setter
	def data(self, value):
		self._config = value

