function cambiarImagen(elem){
	document.getElementById("imagen").setAttribute("src", elem.getAttribute("src"));
}

window.onload = function(){
	//Consumo la API local
	var id = window.location.href.substring(window.location.href.indexOf("items/")).split("/")[1];
	console.log('GET http://localhost:3000/api/items/' + id);
	var response = httpGet("http://localhost:3000/api/items/" + id);
	response = JSON.parse(response);

	//Seteo valores
	if(response.item){
		document.getElementById("imagen").setAttribute("src", response.item.pictures[0]);
		document.getElementById('estado').innerHTML = response.item.condition + " - " + response.item.sold_quantity + " vendidos";
		document.getElementById('titulo').innerHTML = response.item.title;
		var precio = response.item.price.currency == "ARS" ? "$" : "U$S";
		precio += " " + response.item.price.amount;
		document.getElementById('precio').innerHTML = precio;
		document.getElementById('decimal').innerHTML = pad(response.item.price.decimals,2);
		document.getElementById('descripcion').innerHTML = response.item.descripcion == "" ? "(Sin descripción)" : response.item.descripcion;
	
		//Imagenes
		var list = "";
		for(var i = 0; i < 5; i++){
			if(i < response.item.pictures.length){
				var li = "<img class='thumbnail' src='" + response.item.pictures[i] + "' onclick='cambiarImagen(this)''></img>";
				list += li;
			}
		}
		document.getElementById('imagenes').innerHTML = list;
	}
	else{
		document.getElementById("content").style.display = "none";
		document.getElementById("warning").style.visibility = "visible";
	}
	//Muestro el contenido
	document.getElementById("idBody").style.display = "block"
}