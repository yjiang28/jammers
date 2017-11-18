import pandas
import numpy as np
from os import listdir
import sklearn
import matplotlib.pyplot as plt
import scipy.ndimage as sp
from progress.bar import Bar

DATA_LOCATION_DIR = "../data/"
UBER_DATA_DIR = DATA_LOCATION_DIR + "NYC Uber-Taxi Data/"

class data_loader:
    def conversion_algorithm(self, long, lat):
        long = round(((long - self.long_range[0])/self.conversion[0]) * self.size[0]);
        lat = round(((lat - self.lat_range[0])/self.conversion[1]) * self.size[1]);
        return int(long), int(lat);

    def create_map(self, size=(1000, 1000)):
        self.size = size;
        self.conversion = [0, 0];
        self.conversion[0] = (self.long_range[0] - self.long_range[1])
        self.conversion[1] = (self.lat_range[0] - self.lat_range[1])
        self.underlying_data = np.zeros((size));

        bar = Bar('Completion', max=self.train_size)
        for i in range(self.train_size):
            res_long, res_lat = self.conversion_algorithm(self.train_long_data[i], self.train_lat_data[i])
            self.underlying_data[res_long, res_lat] += 1;
            bar.next()
        bar.finish()

    def __init__(self, data_dir=UBER_DATA_DIR, validation_split=0.2, max_range=(-0.1, 0.1)):
        files = listdir(data_dir);
        data_list = [];
        for file in files:
            data_list.append(pandas.read_csv(data_dir + file));
        self.raw_data = pandas.concat(data_list);
        self.shape = self.raw_data.shape;
        self.size = self.shape[0];

        self.long_data = self.raw_data["Lon"].as_matrix();
        self.lat_data = self.raw_data["Lat"].as_matrix();
        self.date = self.raw_data["Date/Time"].as_matrix();
        
        mean_long = np.mean(self.long_data);
        self.long_range = [mean_long + max_range[0], mean_long + max_range[1]]
        mean_lat = np.mean(self.lat_data);
        self.lat_range = [mean_lat + max_range[0], mean_lat + max_range[1]]

        print(self.long_range, self.lat_range)
        allowed_indices = [];
        bar = Bar('Completion', max=self.size)
        for i in range(self.size):
            long_val = self.long_data[i]
            lat_val = self.lat_data[i]
            if long_val >= self.long_range[0] and long_val <= self.long_range[1] and lat_val >= self.lat_range[0] and lat_val <= self.lat_range[1]:
                allowed_indices.append(i);
            bar.next()
        bar.finish()

        self.size = len(allowed_indices);
        temp = self.long_data[allowed_indices]
        self.long_data = temp
        temp = self.lat_data[allowed_indices]
        self.lat_data = temp
        temp = self.date[allowed_indices]
        self.date = temp

        split = int((1 - validation_split) * self.size);
        self.train_long_data = self.long_data[:split];
        self.train_lat_data = self.lat_data[:split];
        self.train_date_data = self.date[:split];
        self.train_size = split; 
        self.valid_long_data = self.long_data[split:];
        self.valid_lat_data = self.lat_data[split:];
        self.valid_date_data = self.date[split:];
        self.valid_size = self.size -split;

    def generate_heatmap(self, figure_size, i, prefix="", sigma=5, show=False, save=True): 
        self.create_map();
        fig = plt.imshow(sp.gaussian_filter(self.underlying_data, sigma=sigma), cmap='jet', interpolation='sinc')
        if save:
            plt.savefig('../figures/'+ prefix + 'image_' + str(i) + '.png')
        if show:
            plt.show()
        plt.close();
        del fig;


if __name__ == "__main__":
    loader = data_loader();
    loader.generate_heatmap((800, 800), 0)