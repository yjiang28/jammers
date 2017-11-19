const settings = require("../settings.js"),
	  parse = require("csv-parse"),
	  fs = require("fs");

module.exports = {
	csvToObjs: function(route, res){
		res.setHeader("content-type", "application/json");
		// fields is an array that stores the first row
		// rows stores every row except for the first row
		let fields = [], rows = [], objs=[], fieldNum;
		new Promise((resolve, reject)=>{
			fs.createReadStream(route).pipe(parse({delimiter:','})).on("data", row=>{
				if(fields.length==0){ 
					fields = row;
					fieldNum = fields.length;
				}else{
					let obj = {};
					for(let i=0;i<fieldNum;i++){
						if(fields[i].length>0)
							obj[fields[i]] = row[i];
					}
					objs.push(obj);
				}
			}).on("end", ()=>{
				console.log("done!");
				resolve(objs);
			}).on("error", ()=>{
				reject();
			});
		})
		.then(data=>{
			res.write(JSON.stringify(data));
			res.end();
		}).catch(data=>{
			res.statusCode = 404;
			res.end();
		});
	},

	readJsonFile: function(route, res){
		fs.readFile(route, 'utf8', (err, data)=>{
			if(err){
				res.statusCode = 404;
				res.end();
			}else{
				// console.log(data);
				res.setHeader("content-type", "application/json");
				res.write(data);
				res.end();
			}

		});
	}


}




