function filtrar(){
	var filtro = document.getElementById("searchInput");
	if(filtro.value.trim() == ""){
		filtro.focus()
		//
	}
	else{
		window.location = window.location.origin + "/items?search=" + filtro.value;
	}
}

function buscarPorID(){
	var filtro = document.getElementById("idInput");
	if(filtro.value.trim() == ""){
		filtro.focus()
		//
	}
	else{
		window.location = window.location.origin + "/items/" + filtro.value;
	}
}

function httpGet(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}