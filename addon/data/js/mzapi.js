/**
 * Application Programming Interface contenant les fonctions:
 * 1) communes à plusieurs pages MZ --> c'est censé être [remote]libs.js !
 * 2) utilisables par les scripts externes --> impossible, dépend de la page
 */


// fonction de test : modifie le cadre de connexion sur la page de login
function modifyFieldByTagName(tagName, param) {
	document.getElementsByTagName(tagName)[0].innerHTML += " " + param;
}

// fonction pour le retour au main.js
// NB: C'est le seul et unique endroit où
// elle peut être utilisée par lancerScript()
function sendBackResult(event, data){
	self.port.emit(event, data); 
	console.log("Fin du script appelé");
}

/*-[functions]-------------- Interactions distantes --------------------------*/

function MZ_XHR(obXHR) {
// Envoie une requête XHR suivant les paramètres
// fournis dans l'objet XHR "obXHR"
	var request = new XMLHttpRequest();
	request.open(
		obXHR.method ? obXHR.method : 'get',
		obXHR.url
	);
	for(var head in obXHR.headers) {
		request.setRequestHeader(head,obXHR.headers[head]);
	}
	request.onreadystatechange = function() {
		if(request.readyState!=4) { return; }
		if(request.error) {
			if(obXHR.onerror) {
				obXHR.onerror(request.responseText);
			}
		} else if(obXHR.onload) {
			/* DEBUG: Ajouter à request les pptés de obXHR? */
			obXHR.onload(request.responseText);
		}
	};
	request.send(obXHR.data);
}

function lancerScript(url) {
	MZ_XHR({
		url: url,
		onerror: function(responseText) {
			console.log('Erreur lors de la réception de: '+this.url);
			sendBackResult('externalJSLoaded','FAILED');
			// wtf? pourquoi les sendBack sont sans effet?
		},
		onload: function(responseText) {
			console.log('Lancement de: '+this.url);
			// WARNING: Trouver une autre solution
			eval(responseText);
			sendBackResult('externalJSLoaded','Done');
		}
	});
}


/*-[functions]-------------- Interface utilisateur ---------------------------*/

function avertissement(txt,duree) {
	if(!duree) { duree = 3000; }
	var div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	var num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name','avertissement');
	div.className = 'mh_textbox';
	div.style =
		'position:fixed;'+
		'top:'+(10+15*num)+'px;'+
		'left:'+(10+5*num)+'px;'+
		'border:1px solid #000000;'+
		'z-index:'+(2+num)+';'+
		'cursor:crosshair;';
	div.innerHTML = txt;
	div.onclick = function(){ tueAvertissement(this.num) };
	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après 3 sec :
	window.setTimeout(function(){ tueAvertissement(num) },duree);
}

function tueAvertissement(num) {
	var divs = document.getElementsByName('avertissement');
	if(divs.length==0) { return; }
	for(var i=0 ; i<divs.length ; i++) {
		if(divs[i].num==num) {
			divs[i].parentNode.removeChild(divs[i]);
			return;
		}
	}
}

