<?php 
	//conexion bbdd Personas
	require 'conexionPersonas.php';

	//montar sentencia sql
	//SELECT 
	//WHERE    
	// ORDER BY
	$sql="SELECT * FROM personas";
	$resultado=mysqli_query ($bd, $sql) or die(mysqli_error($bd));
	//print_r($resultado);
	
	//mientras haya filas se extrae y construye el array asociativo $datosPersonas
	//obtenemos un array asociativo
	while ($datosPersona = mysqli_fetch_assoc($resultado)) {
		print_r($datosPersona);
		echo "<br>";

	}
	
	
	//echo "<br>";
	//echo $datosPersona['nombre'];

?>