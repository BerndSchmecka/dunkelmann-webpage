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
// Set the content type depending on the variant
// svg -> image/svg+xml
// svg_detailed -> image/svg+xml
// png_16 -> image/png
// png_64 -> image/png
// If the curl request did not return 200 OK, output the json object

if ($ch.http_code == 200) {
    if ($variant == "svg") {
        header("Content-Type: image/svg+xml");
    } else if ($variant == "svg_detailed") {
        header("Content-Type: image/svg+xml");
    } else if ($variant == "png_16") {
        header("Content-Type: image/png");
    } else if ($variant == "png_64") {
        header("Content-Type: image/png");
    }
    echo $server_output;
} else {
    header("Content-Type: application/json");
    echo $server_output;
}
?>