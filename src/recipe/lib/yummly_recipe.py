__author__ = 'Quantik'

from recipe import Recipe

class YummlyRecipe(Recipe):

	def build(self, extra_data=None):
		# print '[YummlyRecipe::build] data %s' % self._data
		self._data['extra'] = extra_data
		self._recipe = {'recipeName': self._get_field('name'),
			'id': self._get_field('id'),
			'flavors': [{'name': k, 'intensity': v} for k, v in self._get_field('flavors').items()],
			'course': self._get_field('attributes', 'course', 0),
			'rating': self._get_field('rating'),
			'ingredients': self._get_field('ingredients'),
			'nutrients': self._get_field('nutritionEstimates'),
			'totalTimeInSeconds': self._get_field('totalTimeInSeconds'),
			'recipeUrl': self._get_field('source', 'sourceRecipeUrl'),
			'imageUrl': self._get_field('images', 0, 'hostedLargeUrl'),
			'numberOfServings': self._get_field('numberOfServings')
		}

		faults = self._get_faults()
		if faults is not None:
			print 'WARNING Recipe {0} is not fully defined. {1}'. format(self._recipe.get('id'), faults)
			# print self._data

		# print '[YummlyRecipe::build] # nutrients {0} totalTimeInSeconds {1}'.format(len(self._recipe.get('nutrients')), self._recipe.get('totalTimeInSeconds'))

	def _get_faults(self):
		faults = list()
		b_ret = True
		# print self._recipe
		for k,v in self._recipe.iteritems():

			if v is None:
				faults.append(k)
				b_ret=False
		if b_ret:
			return None
		else:
			return faults

	def flatten(self):
		keys = []
		values = []
		if len(self._recipe.get('flavors', [])) > 0:
			for i in self._recipe.get('flavors'):
				keys.append('flavors-' + i['name'])
				values.append(i['intensity'])
		else:
			# print 'No Flavors Defined'
			return None, None
		keys.append('rating')
		values.append(self._recipe.get('rating'))

		# TODO: Make sure the nutrients are always returned at the same position
		if len(self._recipe.get('nutrients', [])) > 0:
			temp_list = [0] * len(self.ALLOWED_NUTRIENTS)
			ix = 0
			for nutrient in self._recipe.get('nutrients'):
				if nutrient.get('attribute') in self.ALLOWED_NUTRIENTS.keys():
					keys.append('nutrients-' + nutrient.get('attribute'))
					temp_list[ix] = (nutrient.get('value'))
					ix += 1

			values += temp_list
		else:
			# print 'No Nutrients defined'
			return None, None
		if self._recipe.get('totalTimeInSeconds') is not None:
			keys.append('totalTimeInSeconds')
			values.append(self._recipe.get('totalTimeInSeconds'))
		else:
			# print 'No totalTimesInSeconds defined'
			return None, None

		if self._recipe.get('numberOfServings') is not None:
			keys.append('numberOfServings')
			values.append(self._recipe.get('numberOfServings'))
		else:
			# print 'No Servings Defined'
			return None, None

		return keys, values

	def _get_field(self, *keys):
		# print 'initial keys', keys
		keys = list(keys)
		key = keys.pop(0)

		base = self._data['base'].get(key, None)
		extra = self._data['extra'].get(key, None)

		try:
			if base is not None and len(base) == 0 and extra is not None and len(extra) == 0:
				start_struct = {}
		except TypeError:
			start_struct = base or extra
		else:
			start_struct = base or extra

		field = None

		struct = start_struct
		for key in keys:
			try:
				#we need to look in an array
				next_key = int(key)

			except ValueError as e:
				# print e
				struct = struct.get(key, {})
			# print 'new struct on error', struct
			else:
				if len(struct)> 0:
					struct = struct[next_key]

		# print 'returned struct', struct
		return struct
	# print 'key',key,  'base',self._data['base'].get(key), 'extra', self._data['extra'].get(key), 'ret', self._data['base'].get(key, None) or self._data['extra'].get(key, None)