<?php
/**
 * @todo read from database or something 
 */
$memes=array(
	array(
		"category"=>"laughing",
		"title"=>"LOL",
		"path"=>"images/lol1.png",
	),
	array(
		"category"=>"others",
		"title"=>"Asa7bi :S",
		"path"=>"images/asa7be.png",
	),
	array(
		"category"=>"others",
		"title"=>"Cereal",
		"path"=>"images/cereal1.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 1",
		"path"=>"images/rage1.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 2",
		"path"=>"images/rage2.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 3",
		"path"=>"images/rage3.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 4",
		"path"=>"images/rage4.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 5",
		"path"=>"images/rage5.png",
	),
	array(
		"category"=>"anger",
		"title"=>"Rage 6",
		"path"=>"images/rage6.png",
	)
);

header("content-type:application/json");
echo json_encode($memes);
