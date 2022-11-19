<?php
// Get query parameters 'uuid', 'variant' and 'rev'
$uuid = $_GET['uuid'];
$variant = $_GET['variant'];
$rev = $_GET['rev'];

// Get the badge image from https://api.dunkelmann.eu/v2/downloadCachedBadgeImage via POST a JSON object
// with the query parameters 'uuid', 'variant' and 'rev'
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.dunkelmann.eu/v2/downloadCachedBadgeImage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('uuid' => $uuid, 'variant' => $variant, 'revision' => $rev)));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$server_output = curl_exec($ch);
curl_close ($ch);

// Output the badge image
header('Content-Type: image/png');
echo $server_output;

?>