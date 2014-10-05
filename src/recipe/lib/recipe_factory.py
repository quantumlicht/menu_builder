__author__ = 'Quantik'


from yummly_recipe import YummlyRecipe

class RecipeFactory(object):
	def __init__(self, recipe_class=YummlyRecipe, connector=None, storage=None):
		self._recipe_class = recipe_class
		self._connector = connector
		self._storage = storage

	def get_recipe(self, data):
		recipe = self._recipe_class(storage = self._storage, data=data)
		extra_data = self._connector.get_data(data.get('id',''))
		recipe.build(extra_data)
		return recipe