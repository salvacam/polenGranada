<?php

header('Content-Type: text/plain; charset=utf-8');
header("access-control-allow-origin: *");

/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

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

http_response_code(200);
echo html_entity_decode($result);