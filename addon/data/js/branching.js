self.port.on("loadExternalJS",
	function(url) {
	// récupération de l'url complete du script chargé
	// cette url dépendra bien évidemment de l'url de la page en cours
	// pour l'instant, c'est en dur
		
		//var mz_scriptURL=url+"/mz/tmp/externalScript.js";
		var mz_scriptURL='http://weblocal/mz2-dev/remotes/externalScript.js';
		
		// chargement du script externe
		lancerScript(mz_scriptURL);
	}
);

