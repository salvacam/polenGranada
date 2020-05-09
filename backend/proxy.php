<?php

/*
header('Content-Type: text/plain; charset=utf-8');
header("access-control-allow-origin: *");
*/

require './src/JsonDB.class.php';

date_default_timezone_set('Europe/Madrid');

$db = new JsonDB("./db/");
$img = './img/data.png';	

/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

// Comprobar si la ciudad esta cacheada en menos de 5horas
$now = new DateTime();
$fechaHoraActual = $now->getTimestamp();

$datosGuardados = $db->selectAll("data");
$fechaHoraLimite = 0;

if (count($datosGuardados) > 0) {
		
	$fechaHoraLimite = $datosGuardados[0]["DateTime"] + 18000; //Five hours, 60 seg * 10 min * 5 hour
}

if ($fechaHoraLimite > $fechaHoraActual) {
	// Devolver lo guardado
	http_response_code(200);
	echo html_entity_decode($datosGuardados[0]["SRC"]);
	die();

} else  {

	//$urlFacebook = "https://www.facebook.com/Informaci%C3%B3n-Polen-Granada-128331124035311/";
	$urMeteoblue = "https://www.meteoblue.com/es/tiempo/outdoorsports/airquality/granada_españa_2517117";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $urMeteoblue);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3");
	curl_setopt($ch, CURLOPT_REFERER, "https://www.meteoblue.com");
	$page = curl_exec($ch);
	curl_close($ch);

	$textSearch = "data-original='";
	$longTextSearch = strlen($textSearch);

	$endPost = 0;
	$starPosition = strpos($page, '<div id="blooimage"', $endPost);

	$initPosition = strpos($page, $textSearch, $starPosition);

	$endPost = strpos($page, "'", $initPosition + $longTextSearch);

	$result = substr($page, $initPosition + $longTextSearch, $endPost - ($initPosition + $longTextSearch));

	// Guardar fecha y hora cuando se realiza la llamada
	$lista = array('ID'=>0, 'SRC'=> $result, 'DateTime'=>$fechaHoraActual);

	// Guardar resultado procesado de la llamada
	$db -> deleteAll ( "data" );
	$db->insert("data", $lista, true);

	//Crear imagen
	file_put_contents($img, file_get_contents("https:" . html_entity_decode($result)));
	
	http_response_code(200);
	echo html_entity_decode($result);/

}