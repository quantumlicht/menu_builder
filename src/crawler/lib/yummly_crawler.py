__author__ = 'Quantik'

from datetime import datetime
import urllib2
import pprint
from ...config.lib.config import Config
from ...recipe.lib.yummly_recipe import YummlyRecipe
from ...recipe.lib.recipe_factory import RecipeFactory

from ...error.lib.errors import APIError
from crawler import Crawler

pp = pprint.PrettyPrinter(indent=2)
class YummlyCrawler(Crawler):

	def __init__(self, auth={}, urls={}, force_sync=False, config={}, api_limit=0):
		Crawler.__init__(self, auth, urls, force_sync, config, api_limit)
		self._type = config['fetch_by_type']
		self._filter = config['filter_key']

		self._count_cfg = Config(storage=self._config_strategy, type='counts')
		self._offset_cfg = Config(storage=self._config_strategy, type='offsets')

		self._MAX_RESULT_PER_TARGET = 0
		self._recipe_factory = RecipeFactory(connector=self._data_get_connector, storage=self._data_strategy)

	def _get_data_target_counts(self, targets):
		target_counts = {}
		for target in targets:
			filter = {self._filter: target}
			query_params = dict()
			query_params.update(filter)
			query_params.update({'maxResult':1})

			connector = self._data_search_connector
			connector.query_params = query_params

			target_counts[target]= connector.get_data()['totalMatchCount']

		print '[YummlyCrawler::get_target_counts] counts %s' % target_counts
		return target_counts

	def _get_configs(self):

		counts = self._count_cfg.retrieve()
		if counts is None:
			counts = self._get_data_target_counts(self._data_target)
			self._count_cfg.save(counts)

		offsets = self._offset_cfg.retrieve()
		if offsets is None:
			offsets = [0] * len(self._data_target)
			self._offset_cfg.save(offsets)

		return (counts, offsets)


	def crawl(self):

		self._data_target = self._metadataFactory.get_metadata(type=self._type).get_data()
		(counts, offsets) = self._get_configs()
		#  _MAX_RESULT_PER_TARGET - 1 call / per category to get list
		self._MAX_RESULT_PER_TARGET = int(self._API_LIMIT / len(counts))  - 1
		if self._MAX_RESULT_PER_TARGET < 0 :
			self._MAX_RESULT_PER_TARGET = 1
		# print 'data_target', self._data_target
		try:

			for id, data_target in enumerate(self._data_target):
				query_params = dict()
				data_filter = {self._filter: data_target}
				query_params.update(data_filter)
				query_params.update({'maxResult': self._MAX_RESULT_PER_TARGET, 'start': offsets[id]})
				print '%s params'% datetime.now(), query_params
				# params.update({'facetField[]':'diet', 'facetField[]': 'data_target'})
				connector = self._data_search_connector
				connector.query_params = query_params
				recipes = connector.get_data()

				# pp.pprint('[YummlyCrawler::crawl] recipes returned:')
				# pp.pprint(len(recipes['matches']))
				for recipe in recipes['matches']:
					r = self._recipe_factory.get_recipe(recipe)
					# extra_data = self._data_get_connector.get_data(recipe.get('id'))

					# r = YummlyRecipe(connector=self._data_get_connector, storage=self._data_strategy, data=recipe)
					# r.build_recipe(extra_data)
					r.save()

				offsets[id] += len(recipes['matches'])
				if offsets[id]>= counts[data_target]:
					print 'Got all results for target %s' % data_target
					break # We got all results
				self._offset_cfg.data = offsets
			self._offset_cfg.save()
			self._API_WATCHER.report()
		except urllib2.HTTPError as e:
			self.crawl()
			self._API_WATCHER.report()
		except APIError as e:
			print '[YummlyCrawler::crawl] API Error %s' % e
			self._offset_cfg.save()