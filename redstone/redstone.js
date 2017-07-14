let jsonfeed = [];
let feed;
let del;
let upvote;
let downvote;
$(function () {
	let post = $("#post");
	let imageSource = $("#imagesrc");
	let articleHeading = $("#heading");
	let articleContent = $("#article");
	feed = $("#feed");
	loadFeed();
	

	post.on('click',function(event) {
		addAndSaveArticle(imageSource.val(),articleHeading.val(),articleContent.val());
		loadFeed();
		imageSource.val("");
		articleHeading.val("");
		articleContent.val("");
	});
});

function createArticleObj(src,heading,content){
	let obj={
		"heading":heading,
		"img":src,
		"content":content,
		"comment":[],
		"commentCount":0,
		"upvotes":0,
		"downvotes":0
	}

	return obj;	
}

function saveToStorage(){
		localStorage.setItem("article", JSON.stringify(jsonfeed));
}

function retrieveFromStorage(){
	let fromStorage = localStorage.getItem("article");
	if(fromStorage){
			jsonfeed = JSON.parse(fromStorage);	
	}
}

function addAndSaveArticle(src,heading,content){
	let obj = createArticleObj(src,heading,content);
	jsonfeed.push(obj);
	saveToStorage();
}


function createArticleElement(index){
	let element = $(`<br><div class="col-12 contentblock" data-id="${index}">
							<div class="d-flex p-2">
								<h4>${jsonfeed[index]["heading"]}&nbsp;&nbsp;
								<i class="fa fa-times delete" data-toggle="tooltip" data-placement="top" title="delete article"></i></h4>
							</div>
						<div class="contentsubblock">
						<img class="image-fluid contentimg" src="${jsonfeed[index]["img"]}" width="auto" height="200" alt="image">
					    <p><i class="fa fa-edit edit" data-toggle="tooltip" data-placement="top" title="change image"></i>${jsonfeed[index]["content"]}</p>
					    </div>
					    <div class="d-flex justify-content-end">
					    	<div class="mr-auto p-2"><a class="btn btn-primary" data-toggle="collapse" href="#comments${index}" aria-expanded="false" aria-controls="comments">comments
							</a></div>
					   		<div class="p-2"><i class="fa fa-thumbs-up upvotes" data-toggle="tooltip" data-placement="top" title="upvote"></i>${jsonfeed[index]["upvotes"]}</div>					 
					    	<div class="p-2"><i class="fa fa-thumbs-down downvotes" data-toggle="tooltip" data-placement="top" title="downvote"></i>${jsonfeed[index]["downvotes"]}</div>
					    </div>
					    <div class="collapse" id="comments${index}">
					      <textarea rows="4" cols="4" class="form-control" id="feedComment${index}" placeholder="Enter comment"></textarea>
						  <button type="button" class="btn btn-danger commentButton">add</button>
						  <div class="card card-block feedCommentBox${index}">

						  </div>
						</div>
					</div>`);
	return element;
}

function loadFeed(){
	retrieveFromStorage("article");
	feed.empty();
	for(index in jsonfeed){
		if(jsonfeed[index]){
			let x = createArticleElement(index);
			feed.append(x);
			if(jsonfeed[index]["commentCount"]){
				loadFeedComments(index);
			}
		}
	}
	addListeners();
}

function loadFeedComments(index){
	let commentBox = $(`#comments${index} .feedCommentBox${index}`);
	for(i in jsonfeed[index]["comment"]){
		commentBox.append(createFeedComment(index,i));
	}
}

function addListeners(){
	del = $(".contentblock .delete");
	upvote = $(".contentblock .upvotes");
	downvote = $(".contentblock .downvotes");
	
	del.on('click', function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsonfeed.splice(pid,1);
			saveToStorage();
			loadFeed();	
	});
	upvote.on('click',function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsonfeed[pid]["upvotes"]++;
			saveToStorage();
			loadFeed();
		
	});
	downvote.on('click',function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsonfeed[pid]["downvotes"]++;
			saveToStorage();
			loadFeed();	
	});
	
	let add = $(`.contentblock .commentButton`);
	
	add.on('click',function(event) {
		let pid = $(event.target).parent().parent().attr('data-id');
		let comment = $(`.contentblock #feedComment${pid}`);
		let commentBox = $(`#comments${pid} .feedCommentBox${pid}`);
		let n = jsonfeed[pid]["commentCount"];
		if(comment.val() != ""){
			jsonfeed[pid]["comment"][n] = comment.val();
			jsonfeed[pid]["commentCount"]++;
			let x = createFeedComment(pid,n);
			commentBox.append(x);
			saveToStorage();
			loadFeed();
		}
		
		else alert("hey, I know I can't speak but atleat write something.")
	});
}

function createFeedComment(pid,n){
	let ob = $(`<div class="card card-block imgblock">
			<p>${jsonfeed[pid]["comment"][n]}</p>
			</div>`);
	return ob;
}
