
$('.ref').change(function(e){ // 권한 설정 완료
	e.target.title = e.target.value;
	var nodename = document.querySelector('title').innerText;
	var json = JSON.parse(e.target.dataset.id);
	var num = parseInt(json.num);
	var _id = parseInt(json._id);
	$.ajax({
		method : 'PUT',
		url : '/save/refer',
		data : {_id : _id, nodename : nodename, num : num, content : e.target.value}
	});
});

$('.usage').change(function(e){ // 권한 설정 완료
	e.target.title = e.target.value;
	var nodename = document.querySelector('title').innerText;
	var json = JSON.parse(e.target.dataset.id);
	var num = parseInt(json.num);
	var _id = parseInt(json._id);
	$.ajax({
		method : 'PUT',
		url : '/save/usage',
		data : {_id : _id, nodename : nodename, num : num, content : e.target.value}
	});
});

$('.set_disable_button').click(function(e){ // 권한 설정 완료
	var nodename = document.querySelector('title').innerText;
	var json = JSON.parse(e.target.dataset.id);
	var sharenum = e.target.id;
	var num = document.querySelector(`#p${sharenum} .set_disable_select`).value;
	var _id = parseInt(json._id);
	$.ajax({
		method : 'PUT',
		url : '/save/disable',
		data : {_id : _id, nodename : nodename, num : num}
	});
});

$('.remove_disable_button').click(function(e){ // 권한 설정 완료
	var nodename = document.querySelector('title').innerText;
	var json = JSON.parse(e.target.dataset.id);
	var _id = parseInt(json._id);
	var sharenum = e.target.id;
	var num = document.querySelector(`#p${sharenum} .remove_disable_select`).value;

	$.ajax({
		method : 'PUT',
		url : '/save/available',
		data : {_id : _id, nodename : nodename, num : num}
	});
});


//allconnect
$('.num').dblclick(function(e){
	var json = e.target.dataset.id;
	$.ajax({
		method : 'post',
		url : '/allconnect',
		data : {json : json}
	}).done(function(result){
		document.querySelector('.allconnect').innerHTML = result;
  }).fail(function(xhr,textStatus,errorThrown){
    console.log(xhr,textStatus,errorThrown);
  });
});


//노드 생성시 중복 확인 // 권한 설정 완료
function checking_node_double(){
	var newnodename = document.querySelector('.newnodetext').value;
	var flag;
	$.ajax({
		method : 'post',
		url : '/check/nodename',
		data : {newnodename : newnodename},
		async : false
	}).done(function(result){
		flag = result;
	}).fail(function(xhr,textStatus,errorThrown){
		console.log(xhr,textStatus,errorThrown);
	});
		if(flag === "true"){
			return true;
		}else if(flag === "false"){
			alert('이미 존재하는 노드 이름입니다.')
			return false;
		}else if(flag === "access_denied"){
			alert('권한이 없는 계정입니다.')
			return false;
		}
}

//포트 생성시 중복 확인 // 권한 설정 완료
function check_port_double(){
	var newportname = document.querySelector('.newportname').value;
	var oppnodename = document.querySelector('.selected_oppnode').value;
	var nodename = document.querySelector('.hidden_title').value;
	if(oppnodename === "" || oppnodename === null || oppnodename === undefined){
		alert('반대노드 없이는 포트 생성을 할 수 없습니다.')
		return false;
	}else{
		var flag;
		$.ajax({
			method : 'post',
			url : '/check/portname',
			data : {nodename : nodename, newportname : newportname, oppnodename : oppnodename},
			async : false
		}).done(function(result){
			flag = result;
		}).fail(function(xhr,textStatus,errorThrown){
			console.log(xhr,textStatus,errorThrown);
		});
		if(flag === "true"){
			return true;
		}else if(flag === "false"){
			alert('현재 노드에 같은 이름을 가진 같은 반대노드로 연결된 포트가 이미 존재합니다')
			return false;
		}else if(flag === "access_denied"){
			alert('권한이 없는 계정입니다.')
			return false;
		}
	}
}


//노드 삭제시 안에 포트 있는지 확인 // 권한 설정 완료
function check_delete_node(){
	var nodename = document.querySelector('.hidden_title').value;
	var flag;
	$.ajax({
		method : 'post',
		url : '/check/deletenode',
		data : {nodename : nodename},
		async : false
	}).done(function(result){
		flag = result;
	}).fail(function(xhr,textStatus,errorThrown){
		console.log(xhr,textStatus,errorThrown);
	});
	if(flag === "true"){
		var check = confirm("현재 노드를 삭제하시겠습니까?");
		if(check === true){
			return true;
		}else{
			return false;
		}
	}else if(flag === "false"){
		alert('노드를 삭제하시려면 해당 노드안의 포트들을 먼저 삭제하시고, 상위 노드의 경우 하위 노드를 먼저 삭제하십시오.')
		return false;
	}else if(flag === "access_denied"){
		alert('권한이 없는 계정입니다.')
		return false;
	}
}




//노드 삭제시 안에 포트 있는지 확인 // 권한 설정 완료
function check_delete_port(sharenum){
	var sharenum = sharenum;
	var nodename = document.querySelector('.hidden_title').value;
	var flag;
	$.ajax({
		method : 'post',
		url : '/check/deleteport',
		data : {nodename : nodename, sharenum : sharenum},
		async : false
	}).done(function(result){
		flag = result;
	}).fail(function(xhr,textStatus,errorThrown){
		console.log(xhr,textStatus,errorThrown);
	});
	if(flag === "true"){
		var check = confirm("포트 삭제를 진행하시겠습니까?");
		if(check === true){
			return true;
		}else{
			return false;
		}
	}else if(flag === "false"){
		alert('현재노드나 반대노드에 사용중인 포트가 있을 경우 포트 삭제가 불가능합니다.')
		return false;
	}else if(flag === "access_denied"){
		alert('권한이 없는 계정입니다.')
		return false;
	}
}



function search(){
	var search_string = document.querySelector('.search_string').value;
	if(search_string === ""){
		alert('검색어를 입력하시기 바랍니다.')
	}else{
		$.ajax({
			method : 'post',
			url : '/search',
			data : {search_string : search_string}
		}).done(function(result){
			document.querySelector('.searched').innerHTML = result;
		}).fail(function(xhr,textStatus,errorThrown){
			console.log(xhr,textStatus,errorThrown);
		});
	}

}

function getHidden(){
	document.querySelector('.allconnect_json').value = document.querySelector('.allconnect_hidden').value;
	document.querySelector('.allconnect_nodename').value = document.querySelector('.nodename').value;
	return true;
}

















//









// }
