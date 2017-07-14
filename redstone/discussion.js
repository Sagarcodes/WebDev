let jsondiscussion = [];

$(function() {
	let query = $('#inputquery');
	let add = $('#add');
	discussion = $("#discussions");
	unanswered = $("#unanswered");
	loadDiscussion();
	add.on('click',function(event){
		addAndSavetopic(query.val());
		loadDiscussion();
		query.val("");
	});
});


function createTopicObj(topic){
	let obj = {
		"topic":topic,
		"upvotes":0,
		"downvotes":0,
		"comment":[],
		"commentCount":0
	}
	return obj;
}


function saveTopictoStorage(){
	localStorage.setItem("topic",JSON.stringify(jsondiscussion));
}


function retrieveTopicFromStorage(){
	let topicFromStorage = localStorage.getItem("topic");
	if(topicFromStorage){
		jsondiscussion = JSON.parse(topicFromStorage);
	}
}


function addAndSavetopic(topic){
	let obj = createTopicObj(topic);
	jsondiscussion.push(obj);
	saveTopictoStorage();
}



function createDiscussionElement(index){
	let element = $(`<div class="col-12 discussionblock" data-id="${index}">
			<div class="d-flex justify-content-end">
				<div class="mr-auto p-2"><h4>${jsondiscussion[index]["topic"]}</h4></div>
				<div class="p-2"><i class="fa fa-times delete" data-toggle="tooltip" data-placement="top" title="delete topic"></i></div>
			</div>
			<div class="d-flex justify-content-end">
				<div class="mr-auto p-2"><a class="btn btn-primary" data-toggle="collapse" href="#discussions${index}" aria-expanded="false" aria-controls="comments">comments ${jsondiscussion[index]["commentCount"]}
				</a></div>
				<div class="p-2"><i class="fa fa-thumbs-up upvotes" data-toggle="tooltip" data-placement="top" title="upvote"></i>${jsondiscussion[index]["upvotes"]}</div>					 
				<div class="p-2"><i class="fa fa-thumbs-down downvotes" data-toggle="tooltip" data-placement="top" title="downvote"></i>${jsondiscussion[index]["downvotes"]}</div>
			</div>
				<div class="collapse" id="discussions${index}">
				    <textarea rows="4" cols="4" class="form-control topicComment${index}" placeholder="Enter comment"></textarea>
					<button type="button" class="btn btn-danger commentButton">add</button>
					<div class="card card-block commentBox${index}">
					</div>
				</div>

		</div>`);
	return element;
}

function loadDiscussion(){
	retrieveTopicFromStorage();
	discussion.empty();
	for(index in jsondiscussion){
		if(jsondiscussion[index]){	
			let x = createDiscussionElement(index);
			discussion.append(x);
			if(jsondiscussion[index]["commentCount"]){

				loadTopicComments(index);
			}
			if(jsondiscussion[index]["commentCount"]==0){
				unanswered.append(x);
			}
		}
	}
	addDiscussionListeners();
}
function loadTopicComments(index){
	let commentBox = $(`#discussions${index} .commentBox${index}`);
	for(i in jsondiscussion[index]["comment"]){
		commentBox.append(createComment(index,i));
	}
}

function addDiscussionListeners () {
	let del = $(".discussionblock .delete");
	let upvote = $(".discussionblock .upvotes");
	let downvote = $(".discussionblock .downvotes");

	
	del.on('click', function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsondiscussion.splice(pid,1);
			saveTopictoStorage();
			loadDiscussion();	
	});
	upvote.on('click',function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsondiscussion[pid]["upvotes"]++;
			saveTopictoStorage();
			loadDiscussion();
		
	});
	downvote.on('click',function(event) {
		let pid = $(event.target).parent().parent().parent().attr('data-id');
			jsondiscussion[pid]["downvotes"]++;
			saveTopictoStorage();
			loadDiscussion();	
	});





	let add = $(`.discussionblock .commentButton`);
	add.on('click',function(event) {
		let pid = $(event.target).parent().parent().attr('data-id');
		let comment = $(`.discussionblock .topicComment${index}`);
		let commentBox = $(`#discussions${pid} .commentBox${pid}`);
		let n = jsondiscussion[pid]["commentCount"];
		if(comment.val() != ""){
			jsondiscussion[pid]["comment"][n] = comment.val();
			jsondiscussion[pid]["commentCount"]++;
			let x = createComment(pid,n);
			commentBox.append(x);
			saveTopictoStorage();
			loadDiscussion();
		}
		else alert("hey, I know I can't speak but atleat write something.")
	});
}

function createComment(pid,n){
	let ob = $(`<div class="card card-block imgblock">
			<p>${jsondiscussion[pid]["comment"][n]}</p>
			</div>`);
	return ob;
}