<?php
// Get query parameters 'uuid', 'variant' and 'rev'
$uuid = $_GET['uuid'];
$variant = $_GET['variant'];
$rev = $_GET['rev'];

// Get the badge image from https://api.dunkelmann.eu/v2/downloadCachedBadgeImage via POST a JSON object
// with the query parameters 'uuid', 'variant' and 'rev'
// Also save the Content-Type header in $contentType
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.dunkelmann.eu/v2/downloadCachedBadgeImage');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('uuid' => $uuid, 'variant' => $variant, 'revision' => $rev)));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
curl_close($ch);

// Get the Content-Type header
$contentType = '';
foreach (explode("\r

", $header) as $line) {
    if (strpos($line, 'Content-Type:') === 0) {
        $contentType = substr($line, 14);
    }
}

// Set the Content-Type header
header('Content-Type: ' . $contentType);

// Output the badge image
echo $body;

?>