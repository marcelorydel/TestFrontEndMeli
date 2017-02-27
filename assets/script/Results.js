window.onload = function(){
	//Consumo la API local
	var search = getParameterByName("search");
	console.log('GET http://localhost:3000/api/items?q=' + search);
	var response = httpGet("http://localhost:3000/api/items?q=" + search);
	response = JSON.parse(response);

	//Seteo valores
	var list = "";
	if(response.items.length == 0){
		document.getElementById("warning").style.visibility = "visible";
	}
	else{
		for(var i = 0; i < 4; i++){
			if(i < response.items.length){
				var item = response.items[i];
				var imgShipping = item.free_shipping ? '<img class="freeShipping" src="/img/ic_shipping.png" />' : '';
				var li = '<li>' + 
							'<a href="items/' + item.id + '"> <img src="'+ item.picture +'" class="liImg"></a>'+
							'<span>'+ 
								'<h2>$ '+ item.price.amount +'</h2>'+ imgShipping +
								'<p class="estado">'+ item.condition +'</p>'+
								'<p>'+ item.title +'</p>'+
							'</span>'+
						'</li>';
				list += li;
			}
		}
		document.getElementById("results").innerHTML = list;
	}
	
}