function test(valeur) {
	console.log("testjp2 : "+valeur);
}

function modifyFieldByTagNameFromRemote(tagName,param) {
	document.getElementsByTagName(tagName)[0].innerHTML += " "+ param;
}

modifyFieldByTagNameFromRemote("legend","remote_remote");
modifyFieldByTagName("legend","remote_addon");
