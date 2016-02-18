function submit_inscription_tournoi(tournoi_id){
	document.getElementById("tournoi_id").value = tournoi_id;
	document.forms["all_tournois_form"].submit();
}

function go_to_tournoi(tournoi_id, tournoi_nom){
	document.getElementById("tournoi_id").value = tournoi_id;
	document.getElementById("tournoi_nom").value = tournoi_nom;
	document.forms["form_tournoi"].submit();
}



/*
=============================
	PAGE DES PRONOSTICS D'UN TOURNOI
=============================
*/

//Tableau des valeurs modifi�es
var input_modified = [];

//Ajout de l'index de l'input au tableau
function add_to_tab(value){
	if(input_modified.indexOf(value) == -1) input_modified.push(value);
}	

//On clique sur "Modifier" --> On transforme les cases en input
function mod_score(className){
	var tds=document.getElementsByClassName(className);
	for(var i = 0; i<tds.length; i++){
		tds[i].innerHTML = "<input type='int' value='"+tds[i].innerHTML+"' onkeypress='add_to_tab("+i+")' maxlength=3/>";
	}
	document.getElementById(className).onclick=function(){valid_score(className)};
}

//On clique sur "Valider" --> On transforme les inputs en case
function valid_score(className){
	var tds=$("."+className);
	for(var i = 0; i<tds.length; i++){
		if(input_modified.indexOf(i) != -1){
			var valeur = toInt($(tds[i]).find("input")[0].value);
			var msg_match;
			if(i%2 != 0) msg_match = "Equipe 2";
			else msg_match = "Equipe 1";
			if(valeur == ""){
				document.getElementById("bugs").innerHTML += "<span style='color:red; font-weight:bold;'>Valeur incorrecte pour le match n�"+(Math.ceil((i+1)/2))+" - "+msg_match+" de l'utilisateur "+className+", 0 par d�faut. <br /></span>";
				tds[i].innerHTML = 0;
			}
			else{
				document.getElementById("bugs").innerHTML += "<span style='color:green; font-weight:bold;'>Valeur '"+valeur+"' enregistr�e pour le match n�"+(Math.ceil((i+1)/2))+" - "+msg_match+" de l'utilisateur "+className+".<br /></span>";
				tds[i].innerHTML = valeur;
			}
		}
		else{
			var valeur = toInt($(tds[i]).find("input")[0].value);
			tds[i].innerHTML = valeur;
		}
	}
	send_to_sql();
	document.getElementById(className).onclick=function(){mod_score(className)};
	input_modified = [];
}

//Test pour transformer n'importe quel string en int
function toInt(chaine){
	var new_chaine = "";
	for(i=0; i<chaine.length; i++){
		if(chaine[i] >= 0 && chaine[i] <= 9) new_chaine += chaine[i];
	}
	return new_chaine;
}

//Ecriture dans un fichier log PHP
function writeInText(chaine){

}

//Envoie des donn�es sur une page PHP
function send_to_sql(){
	var tournoi_id = document.getElementById("TOURNOI_ID").value;
	var user_id = document.getElementById("USER_ID").value;
	
	var username = document.getElementById("username").innerHTML;
	
	var all_lines = document.getElementsByClassName("en_cours");

	var all_scores = [];
	
	for(var i = 0; i<all_lines.length; i++)
	{
		var test = all_lines[i];
		test = $(all_lines[i]);
		test = $(all_lines[i]).find("."+username);
		test = $(all_lines[i]).find("."+username)[0];
		
		if($(all_lines[i]).find("."+username.toUpperCase())[0] != undefined){
			all_scores[i] = all_lines[i].id + "_" + $(all_lines[i]).find("."+username.toUpperCase())[0].innerHTML + "_" + $(all_lines[i]).find("."+username.toUpperCase())[1].innerHTML;
		}
	}

	$.ajax({
		type: "POST",
		url: "../Scripts/modify_scores.php",
		context: document.body,
		data:{
			user_id:user_id,
			tournoi_id:tournoi_id,
			scores:all_scores
		},
		success: function(){
			document.getElementById("bugs").innerHTML += "<span style='color:green; font-weight:bold;'>Vos r�sultats ont correctement �t� enregistr�s !</span> <br />";
			alert("R�sultats correctement enregistr�s !");
		},
		fail: function(){
			document.getElementById("bugs").innerHTML += "<span style='color:red; font-weight:bold;'>Vos r�sultats n'ont pas �t� correctement enregistr�s, r�essayez ou contactez l'administrateur. </span>  <br />";
			alert("Erreur dans l'enregistrement des r�sultats des pronostics. Merci de r�essayer ou de contacter l'administrateur.");
		}
	});
}

function modifyResult(){
	var match_id = document.getElementById("mod_id").value;
	var score1 = document.getElementById("mod_score1").value;
	var score2 = document.getElementById("mod_score2").value;
	$.ajax({
		type: "POST",
		url: "../Scripts/modify_result.php",
		context: document.body,
		data:{
			match_id:match_id,
			score1:score1,
			score2:score2
		},
		success: function(){
			document.getElementById("bugs").innerHTML += "<span style='color:green; font-weight:bold;'>Le r�sultat du match a correctement �t� enregistr� !</span> <br />";
			alert("R�sultats correctement enregistr�s !");
			$("#form_mod_result").submit();
		},
		fail: function(){
			document.getElementById("bugs").innerHTML += "<span style='color:red; font-weight:bold;'>Le r�sultat du match n'a pas �t� correctement enregistr�, r�essayez ou contactez l'administrateur. </span>  <br />";
			alert("Erreur dans l'enregistrement du r�sultat du match. Merci de r�essayer ou de contacter l'administrateur.");
		}
	});
}



function addMatch(){
	var tournoi_id = document.getElementById("TOURNOI_ID").value;
	var equipe1 = document.getElementById("Equipe1").value;
	var equipe2 = document.getElementById("Equipe2").value;
	var dateMatch = document.getElementById("DateMatch").value;
	$.ajax({
		type: "POST",
		url: "../Scripts/addMatch.php",
		context: document.body,
		data:{
			tournoi_id:tournoi_id,
			equipe1:equipe1,
			equipe2:equipe2,
			dateMatch:dateMatch
		},
		success: function(data){
			if(confirm("Le match a correctement �t� ajout�. Rechargez la page ?")){
				location.reload();
			}
		},
		fail: function(){
			document.getElementById("bugs").innerHTML += "<span style='color:red; font-weight:bold;'>Le match n'a pas pu �tre cr��, r�essayez ou contactez l'administrateur. </span>  <br />";
			alert("Erreur dans la cr�ation du match. Merci de r�essayer ou de contacter l'administrateur.");
		}
	});
}

function addMessage(){
	var tournoi_id = document.getElementById("TOURNOI_ID").value;
	var user_id = document.getElementById("USER_ID").value;
	var message = document.getElementById("message").value;
	
	$.ajax({
		type: "POST",
		url: "../Scripts/addMessage.php",
		context: document.body,
		data:{
			tournoi_id:tournoi_id,
			user_id:user_id,
			message:message
		},
		success: function(data){
			data = JSON.parse(data);
			$("<tr class='tr_input_message'><td class='nom_message'>" + data["date"] + "</td><td class='nom_message'>" + data["Username"] + "</td><td>" + message + "</td></tr>").insertBefore($(".tr_input_message").first());
			$($(".tr_input_message")[1]).attr("class", "");
			$("#message").val("");
		}
	});
}

/*CSS POUR LA MESSAGERIE*/
//$(".messagerie")/.css("height", $("#div_final_results")[0].offsetHeight);