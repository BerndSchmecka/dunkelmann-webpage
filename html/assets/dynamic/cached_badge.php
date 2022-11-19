<?php
// Get query parameters 'uuid', 'variant' and 'rev'
$uuid = $_GET['uuid'];
$variant = $_GET['variant'];
$rev = $_GET['rev'];

// Get the badge image from https://api.dunkelmann.eu/v2/downloadCachedBadgeImage via POST a JSON object
// with the query parameters 'uuid', 'variant' and 'rev'
// Also save the response code to $httpcode
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.dunkelmann.eu/v2/downloadCachedBadgeImage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('uuid' => $uuid, 'variant' => $variant, 'revision' => $rev)));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
$badge = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// If the response code is 200, the badge image was successfully retrieved
if ($httpcode == 200) {
    // Set the content type depending on the variant
    // svg -> image/svg+xml
    // svg_detailed -> image/svg+xml
    // png_16 -> image/png
    // png_64 -> image/png
    if ($variant == "svg" || $variant == "svg_detailed") {
        header('Content-Type: image/svg+xml');
    } else if ($variant == "png_16" || $variant == "png_64") {
        header('Content-Type: image/png');
    }
    // Output the badge image
    echo $badge;
} else {
    // If the response code is not 200, the badge image could not be retrieved
    // Set the content type to application/json and the HTTP response code to $httpcode
    header('Content-Type: application/json');
    http_response_code($httpcode);
    // Output the response code
    echo $badge;
}
?>