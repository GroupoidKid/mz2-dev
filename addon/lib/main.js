// Import the page-mod API
var mz_pageMod = require("sdk/page-mod");
var mz_self = require("sdk/self"); 
var mz_data = require("sdk/self").data;
var mz_prefs = require('sdk/simple-prefs');
var mz_storage = require("sdk/simple-storage").storage;
var mz_tabs = require("sdk/tabs");


/**
 * Récupération de liste depuis les options de l'addon Manager
 */
var mz_serverListeBrute = mz_prefs.prefs['serveursMH'].split(',');

// Construction de la liste des serveurs gérés par MZ
// Ajout du http:// et https:// au début, et du /* à la fin
function buildHttpUrl(url) {
	return 'http://'+url+'/*';
}
function buildHttpsUrl(url) {
	return 'https://'+url+'/*';
}
var mz_serverListe = mz_serverListeBrute.map(buildHttpUrl).
	concat(mz_serverListeBrute.map(buildHttpsUrl));


/* DEBUG */
console.log("Liste des serveurs gérés :\n"+mz_serverListe.join('\n'));

/**
 * Début des modifications
 */

// ajout de l'appel aux scripts sur les pages concernées
mz_pageMod.PageMod({
	include: mz_serverListe,
	contentScriptFile: [
		mz_data.url("js/mzapi.js"),
		mz_data.url("js/branching.js")
	],
	onAttach: function(worker) {
	// Test du sdk/simple-storage
		if(!mz_storage.compteur || mz_storage.compteur.nom!='Compte-pages') {
			// si l'objet n'existe pas, on le crée
			mz_storage.compteur = {
				nom:'Compte-pages'
			};
			console.log("compte-pages initialisé");
		}
		// Chaque page génère un compteur différent
		var pageEnCours = mz_tabs.activeTab.url;
		if(!mz_storage.compteur[pageEnCours]) {
			mz_storage.compteur[pageEnCours] = 0;
		}
		mz_storage.compteur[pageEnCours]+=1;
		console.log(JSON.stringify(mz_storage.compteur,null,'\n'));
		
		// On appelle MZ en http si la page courante est en http,
		// et en https si la page courante est en https
		var currentProtocol = mz_tabs.activeTab.url.split(':')[0];
		console.log("Protocole de la page en cours : "+currentProtocol);
		worker.port.emit("loadExternalJS",
			currentProtocol+"://"+mz_prefs.prefs['serveurMZ']
		);
		worker.port.on("externalJSLoaded",
			function(data) {
				console.log(data);
				console.log("Fin de traitement");
			}
		);
	}
});

