'use strict';

/*****************/
/* http requests */
/*****************/

function HTTP(){	
}
HTTP.prototype.getURL = function(url, dataType) {	

	// return a new promise.
	return new Promise(function(resolve, reject) {

		// do the XHR stuff
		var req = new XMLHttpRequest();
			req.open('GET', url);
			req.onload = function() {

			// check status
			if (req.status == 200) {
				// resolve the promise with the response text
				if(dataType == 'json'){
					// return json
					resolve(JSON.parse(req.response)); 
				}else{
					// return text/html
					resolve(req.response); 
				}					
			}else {
				// reject with status text (404, doc moved, etc)
				reject(Error(req.statusText));
			}
		};

		// any errors ?
		req.onerror = function() {
			reject(Error("Network Error"));
		};

		// make request
		req.send();
	});
}

/*************************/
/* ajax data constructor */
/*************************/

function AjaxData(APIKey, blogID, pageToken){
	this.APIKey = APIKey;
	this.blogID = blogID;
	this.pageToken = pageToken;
}

/********************/
/* blog constructor */
/********************/

function Blog(el, blogID){
	this.element 			= el;
	this.blogID 			= blogID;
	this.APIKey 			= 'AIzaSyBMmDSKIlQWWOz4Ncn2zZWW9YTAR-C8a9M';
	this.loading 			= false;
	this.loadingComments 	= false;
	this.nextPageToken 		= '';
	this.postTemplate		= "<div class='blog-post' id='post-{postID}'>" + 
									"<h2>{blogTitle}</h2>" +
									"<h4>by {blogAuthor} on {blogPublishedDate}</h4>" +
									"<div class='blog-content'>" +
										"{blogContent}" +
									"</div>" +
									"<div class='blog-comments-container'>" +
										"<h3>Comments</h3>" +
									"</div>" +
								"</div>";
	this.commentTemplate 	= "<div class='blog-comment'>" +
									"<div class='row'>" +
										"<div class='col-md-12'>" +
											"<img src='{commentAuthorImageUrl}' alt='{commentAuthorDisplayName}' title='{commentAuthorDisplayName}'>" +
											"<div class='commentPublishedDate'>" +
												"{commentPublishedDate}" +
											"</div>" +
											"<div class='commentContent'>" +
												"{commentContent}" +
											"</div>" +
										"</div>" +
									"</div>" +
								"</div>";


}

Blog.prototype.showBlogSpinner = function(){
	var spinner = "<div id='spinner'><span class='fa fa-4x fa-spin fa-spinner'></span></div>";
	$(this.element).append(spinner); // #blog-results
}

Blog.prototype.hideBlogSpinner = function(){
	$(this.element).children('#spinner').remove();
}

Blog.prototype.setLoading = function(trueOrFalse){
	if(trueOrFalse){
		this.showBlogSpinner();
	}else{
		this.hideBlogSpinner();
	}
	this.loading = trueOrFalse;
	return this;
};

Blog.prototype.getBlog = function(){
	var self = this;
	if(!this.loading)
	{
		this.setLoading(true);

		var ajaxData = new AjaxData(this.APIKey, this.blogID);

		if(this.nextPageToken != ''){
			ajaxData.nextPageToken = this.nextPageToken;
		}

		var urlString = $.param(ajaxData);

		var http = new HTTP();
			http.getURL('php/blog.php?'+urlString, 'json')
			.then(function(data){
				self.listBlog(data).setLoading(false);
			}, function(data){
				self.setLoading(false);
			});
		/*		
		$.ajax({
			//url : 'https://www.googleapis.com/blogger/v3/blogs/'+self.blogID+'/posts/', // pull json directly from blogger api
			url : 'php/blog.php', // pull json from local php script that fetches blogger api
			dataType : 'json',
			data : ajaxData
		})
		.success(function(data){					
			self.listBlog(data).setLoading(false);
		})
		.error(function(){
			self.setLoading(false);
		});
		*/
	}else{
		//console.log('i am already loading, please wait!!');
	}
	//return this;
};

Blog.prototype.listBlog = function(obj){
	var self = this;
	// set next page token 
	this.nextPageToken = obj.nextPageToken;

	// display blog posts
	for (var i=0; i<obj.items.length;i++){
		var postHTML = this.postTemplate;
			postHTML = this.replacePostTemplate(obj.items[i], postHTML);
			//document.getElementById('blog-results').insertAdjacentHTML('beforeend', postHTML);
			
			$(self.element).append(postHTML);

			// load comments after post loads
			self.getComments(obj.items[i].id, obj.items[i].replies.selfLink);
	}
	return this; // allow chaining
};

Blog.prototype.replacePostTemplate = function(obj, str){
	var tpl = str;
		tpl = tpl.replace(/{postID}/g, obj.id);
		tpl = tpl.replace(/{blogTitle}/g, obj.title);
		tpl = tpl.replace(/{blogAuthor}/g, obj.author.displayName);
		tpl = tpl.replace(/{blogPublishedDate}/g, this.formatDateTime(obj.published));
		tpl = tpl.replace(/{blogContent}/g, obj.content);
	return tpl;
}

Blog.prototype.getComments = function(postID, url){
	var self = this;
	var http = new HTTP();
		http.getURL(url + '?key=' + this.APIKey, 'json')
		.then(function(oComments){
			if(oComments.hasOwnProperty('items') && oComments.items.hasOwnProperty('length') ){
				for(var i=0;i<oComments.items.length;i++){
					var commentHTML = self.getCommentTemplate();
						commentHTML = commentHTML.replace(/{commentAuthorDisplayName}/g, oComments.items[i].author.displayName);
						commentHTML = commentHTML.replace(/{commentAuthorImageUrl}/g, oComments.items[i].author.image.url);
						commentHTML = commentHTML.replace(/{commentPublishedDate}/g, self.formatDateTime(oComments.items[i].published));
						commentHTML = commentHTML.replace(/{commentContent}/g, oComments.items[i].content);
						$('#post-' + postID + ' .blog-comments-container').append(commentHTML);
				}
			}else{
				$('#post-' + postID + ' .blog-comments-container').append('(no comments found)');
			}
		}, function(data){
			// 
		});

	/*
	$.ajax({
		url : url + '?key=' + this.APIKey, // pull comments from blogger api directly 
		dataType : 'json',
	})
	.success(function(oComments){
		// only display comments if the items exists and has a length
		if(oComments.hasOwnProperty('items') && oComments.items.hasOwnProperty('length') ){
			for(var i=0;i<oComments.items.length;i++){
				var commentHTML = self.getCommentTemplate();
					commentHTML = commentHTML.replace(/{commentAuthorDisplayName}/g, oComments.items[i].author.displayName);
					commentHTML = commentHTML.replace(/{commentAuthorImageUrl}/g, oComments.items[i].author.image.url);
					commentHTML = commentHTML.replace(/{commentPublishedDate}/g, self.formatDateTime(oComments.items[i].published));
					commentHTML = commentHTML.replace(/{commentContent}/g, oComments.items[i].content);
					$('#post-' + postID + ' .blog-comments-container').append(commentHTML);
			}
		}
	})
	.error(function(){
		// ?
	});
	*/	
};

Blog.prototype.getBlogTemplate = function(){
	return this.blogTemplate;
};

Blog.prototype.getCommentTemplate = function(){
	return this.commentTemplate;
}

// date time methods

Blog.prototype.formatDateTime = function(dateTime){
	var d = new Date(dateTime);
	var tpl = this.monthAsString( this.getRealMonth( d.getMonth() ) ) + ' ' + d.getDate() + ', ' + d.getFullYear();
		tpl += ' at ';
		tpl += this.get12HourFormat(d.getHours()) + ':' + this.getRealMinutes(d.getMinutes()) + ' ' + this.getAMPM(d.getHours());
	return tpl;
};

Blog.prototype.getRealMonth = function(m){
	return m+1;
};

Blog.prototype.monthAsString = function(m){
	if(m == 1){return 'January';}
	if(m == 2){return 'February';}
	if(m == 3){return 'March';}
	if(m == 4){return 'April';}
	if(m == 5){return 'May';}
	if(m == 6){return 'June';}
	if(m == 7){return 'July';}
	if(m == 8){return 'August';}
	if(m == 9){return 'September';}
	if(m == 10){return 'October';}
	if(m == 11){return 'November';}
	if(m == 12){return 'December';}
};

Blog.prototype.get12HourFormat = function(h){
	if(h == 0){
		return 12;
	}else if(h <= 12){
		return h
	}else{
		return h-12;
	}
};

Blog.prototype.getRealMinutes = function(m){
	return m <= 9 ? '0'+m : m;
	// if(m <= 9){
	// 	return '0'+m;
	// }else{
	// 	return m;
	// }
}

Blog.prototype.getAMPM = function(h){
	if(h >= 12){
		return 'PM';
	}else{
		return 'AM';
	}
};

// listener functions

Blog.prototype.scrollHandler = function(){
	var windowHeight = window.innerHeight;
	var windowTop = $('body').scrollTop();
	var containerTop = $(this.element).position().top; 	//var containerTop = $('#blog-results-container').position().top;
	var containerHeight = $(this.element).height(); 	//var containerHeight = $('#blog-results-container').height();
	var containerBottom = containerTop + containerHeight;
	if(windowTop >= containerBottom - windowHeight){
		this.getBlog();
	}
}

Blog.prototype.init = function(){
	var self = this;
	document.addEventListener('scroll', function(){
		self.scrollHandler();
	}, false);
	this.getBlog();
};	
//Blog.prototype.init.bind(this); // testing something



// this array is used to allow 2 distinct blogs
var aBlog = ['336850018246988345', '897802273693999289']

$(document).ready(function(){

	// load blog on element
	$('.blog-results').each(function(index, element){
		var app = new Blog( element, aBlog[index]);
			app.init();
	});
		
});
