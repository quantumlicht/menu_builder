__author__ = 'Quantik'

import json
import urllib2
import json
from base_storage_strategy import BaseStorageStrategy
class RemoteStorageStrategy(BaseStorageStrategy):

	#  Here we will assume that each level of the json data passed, with be equivalent to the path of the data to be passed
	def store(self, nodes, type):
		# print '[RemoteStorageStrategy::store_node] storage_path: [%s]' % self._storage_path

		# print '[RemoteStorageStrategy::store_node] nodes: %s' % nodes
		for node in [nodes]:
			# print '[RemoteStorageStrategy::store_node] node {0}'.format(node)
			req = urllib2.Request(self._storage_path)
			req.add_header('Content-Type', 'application/json')
			# print '[RemoteStorageStrategy::store_node] node: %s' % node
			req.add_data(json.dumps(node))
			try:
				res = urllib2.urlopen(req)
			# res.read()
			# except urllib2.HTTPError as e:
			# 	if e.code != 409:
			# 		print e.code, e.reason
			# 	continue
			except urllib2.HTTPError as e:
				pass

	def retrieve(self, type):
		req = urllib2.Request(self._storage_path)
		res = urllib2.urlopen(req)
		data = res.read()
		return  json.loads(data)