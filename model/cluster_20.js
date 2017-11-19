const fs = require("fs");

let labels, locations, predictions, clusters=[];

let labelsFile = "labels.json",
	locationsFile = "locations.json",
	predictionFile = "prediction.json";

function readJsonFile(filename){
	return new Promise((resolve, reject)=>{
		fs.readFile(filename, 'utf8', (e, data)=>{
			if(e){
				console.log("Error: reading file failed");
				reject();
			}else{
				let buf = JSON.parse(data);
				resolve(buf);
			}
		});
	});
}

readJsonFile(labelsFile)
.then((buf)=>{
	labels = buf;
	return readJsonFile(locationsFile);
})
.then((buf)=>{
	locations = buf;
	// cell i stores the locations of vehicles in the i-th cluster
	for(let i=0;i<locations.length;i++){
		let index = labels[i],
			value = locations[i];
		clusters[index] = clusters[index]==undefined? []:clusters[index];
		clusters[index].push(value);
	}
	for(let i=0;i<clusters.length;i++){
		let dots = clusters[i],
			centerLat = 0,
			centerLng = 0,
			numDots = dots.length;
		for(let i=0;i<numDots;i++){
			centerLng += dots[i][0];
			centerLat += dots[i][1];
		}
		centerLng = centerLng/numDots;
		centerLat = centerLat/numDots;
		clusters[i] = {
			numVehicles: numDots,
			location: {
				lat: centerLat,
				lng: centerLng
			}
		};
	}
	console.log(clusters.length);
	return readJsonFile(predictionFile);
}).
then((buf)=>{
	predictions = buf;
	predictions.map(elem=>{
		let index = elem[0],
			value = elem[1];
		clusters[index].prediction = value;
	});
	
	fs.writeFile('clusters.json', JSON.stringify(clusters), (e, res)=>{
		if(e) console.log('Error: writing clusters.json file');
		else console.log("Done writing clusters.json file");
	});
})
.catch(()=>{
	console.log("Error: Promise failed");
});
