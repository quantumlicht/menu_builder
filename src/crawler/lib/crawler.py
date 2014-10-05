__author__ = 'Quantik'

from ...storage_strategy.lib.local_storage_strategy import LocalStorageStrategy
from ...storage_strategy.lib.remote_storage_strategy import RemoteStorageStrategy
from ...connector.lib.connector import Connector
from ...metadata.lib.metadata_factory import MetaDataFactory
from ...error.lib.errors import APIError
from collections import defaultdict


class Watcher(object):
	def __init__(self, limit):
		self._counts = defaultdict(int)
		self._limit = limit

	def increment(self, type, inc=1):
		self._counts[type] += 1
		if sum(self._counts.values()) % 100 == 0:
			print '[Watcher::increment] counts %s' % self._counts
		if sum(self._counts.values()) >= self._limit:
			raise APIError('API call limit reached')

	def report(self):
		print '[Watcher:increment] counts %s' % self._counts
		print '[Watcher:increment] total calls: %s' % sum(self._counts.values())

class Crawler(object):

	def __init__(self, auth={}, urls={}, force_sync=False, config={}, api_limit=0):
		self._auth = auth
		self._urls = urls
		self._FORCE_SYNC = force_sync
		self._API_LIMIT = api_limit
		self._config = config
		self._API_WATCHER = Watcher(self._API_LIMIT)
		self._data_target = []

		config_strategy = LocalStorageStrategy if self._urls['config']['store_type'] == 'local' else RemoteStorageStrategy
		meta_strategy = LocalStorageStrategy if self._urls['metadata']['store_type'] == 'local' else RemoteStorageStrategy
		data_strategy = LocalStorageStrategy if self._urls['data']['store_type'] == 'local' else RemoteStorageStrategy

		self._config_strategy = config_strategy(storage_path = self._urls['config']['store'])
		self._metadata_strategy = meta_strategy(storage_path = self._urls['metadata']['store'])
		self._data_strategy = data_strategy(storage_path = self._urls['data']['store'])

		self._meta_get_connector = Connector(endpoint=self._urls['metadata']['get'], credentials=self._auth,
											watcher=self._API_WATCHER, id='metadata-get')

		self._data_get_connector = Connector(endpoint=self._urls['data']['get'], credentials=self._auth,
											watcher=self._API_WATCHER, id='data-get')

		self._data_search_connector = Connector(endpoint=self._urls['data']['search'], credentials=self._auth,
												watcher=self._API_WATCHER, id='data-search' )

		self._metadataFactory = MetaDataFactory(storage=self._metadata_strategy, connector=self._meta_get_connector,
												force_sync=self._FORCE_SYNC)

		# LEGACY STUFF
		# local_meta_strategy = LocalStorageStrategy(storage_path='local_store/metadata')
		# local_recipe_strategy = LocalStorageStrategy(storage_path='local_store/recipe')
		# remote_meta_strategy = RemoteStorageStrategy(storage_path=METADATA_REMOTE_STORAGE_URL)
		# remote_recipe_strategy = RemoteStorageStrategy(storage_path=RECIPE_REMOTE_STORAGE_URL)
		# local_config_strategy = LocalStorageStrategy(storage_path='local_store/config')

		# ingredients = metadataFactory.getMetadata(type='ingredient').get_data()
		# cuisines = metadataFactory.getMetadata(type='cuisine').get_data()
		# diets = metadataFactory.getMetadata(type='diet').get_data()
		# allergies = metadataFactory.getMetadata(type='allergy').get_data()
		# holidays = metadataFactory.getMetadata(type='holiday').get_data()

	def crawl(self):
		raise NotImplementedError('This should be implemented by the child class.')