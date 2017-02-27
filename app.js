var express = require('express');
var app = express();
var path = require("path");
const https = require('https');

/* Paginas */
app.get('/',function(req,res){
	console.log("GET /\n");
	res.sendFile(path.join(__dirname+'/pages/Box.html'));
});

app.get('/items',function(req,res){
	console.log("GET /items\n");
	res.sendFile(path.join(__dirname+'/pages/Results.html'));
});

app.get('/items/:id',function(req,res){
	console.log("GET /items/"+ req.params.id + "\n");
	test = req.params.id;
	res.sendFile(path.join(__dirname+'/pages/Detail.html'));
});

app.get('/ej',function(req,res){
	res.sendFile(path.join(__dirname+'/pages/ej.html'));
});

/* Endpoints */
app.get('/api/items', function(req, resp) {
	var filter = JSON.stringify(req.query.q);
    var response = "";
    
    console.log('GET https://api.mercadolibre.com/sites/MLA/search?q=' + filter)
	https.get('https://api.mercadolibre.com/sites/MLA/search?q=' + filter, (res) => {
		console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);

		res.on('data', (chunk) => {
	 	 	response += chunk;
   		 });

		res.on('end', function () {
			response = JSON.parse(response);
			respuesta = {}

			/* Author */
			respuesta.author = {
				name: "John",
				lastName: "Smith"
			}

			/* Categories */
			categorias = [];
			if(response.available_filters.length > 0){	
				for(var cat in response.available_filters[0].values){
					categorias.push(response.available_filters[0].values[cat].name);
				}
			}
			respuesta.categories = categorias;

			/* Items */
			array = [];
			for(var item in response.results){
				var i = {}
				i.id = response.results[item].id;
				i.title = response.results[item].title;
				decimal = parseFloat((response.results[item].price+"").split(".")[1]);
				decimal = isNaN(decimal) ? 0 : decimal;
				i.price = {
					currency: response.results[item].currency_id,
					amount: Math.floor(response.results[item].price),
					decimals: decimal
				}
				i.picture = response.results[item].thumbnail;
				i.condition = response.results[item].condition;
				i.free_shipping = response.results[item].shipping.free_shipping;
				response.results[item].price;
				array.push(i);
			}
			respuesta.items = array;

		    resp.send(respuesta);
		});

		}).on('error', (e) => {
			console.log('ERROR');
	  		console.error(e);
	});

});

app.get('/api/items/:id', function(req, resp) {
    var filter = req.params.id;
    var response = "";
    var responseDesc = "";
    
    console.log('GET https://api.mercadolibre.com/items/' + filter)
	https.get('https://api.mercadolibre.com/items/' + filter, (res) => {
		console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);

		res.on('data', (chunk) => {
	 	 	response += chunk;
   		 });

		res.on('end', function () {
			response = JSON.parse(response);
			respuesta = {}
			/* Author */
			respuesta.author = {
				name: "John",
				lastName: "Smith"
			}
			/* Item  */
			var item = {};
			if(response.id){
				item.id = response.id;
				item.title = response.title;
				respuesta.item = item;
				decimal = parseFloat((response.price+"").split(".")[1]);
				decimal = isNaN(decimal) ? 0 : decimal;
				item.price = {
					currency: response.currency_id,
					amount: Math.floor(response.price),
					decimals: decimal
				}
				var imagenes = [];
				for(var j = 0; j < 5; j++){
					if(j < response.pictures.length){
						imagenes.push(response.pictures[j].url)
					}
				}
				item.pictures = imagenes;
				item.condition = response.condition;
				item.free_shipping = response.shipping.free_shipping;
				response.price;
				item.sold_quantity = response.sold_quantity;

				//Obtengo la descripcion en otro endpoint
				console.log('GET https://api.mercadolibre.com/items/' + filter + "/description")
				https.get('https://api.mercadolibre.com/items/' + filter + "/description", (res) => {
					console.log('statusCode:', res.statusCode);
					//console.log('headers:', res.headers);

					res.on('data', (chunk) => {
				 	 	responseDesc += chunk;
			   		 });

					res.on('end', function () {
						responseDesc = JSON.parse(responseDesc);
						item.descripcion = responseDesc.plain_text;
						respuesta.item = item;
					    resp.send(respuesta);
					});

					}).on('error', (e) => {
						console.log('ERROR');
				  		console.error(e);
					});
				}
				else{
					resp.send(respuesta);
				}
		});

		}).on('error', (e) => {
			console.log('ERROR');
	  		console.error(e);
		});
});

app.use(express.static('assets'));
app.use(express.static('pages'));

port = 3000;
app.listen(port, function () {
	console.log('App corriendo en puerto ' + port)
})



