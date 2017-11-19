const http = require("http"),
	  fs   = require("fs"),
	  qs   = require("querystring"),
	  path = require("path");

const settings = require("../settings"),
	  root     = settings.root,
	  host     = settings.host,
	  port     = settings.port,
	  db	   = require(settings.db);

const server = http.createServer(handleRequest);
server.listen(port, host, ()=>{
	console.log("Server is up at", host, ":", port);
});

function handleRequest(req, res){
	let method = req.method.toUpperCase(),
		url    = req.url;
	console.log(method, url);
	let replyPage = function(route, dataType){
		fs.readFile(route, (err, data)=>{
			if(err){
				console.log("Error: fail to read file from", route);
				res.statusCode = 404;
				res.end();
			}
			else{
				console.log(dataType);
				res.setHeader('content-type', dataType);
		        res.write(data);
		        res.end();
		    }
		});
	};

	switch(method){
		case "GET":			
			if(url == '/'){
				replyPage(path.join(root, "view/index.html"), "text/html");
			}
			else{
				let route = "",
					dataType = "";
				if(url.indexOf(".css")!=-1){
					route = path.join(root, '/view/css/', url);
					dataType = "text/css";
				}
				else if(url.indexOf(".js")!=-1){
					route = path.join(root, '/view/js/', url);
					dataType = "application/javascript";
				}
				else if(url.indexOf(".html")!=-1){
					route = path.join(root, '/view/', url);
					dataType = "text/html";
				}
				else{
					console.log("Error: unsupported file type requested");
					res.statusCode = 404;
					res.end();
					return;
				}
				replyPage(route, dataType);
			}
			break;
		case "POST":
			if(url.indexOf(".csv")!=-1){
				let route = path.join(root, url);
				db.csvToObjs(route,res);
			}
			else if(url.indexOf(".json")!=-1){
				let route = path.join(root, url);
				db.readJsonFile(route,res);
			}
			break;
		default:
			console.log("REST method not supported");
	}
}
