__author__ = 'Quantik'

import urllib2, urllib
import re
import json

class Connector():
	def __init__(self, endpoint, credentials={}, params={}, watcher=None, id=''):
		self._id = id
		self._query_params = params
		self._credentials = credentials
		self._endpoint = endpoint

		self._watcher = watcher


	def _get_query_string(self, param=None):
		params = {}
		params.update(self._credentials)
		params.update(self.query_params)
		if param:
			qs = (self._endpoint % param) + urllib.urlencode(params)
		else:
			qs = self._endpoint + urllib.urlencode(params)

		# ENABLE QUERY LOGGING
		print '[Connector::_get_query_string] query string [%s]' % qs
		return qs

	def get_data(self, param=None):

		req = urllib2.Request(self._get_query_string(param))
		req.add_header('Content-Type','application/json')
		h = urllib2.urlopen(req)
		result = h.read()
		if self._watcher:
			self._watcher.increment(self._id)
		try:
			data = json.loads(result)
		except ValueError as e:
			parsed_result = re.search('\[.*\]', result)
			data = json.loads(parsed_result.group(0))
		return data

	@property
	def id(self):
		return self._id

	@id.setter
	def id(self, value):
		self._id = value


	@property
	def query_params(self):
		return self._query_params

	@query_params.setter
	def query_params(self, value):
		self._query_params = value
