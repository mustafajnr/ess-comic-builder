<?php
if(isset($_POST['json']))
{
	$Data = urldecode($_POST['json']);
	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
	header("Content-Disposition: attachment;filename=image.json ");
	header("Content-Type: application/force-download");
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header('Content-Length: ' . strlen($Data));
	echo $Data;
	exit;
}
else if(isset($_POST['imgdata']) && isset($_POST['imgname']))
{
	$Data = urldecode($_POST['imgdata']);
	$Data = base64_decode(substr($Data,strpos($Data,",")+1));
	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header('Content-Disposition: attachment; filename=' . urlencode($_POST['imgname']));
	header('Content-Type: application/force-download');
	header('Content-Type: application/octet-stream');
	header('Content-Type: application/download');
	header('Content-Description: File Transfer');
	header('Content-Length: ' . strlen($Data));
	echo $Data;
	exit;
}
?>