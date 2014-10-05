__author__ = 'Quantik'

from sklearn import decomposition, cluster
import matplotlib.pyplot as plt
import numpy as np

from src.recipe.lib.yummly_recipe import YummlyRecipe
from src.connector.lib.connector import Connector

DATA_URL = 'http://localhost:2000/recipe?page=%s&max_result=%s'
RES_PER_PAGE = 250
print "FETCHING RECIPES..."
recipes_data  = []
lastPage = False
page = 0
while not lastPage:
	resp = Connector(endpoint=DATA_URL).get_data((page, RES_PER_PAGE))
	recipes_data += resp.get('recipes')
	lastPage = resp.get('lastPage')
	page += 1

print "Retrieved {0} recipes for analysis".format(len(recipes_data))

recipes = []
for recipe_data in recipes_data:
	recipe = YummlyRecipe(data=recipe_data)
	(keys, values) = recipe.flatten()
	if values is not None:
		recipes.append(values)

print '{0} / {1} recipes ready for PCA'.format(len(recipes), len(recipes_data))
X = np.array(recipes)
pca = decomposition.RandomizedPCA()
# pca.fit(X)
results = pca.fit_transform(X)
key_sub = list()
val_sub = list()
EPSILON = 1*10**(-6)
# for ix, var in enumerate(pca.explained_variance_ratio_):
# 	if var > EPSILON:
# 		key_sub.append(keys[ix])
# 		val_sub.append(values[ix])


# print key_sub, val_sub


k_means = cluster.KMeans()

k_means.fit(results)
k_means_labels = k_means.labels_
k_means_cluster_centers = k_means.cluster_centers_
k_means_labels_unique = np.unique(k_means_labels)



fig = plt.figure(figsize=(8, 3))
fig.subplots_adjust(left=0.02, right=0.98, bottom=0.05, top=0.9)
colors = ['#4EACC5', '#FF9C34', '#4E9A06', '#4EAC92', 'red', 'blue', 'black', 'green']
n_clusters = 8
ax = fig.add_subplot(1, 3, 1)
for k, col in zip(range(n_clusters), colors):
    my_members = k_means_labels == k
    cluster_center = k_means_cluster_centers[k]
    ax.plot(results[my_members, 0], results[my_members, 1], 'w',
            markerfacecolor=col, marker='.')
    ax.plot(cluster_center[0], cluster_center[1], 'o', markerfacecolor=col,
            markeredgecolor='k', markersize=6)
ax.set_title('KMeans')
ax.set_xticks(())
ax.set_yticks(())

plt.show()
#Apply Clustering with KMeans