import ConfigParser
from src.crawler.lib.yummly_crawler import YummlyCrawler

StaticConfig = ConfigParser.ConfigParser()
StaticConfig.read('config.cfg')

APP_ID =  StaticConfig.get('YUMMLY', 'APP_ID')
APP_KEY =  StaticConfig.get('YUMMLY', 'APP_KEY')
METADATA_URL = StaticConfig.get('YUMMLY', 'METADATA_URL')
METADATA_REMOTE_STORAGE_URL = StaticConfig.get('YUMMLY', 'METADATA_REMOTE_STORAGE_URL')
RECIPE_REMOTE_STORAGE_URL = StaticConfig.get('YUMMLY', 'RECIPE_REMOTE_STORAGE_URL')
RECIPE_SEARCH_URL = StaticConfig.get('YUMMLY', 'RECIPE_SEARCH_URL')
RECIPE_GET_URL = StaticConfig.get('YUMMLY', 'RECIPE_GET_URL')
CONFIG_LOCAL_STORAGE_PATH = 'local_store/config'
METADATA_LOCAL_STORAGE_PATH = 'local_store/metadata'


API_LIMIT = 500

# ======================================================================================================================

API_CREDENTIALS = {'_app_id': APP_ID, '_app_key': APP_KEY}
URLS = {
	'metadata': {
		'get': METADATA_URL,
		'store':  METADATA_REMOTE_STORAGE_URL,
	    'store_type': 'remote'
	},
	'data': {
		'get': RECIPE_GET_URL,
		'search': RECIPE_SEARCH_URL,
		'store': RECIPE_REMOTE_STORAGE_URL,
	    'store_type': 'remote'
	},
    'config': {
        'store': CONFIG_LOCAL_STORAGE_PATH,
        'store_type': 'local'
    }
}

CONFIG = {
	'filter_key': 'allowedcourse[]',
    'fetch_by_type': 'course'
}

yummly_crawler = YummlyCrawler(auth=API_CREDENTIALS, urls=URLS, force_sync=True, config=CONFIG, api_limit=API_LIMIT)
yummly_crawler.crawl()

