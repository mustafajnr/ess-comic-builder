<?php
if(isset($_POST['imgdata']))
{
	$Data = urldecode($_POST['imgdata']);
	$Data = base64_decode(substr($Data,strpos($Data,",")+1));
	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header('Content-Disposition: attachment; filename=image_' . uniqid() . ".png");
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');
	header('Content-Description: File Transfer');
	header('Content-Length: ' . strlen($Data));
	echo $Data;
	exit;
}
?>
