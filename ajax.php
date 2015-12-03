<?php

try{

	// include search classes
	include_once('php/search.php');

	// default request parameters
	if(!isset($_POST['matchType'])){$_POST['matchType'] = '';}
	if(!isset($_POST['criteria'])){$_POST['criteria'] 	= '';}

	// throw an error if criteria is blank
	if( trim( $_POST['criteria'] ) == ''){
		throw new Exception("Please enter some criteria.");
	}

	// determine type of search class to use
	switch($_POST['matchType']){
		
		case 'contains':
			$cSearch = new Search();
			break;

		case 'exactMatch':
			$cSearch = new SearchExactMatch();
			break;

		default: 
			$cSearch = new Search();
			break;
	}

	// execute search
	$aMatch = $cSearch->match( $_POST['criteria'] );

	// create object to return
	$obj 				= array();
	$obj['errorMsg'] 	= '';
	$obj['items'] 		= $aMatch;


}catch(Exception $e){
	$obj = array();
	$obj['errorMsg'] = $e->getMessage();
}

// return object as json
echo json_encode($obj);

?>