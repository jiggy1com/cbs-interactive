'use strict';

// Search Constructor
function Search(){
	// this.prop = 'value';
}

// Search Prototypes

Search.prototype.clearSearchResults = function(){
	// hide alert
	$('#errorMsg').html('test').hide();

	// hide results container
	$('#search-results-container').hide();

	// clear results list
	$('#search-results').html('');
}

Search.prototype.runSearch = function(){
	var self = this; // allow internal access

	// clear results & errors
	this.clearSearchResults();

	// get results
	$.ajax({
		url : 'ajax.php',
		method : 'POST',
		dataType : 'json',
		data : {
			criteria : $('#criteria').val(),
			matchType : $('input:radio[name=matchType]:checked').val()
		}
	})
	.success(function(data){
		self.displayResults(data);
	})
	.error(function(){
		self.showAjaxError();
	});
}

Search.prototype.displayResults = function(obj){
	if(obj.errorMsg != ''){
		$('#errorMsg').html(obj.errorMsg).slideDown();
	}else{
		// fill in results
		for(var i=0;i<obj.items.length;i++){
			$('#search-results').append('<li>' + obj.items[i] + '</li>');
		}
		// show results
		$('#search-results-container').slideDown();
	}
}

Search.prototype.showAjaxError = function(){
	$('#errorMsg').html('An unknown error occurred. Please try again.').slideDown();
}

Search.prototype.init = function(){
	var self = this; // allow internal access
	$('#btn-search').click(function(){
		self.runSearch();
	});
}

// fire up search when DOM is ready
$(document).ready(function(){
	var search = new Search();
		search.init();
});
	
