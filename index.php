<!doctype html>
<head>
	<title>CBS Interactive - Coding Assignment</title>
	<script src='https://code.jquery.com/jquery-2.1.4.min.js'></script>
	<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'></script>
	<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' />
	<link rel='stylesheet' href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">

	<script src='js/search.js'></script>
	<script src='js/blog.js'></script>

	<link rel='stylesheet' href='css/css.css' />
</head>
<body>

	<header id='header'>
		<div class='container'>
			<div class='row'>
				<div class='col-md-12'>
					<h1>CBS Interactive Coding Assignment</h1>
				</div>
			</div>
		</div>
	</header>

	<article>
		
		<section>
			<div class='container'>
				<div class='row'>
					<div class='col-md-12'>
						<h1>Search</h1>
					</div>
				</div>
				<div class='row'>
					<div class='col-md-12'>

						<div id='errorMsg' class='alert alert-danger'></div>

						<p>This search will find lyric lines from the song <i>Welcome to the Jungle</i></p>

						<!-- criteria (search string) -->
						<div class='form-group'>
							<label>Criteria</label>
							<input type='text' class='form-control' name='criteria' id='criteria' />
						</div>

						<!-- type of match -->
						<div class="radio">
							<label>
								<input type="radio" name="matchType" id="matchType0" value="contains" checked>
									Contains
							</label>
						</div>
						<div class="radio">
							<label>
								<input type="radio" name="matchType" id="matchType1" value="exactMatch">
								Exact Match
							</label>
						</div>
						<button class='btn btn-primary' id='btn-search'>
							Search
						</button>

					</div>
				</div>
				
				<div class='row' id='search-results-container'>
					<div class='col-md-12'>
						<h2>Search Results</h2>
						<ul id='search-results'>
						</ul>
					</div>
				</div>				

			</div>
		</section>

		<section>
			<div class='container'>
				<div class='row'>
					<div class='col-md-12'>
						<h1>Blog</h1>
					</div>
				</div>
				<div class='row'>
					<div class='col-md-6 blog-results'>
					</div>
					<div class='col-md-6 blog-results'>
					</div>
				</div>
				<?php 
				/*
				<div class='row' id='blog-results-container'>
					<div class='col-md-12' id='blog-results'>
						
					</div>
				</div>
				*/
				?>
			</div>
		</section>

	<footer id='footer'>
		<div class='container'>
			<div class='row'>
				<div class='col-md-12'>
					<h4>by Joe Velez</h4>
				</div>
			</div>
		</div>
	</footer>

</body>
</html>