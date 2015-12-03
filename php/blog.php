<?php

// https://www.googleapis.com/blogger/v3/blogs/336850018246988345/posts/?key=AIzaSyBMmDSKIlQWWOz4Ncn2zZWW9YTAR-C8a9M

class Blog{

	// API Credentials
	protected $APIKey = 'AIzaSyBMmDSKIlQWWOz4Ncn2zZWW9YTAR-C8a9M';
	//protected $blogID = '336850018246988345'; // removed for multiple instances
	
	// create the URL to fetch
	private function createURL($blogID = null, $pageToken = null){
		if( $pageToken == null){
			// first page
			return 'https://www.googleapis.com/blogger/v3/blogs/' . $blogID . '/posts/?key=' . $this->APIKey;
		}else{
			// subsequent pages (requires pageToken)
			return 'https://www.googleapis.com/blogger/v3/blogs/' . $blogID . '/posts/?key=' . $this->APIKey . '&pageToken=' . $pageToken;
		}
	}

	// fetch JSON and return it
	private function fetchURL($url){
		$oCurl 	= curl_init();
				curl_setopt($oCurl, CURLOPT_URL, $url);
				curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, 0);
				curl_setopt($oCurl, CURLOPT_HEADER, 0);
		$json = curl_exec($oCurl);
		curl_close($oCurl);
		return $json;
	}

	// list posts (pageToken reflects the page you want; null = first page, otherwise some token)
	public function listPosts($blogID = null, $pageToken = null){
		$localURL 		= $this->createURL($blogID, $pageToken);
		$localReturn 	= $this->fetchURL($localURL);
		return $localReturn;
	}

}

if(!isset($_REQUEST['pageToken'])){$_REQUEST['pageToken'] = '';}
if(!isset($_REQUEST['blogID'])){$_REQUEST['blogID'] = '';}

$oBlog = new Blog();
echo $oBlog->listPosts( $_REQUEST['blogID'], $_REQUEST['pageToken'] );
?>