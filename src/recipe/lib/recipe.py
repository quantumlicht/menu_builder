__author__ = 'Quantik'
from daily_intake import *

class Recipe(object):
	def __init__(self, storage=None, data=dict()):
		self._storage_strategy = storage
		self._data = {'base': data}
		self._recipe = data
		self.ALLOWED_NUTRIENTS = DAILY_INTAKES

	def save(self):
		self._storage_strategy.store(self._recipe, 'recipe')


	def build(self, extra_data={}):
		raise NotImplementedError('This method should be implemented by the child class')


	@property
	def recipe(self):
		return self._recipe

	def flatten(self):
		raise NotImplementedError('This method should be implemented by the child class')