
import pandas
import numpy
from os import listdir

DATA_LOCATION_DIR = "../data/"
UBER_DATA_DIR = DATA_LOCATION_DIR + "NYC Uber-Taxi Data/"

class data_loader:
    def __init__(self, data_dir=UBER_DATA_DIR):
        print(data_dir)
        files = listdir(data_dir);
        print(files);
        data_list = [];
        for file in files:
            data_list.append(pandas.read_csv(data_dir + file));
        print(len(data_list))
        print(data_list[0])


if __name__ == "__main__":
    loader = data_loader();