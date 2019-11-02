<?php 
	//conexion bbdd Personas
	require 'conexionPersonas.php';

	//montar sentencia sql
	//SELECT 
	//WHERE    
	// ORDER BY
	$sql="SELECT * FROM personas ORDER by nombre, apellidos";
	$resultado=mysqli_query ($bd, $sql) or die(mysqli_error($bd));
	//print_r($resultado);
	
	//mientras haya filas se extrae y construye el array asociativo $datosPersonas
	//obtenemos un array asociativo
	$personas = array();
	while ($datosPersona = mysqli_fetch_assoc($resultado)) {
		//añadimos cada fila de la tabla al array
		array_push($personas, $datosPersona);

		//print_r($datosPersona);
		//echo "<br>";
	}
	echo json_encode($personas);
	
	//echo "<br>";
	//echo $datosPersona['nombre'];

?>