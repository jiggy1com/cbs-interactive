<?php 
	
	// SEARCH CLASS

	class Search{

		public static function getFile(){
			// get app directory
			getcwd();
			// change to csv directory where csv is stored
			chdir('csv');
			// read file content into array
			$file = file('welcome-to-the-jungle.csv');		
			return $file;
		}

		public function match($findThis){
			// trim white space
			$findThis = trim($findThis);

			// create array to store found lines
			$returnThis 	= array();

			// get file as array
			$fileContent 	= $this->getFile();

			// loop file data, add matched lines to array
			foreach($fileContent as $line){
				$thisLine = trim($line);
				if( strpos($thisLine, $findThis) !== false && strpos($thisLine, $findThis) >= 0){
					array_push($returnThis, $thisLine);
				}
			}
			return $returnThis;
		}

	}


	// SEARCH EXACT MATCH CLASS

	class SearchExactMatch extends Search{

		// overwrite match method from Search class (see Search->match for details)
		public function match($findThis){
			$findThis = trim($findThis);
			$returnThis 	= array();
			$fileContent 	= $this->getFile();
			foreach($fileContent as $line){
				$thisLine = trim($line);
				if( trim($findThis) === $thisLine){
					array_push($returnThis, $thisLine);
				}
			}
			return $returnThis;
		}

	}

?>