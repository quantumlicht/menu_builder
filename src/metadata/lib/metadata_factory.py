__author__ = 'Quantik'
from metadata import Metadata
class MetaDataFactory():


	def __init__(self, connector=None, storage=None, force_sync=False ):

		self._connector = connector
		self._storage_strategy = storage
		self._force_sync = force_sync

	def get_metadata(self, type):
		if type is None:
			raise ValueError('You must define a metadata type')
		self._connector.id = type
		return Metadata(type=type, storage=self._storage_strategy, connector=self._connector, force_sync=self._force_sync)
