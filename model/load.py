import numpy as np
import json as json

labels = np.load("./results.npy").tolist()
locations = np.load("./train.npy").tolist()

file = open("labels.json", 'w')
file.write(json.dumps(labels))
file.close()

file = open("locations.json", 'w')
file.write(json.dumps(locations))
file.close()
