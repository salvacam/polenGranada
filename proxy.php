<?php

header('Content-Type: text/html; charset=utf-8');
header("access-control-allow-origin: *");

/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

$urlFacebook = "https://www.facebook.com/Informaci%C3%B3n-Polen-Granada-128331124035311/";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $urlFacebook);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3");
curl_setopt($ch, CURLOPT_REFERER, "http://www.facebook.com");
$page = curl_exec($ch);
curl_close($ch);

$endPost = 0;
//$result = "";
$result = "<section id='accordion' class='accordion'>";
$initPost = strpos($page, ' userContent ', $endPost);
$maxPost = 3;

while ($initPost && $maxPost > 0) {
	$initPosition = strpos($page, '<p', $initPost);
	$endPost = strpos($page, '</div>', $initPosition);

	$result .= "<section>";
	$result .= substr($page, $initPosition, $endPost - $initPosition);
	$result .= "</section>";

	$initPost = strpos($page, ' userContent ', $endPost);
	$maxPost--;
}

$result .= "</section>";

http_response_code(200);
echo $result;