//VARIABLES
var arrayRespuesta= Array();
var notas='';
var valor=null;


//detectar la pulsación del boton enviar
//activar un listener
window.onload=function(){	
	document.getElementById('enviar').addEventListener('click', enviarFormulario);
	document.getElementById('texto').value="";
	//consulta a la bbdd para mostrar en el formulario la relación de personas
	consultaPersonas();
}

function consultaPersonas() {
	fetch ('consultaPersonas.php', {
		method: 'POST'
	})
	.then(function(respuesta) {
		if (respuesta.ok) {
			//cambiar el json a text, si queremos ver el error
			return respuesta.json();
		} else {
			throw "error en la petición AJAX";
		}
	})
	.then(function(datos) {
		//datos es un array js
		//alert (datos);
		var tabla="";
		for (i in datos) {
			tabla+="<tr class='tr'>";
				tabla+=`<td class='pk'>${datos[i]['pk_personas']}</td>`;
				tabla+=`<td>${datos[i]['nif']}</td>`;
				tabla+=`<td>${datos[i]['nombre']}</td>`;
				tabla+=`<td>${datos[i]['apellidos']}</td>`;
			tabla+="</tr>";
			
		}
		document.getElementById('listapersonas').innerHTML+=tabla;
		//se activa por cada linea de registro ('tr') class='tr' un listener
		fila=document.querySelectorAll('.tr');
		for (i=0;i<fila.length-1;i++) {
			fila[i].addEventListener('click', consultaPersona);
		}

		console.log(datos);
	})
	.catch(function (error) {
		alert(error);
	})
}
function consultaPersona() {
	alert ("consultaPersona");
	var id=this.firstChild;
	alert (id.innerHTML);
	var datos = new FormData();
	datos.append('pk',id.innerHTML);
	fetch('consultaPersonaSeleccionada.php',{
		method: 'POST',
		body: datos
	})
	.then(function(respuesta) {
		//primera respuesta del servidor como que ha recibido la petición
		if (respuesta.ok) {
			return respuesta.json();
		} else {
			throw "error en la llamada AJAX";
		}
	})
	. then (function(datos) {
		//servidor a procesado los datos y nos lo devuelve
		alert (datos);
		for (i in datos) {
			document.getElementById('pk').value=datos[i]['pk_personas'];
			document.getElementById('nif').value=datos[i]['nif'];
			document.getElementById('nombre').value=datos[i]['nombre'];
			document.getElementById('apellidos').value=datos[i]['apellidos'];
			document.getElementById('direccion').value=datos[i]['direccion'];
			document.getElementById('telefono').value=datos[i]['telefono'];
			document.getElementById('email').value=datos[i]['email'];
		}
		alert ('ver retornado');
		
	})
	.catch(function(error) {
		//captura de los errores
		alert (error);
	})
}

function enviarFormulario() {
	alert ('enviarFormulario');
	document.getElementById('nif').classList.remove('error');
	document.getElementById('nombre').classList.remove('error');
	document.getElementById('apellidos').classList.remove('error');
	document.getElementById('texto').value="";
	
	var nif = document.getElementById('nif').value;
	var nombre = document.getElementById('nombre').value;
	var apellidos = document.getElementById('apellidos').value;
	var direccion = document.getElementById('direccion').value;
	var telefono = document.getElementById('telefono').value;
	var email = document.getElementById('email').value;
	//validar formulario
	if (nif.trim()=='' || nif.length<9) {
		document.getElementById('nif').classList.add('error');
	}
	if (nombre.trim()=='') {
		document.getElementById('nombre').classList.add('error');
	}
	if (apellidos.trim()=='') {
		document.getElementById('apellidos').classList.add('error');
	}
	
	if (nombre.trim()=='' || apellidos.trim()=='' || nif.trim()=='') {
		alert ('nif, nombre, y apellidos, son datos obligatorios');
		document.getElementById('texto').value="nif, nombre, y apellidos, son datos obligatorios";
		return;
	}
	if (nif.length<9) {
		alert ('formato del nif no correcto');
		document.getElementById('texto').value="formato del nif no correcto";
		return;
	}
	valor=validarNIF(nif);
	if (!valor) {
		alert ('nif no válido');
		document.getElementById('texto').value="nif no válido";
		return;
	}
	
	//formateo datos o encapsulado de datos al servidor 
	//para enviar al servidor clave:pareja:valor
	//creamos un objeto
	var datos = new FormData();
	datos.append('nif',nif);
	datos.append('nombre',nombre);
	datos.append('apellidos',apellidos);
	datos.append('direccion',direccion);
	datos.append('telefono',telefono);
	datos.append('email',email);


	//llamada AJAX al servidor
	fetch('bd_020_altaPersona.php',{
		method: 'POST',
		body: datos
	})
	.then(function(respuesta) {
		//primera respuesta del servidor como que ha recibido la petición
		if (respuesta.ok) {
			return respuesta.text();
		} else {
			throw "error en la llamada AJAX";
		}
	})
	. then (function(datos) {
		//servidor a procesado los datos y nos lo devuelve
		alert (datos);
		consultaPersonas();
	})
	.catch(function(error) {
		//captura de los errores
		alert (error);
	})
}
/*
	/// AJAX //////////////////////////////////////////////

	//envio al servidor 
	$.ajax({
			url:'bd_020_altaPersona.php', 
			type: 'post',
			data: {'nif':nif,'nombre':nombre,'apellidos':apellidos,'direccion':direccion,'telefono':telefono,'email':email},
			//beforeSend() function opcional 
			beforeSend: function() {
				//acciones a realizar mientras no se recibe la respuesta
				//var reloj = "<img src='reloj_arena.gif'>";
				//document.getElementById('texto').innerHTML=reloj;
			},
			success: function(respuesta) {
				//respuesta del servidor
				//document.getElementById('mensaje').innerText=respuesta;
				alert ('success');
				alert (respuesta);
				var arrayRespuesta=JSON.parse(respuesta);
				if (arrayRespuesta.codigo=='00') {
					alert ('codigo respuesta ok, se ha dado de alta la persona');
					notas ='codigo respuesta ok, se ha dado de alta la persona';
				} else {
					alert ('error en el alta de la persona al volver de php');
					notas ='error en el alta de la persona al volver de php';
				}
			},
			error: function(respuesta) {
				//respuesta del servidor en caso de error
				alert ('error');
				var arrayRespuesta=JSON.parse(respuesta);
				if (arrayRespuesta!='00') {
					alert ('codigo respuesta KO, se han producido errores en el programa de php');
					notas ='codigo respuesta KO, se han producido errores en el programa de php';

				} else {
					alert ('????????????????????????????????????');
				}
			},
			complete: function() {
				//acciones a realizar cuando finaliza la petición
				notas +='fin proceso - complete function'
				document.getElementById('texto').value=notas;
				document.getElementById('nif').value="";
				document.getElementById('nombre').value="";
				document.getElementById('apellidos').value="";
				document.getElementById('direccion').value="";
				document.getElementById('telefono').value="";
				document.getElementById('email').value="";
				alert ('complete');
			}
		})
*/
	


function validarNIF(nif) {
var lockup = 'TRWAGMYFPDXBNJZSQVHLCKE';
	var valueNif=nif.substr(0,nif.length-1);
	var letra=nif.substr(nif.length-1,1).toUpperCase();
 
	if(lockup.charAt(valueNif % 23)==letra)
		return true;
	return false;
}
		