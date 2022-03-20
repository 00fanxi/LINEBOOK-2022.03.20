function change(e){
	if(e.target.className.indexOf('ref') != -1){
		e.target.title = e.target.value;
		var nodename = document.querySelector('.center_this').value;
		var json = JSON.parse(e.target.dataset.id);
		var num = parseInt(json.num);
		var _id = parseInt(json._id);
		$.ajax({
			method : 'PUT',
			url : '/save/refer',
			data : {_id : _id, nodename : nodename, num : num, content : e.target.value}
		});
	}else if(e.target.className.indexOf('usage') != -1){
		e.target.title = e.target.value;
		var nodename = document.querySelector('.center_this').value;
		var json = JSON.parse(e.target.dataset.id);
		var num = parseInt(json.num);
		var _id = parseInt(json._id);
		$.ajax({
			method : 'PUT',
			url : '/save/usage',
			data : {_id : _id, nodename : nodename, num : num, content : e.target.value}
		});
	}
}

document.addEventListener('change',change)


$('.center_this').change(function(e){
	var nodename = e.target.value;
	var option = "";

	document.querySelector('#east_opp').innerHTML = option;
	document.querySelector('#west_opp').innerHTML = option;
	document.querySelector('#east_name').innerHTML = option;
	document.querySelector('#west_name').innerHTML = option;
	document.querySelector('.west_port').innerHTML = option;
	document.querySelector('.east_port').innerHTML = option;

	$.ajax({
		method : 'post',
		url : '/connect/thisnode',
		data : {nodename : nodename}
	}).done(function(result){
    var json = JSON.parse(result);
    var oppnodelist = json.oppnodelist;
    var option = `<option selected></option>`;
    for(var i in oppnodelist){
      option += `<option value = "${oppnodelist[i]}" class="${oppnodelist[i]}">${oppnodelist[i]}</option>`;
    }
		document.querySelector('#east_opp').innerHTML = option;
		document.querySelector('#west_opp').innerHTML = option;

  }).fail(function(xhr,textStatus,errorThrown){
    console.log(xhr,textStatus,errorThrown);
  });
});




$('.opps').change(function(e){
	var oppnodename = e.target.value;
  var which_side = e.target.id;
  var opp_side;
  var which_name;
  var opp_name; // 반대편 포트 이름 셀렉터의 아이
	var which_port;// 포트 HTML 넣는 div
  if(which_side === "west_opp"){
    opp_side = "east_opp";
    which_name = "west_name";
    opp_name = "east_name";
		which_port = "west_port";
  }else{
    opp_side = "west_opp";
    which_name = "east_name";
    opp_name = "west_name";
		which_port = "east_port";
  }
	document.querySelector(`#${which_name}`).innerHTML = "";
	document.querySelector(`.${which_port}`).innerHTML = "";

	var nodename = document.querySelector('.center_this').value;
	$.ajax({
		method : 'post',
		url : '/connect/oppnode',
		data : {nodename : nodename, oppnodename : oppnodename}
	}).done(function(result){

    var json = JSON.parse(result);
    var portnamelist = json.portnamelist;
    var option = `<option selected></option>`;
    var which_options = $(`#${which_side}`).children();
    var opp_options = $(`#${opp_side}`).children();
    for(var i = 0;i<which_options.length;i++){
      which_options[i].style.display = "inline";
      opp_options[i].style.display = "inline";
    }
    var which_value = document.querySelector(`#${which_side}`).value;
    var opp_value = document.querySelector(`#${opp_side}`).value;
		//이미 선택되어 있는 반대노드나 지금 선택된 반대노드를 동서 양쪽의 리스트에서 하나씩 뺀다.
    // if(which_value === opp_value && which_value != ""){
    //   var same_which = document.querySelectorAll(`#${which_side} .${which_value}`);
    //   var same_opp = document.querySelectorAll(`#${opp_side} .${which_value}`);
    //   for(var i = 0;i<2;i++){
    //     same_which[i].style.display = "none";
    //     same_opp[i].style.display = "none";
    //   }
    // }else if(which_value != opp_value){
    //   if(which_value != ""){
    //     document.querySelector(`#${which_side} .${which_value}`).style.display = "none";
    //     document.querySelector(`#${opp_side} .${which_value}`).style.display = "none";
    //   }
    //   if(opp_value != ""){
    //     document.querySelector(`#${opp_side} .${opp_value}`).style.display = "none";
    //     document.querySelector(`#${which_side} .${opp_value}`).style.display = "none";
    //   }
    // }
    //변경된 사이드에 portnamelist 제공, 만약 반대 사이드에 노드가 같고 이미 포트 이름이 선택되어 있다면 그 이름을 리스트에서 none으로
    for(var i in portnamelist){
      if(which_value === opp_value && document.querySelector(`#${opp_name}`).value != "" && document.querySelector(`#${opp_name}`).value === portnamelist[i]){
        option += `<option value = "${portnamelist[i]}" class="${portnamelist[i]}" style="display:none;">${portnamelist[i]}</option>`;
      }else{
        option += `<option value = "${portnamelist[i]}" class="${portnamelist[i]}">${portnamelist[i]}</option>`;
      }
    }
    if(which_side === "west_opp"){
      document.querySelector('#west_name').innerHTML = option;
    }else if(which_side === "east_opp"){
      document.querySelector('#east_name').innerHTML = option;
    }
  }).fail(function(xhr,textStatus,errorThrown){
    console.log(xhr,textStatus,errorThrown);
  });
});




$('.names').change(function(e){
	var nodename = document.querySelector('.center_this').value;
  var which_side = e.target.id;
  var opp_side;
  var which_opp;
  var opp_opp;
  var which_port;

  if(which_side === "west_name"){
    opp_side = "east_name";
    which_opp = "west_opp";
    opp_opp = "east_opp";
    which_port = "west_port";
		which_data = "w_connect_data";
  }else{
    opp_side = "west_name";
    which_opp = "east_opp";
    opp_opp = "west_opp";
    which_port = "east_port";
		which_data = "e_connect_data";
  }

	document.querySelector(`.${which_port}`).innerHTML = "";

	if(e.target.value != ""){
		var oppnodename = document.querySelector(`#${which_opp}`).value;

	  var portname = e.target.value;

		$.ajax({
			method : 'post',
			url : '/connect/portname',
			data : {nodename : nodename,oppnodename : oppnodename, portname : portname}
		}).done(function(result){
			result = JSON.parse(result);
			var port = result.port;
			var connect_data = JSON.stringify(result.connect_data);
	    document.querySelector(`.${which_port}`).innerHTML = port;
			document.querySelector(`.${which_data}`).value = connect_data;
	    //선택된 포트이름을 리스트에서 뺀다
	    var which_options = $(`#${which_side}`).children();
	    var opp_options = $(`#${opp_side}`).children();
	    for(var i = 0;i<which_options.length;i++){
	      which_options[i].style.display = "inline";
	    }
	    for(var i = 0;i<opp_options.length;i++){
	      opp_options[i].style.display = "inline";
	    }
	    var which_value = document.querySelector(`#${which_side}`).value;
	    var opp_value = document.querySelector(`#${opp_side}`).value;

	    which_opp = document.querySelector(`#${which_opp}`).value;
	    opp_opp = document.querySelector(`#${opp_opp}`).value;
	    //둘이 같고 ""가 아닐경우, 둘이 같고 ""일 경우, 둘이 다르고 하나는 ""일 경, 둘이 다르고 둘다 ""이 아닐경우
	    if(which_value === opp_value && which_value != "" && opp_opp === which_opp){
	      var same_which = document.querySelectorAll(`#${which_side} .${which_value}`);
	      var same_opp = document.querySelectorAll(`#${opp_side} .${which_value}`);
	      for(var i = 0;i<2;i++){
	        same_which[i].style.display = "none";
	        same_opp[i].style.display = "none";
	      }
	    }else if(which_value != opp_value && opp_opp != "" && opp_opp === which_opp){
	      if(which_value != ""){
	        document.querySelector(`#${which_side} .${which_value}`).style.display = "none";
	        document.querySelector(`#${opp_side} .${which_value}`).style.display = "none";
	      }
	      if(opp_value != ""){
	        document.querySelector(`#${opp_side} .${opp_value}`).style.display = "none";
	        document.querySelector(`#${which_side} .${opp_value}`).style.display = "none";
	      }
	    }else if(which_value != opp_value && opp_opp != "" && which_opp === ""){
	      if(opp_value != ""){
	        document.querySelector(`#${opp_side} .${opp_value}`).style.display = "none";
	      }
	    }else if(which_value != opp_value && opp_opp === "" && which_opp != ""){
	      if(which_value != ""){
	        document.querySelector(`#${which_side} .${which_value}`).style.display = "none";
	      }
	    }

	  }).fail(function(xhr,textStatus,errorThrown){
	    console.log(xhr,textStatus,errorThrown);
	  });
	}
});




$('.connecting').click(function(e){
	var west_point_number = document.querySelectorAll('.west_port #Sel');
  var east_point_number = document.querySelectorAll('.east_port #Sel');

	var w_connect_data = JSON.parse(document.querySelector('.w_connect_data').value);
	var e_connect_data = JSON.parse(document.querySelector('.e_connect_data').value);

  if(west_point_number.length != 1 || east_point_number.length != 1){
 	  alert('연결을 하시려면 각 단자에서 포트를 하나씩 선택하셔야 합니다.');
  }else if(west_point_number.length === 1 && east_point_number.length === 1){

		var west_JSON = document.querySelector(`.west_port #Sel`).dataset.id;
		var east_JSON = document.querySelector(`.east_port #Sel`).dataset.id;

		west_json = JSON.parse(west_JSON);
		east_json = JSON.parse(east_JSON);

		var w_sharenum = west_json.sharenum;
		var w_num = west_json.num;
		var w_oppnodename = west_json.oppnodename;
		var w_portname = west_json.portname;

		var e_sharenum = east_json.sharenum;
		var e_num = east_json.num;
		var e_oppnodename = east_json.oppnodename;
		var e_portname = east_json.portname;

		if(
			w_connect_data[w_num].some(function(element){
				if(element.sharenum === east_json.sharenum && element.num === east_json.num){
					return true;
				}
			})
		){
			alert('이미 서로 연결되어 있는 포트 입니다.');
		}else{
			$.ajax({
				method : 'post',
				url : '/connect/connecting',
				data : {west_json : west_JSON, east_json : east_JSON}
			}).done(function(result){
		    var json = JSON.parse(result);
				var w_connect_data = json.w_connect_data;
				var e_connect_data = json.e_connect_data;
				var w_port = json.w_port;
				var e_port = json.e_port;

				document.querySelector('.west_port').innerHTML = w_port;
				document.querySelector('.east_port').innerHTML = e_port;

				document.querySelector('.w_connect_data').value = JSON.stringify(w_connect_data);
				document.querySelector('.e_connect_data').value = JSON.stringify(e_connect_data);

		  }).fail(function(xhr,textStatus,errorThrown){
		    console.log(xhr,textStatus,errorThrown);
		  });
		}
  }
});




$('.disconnecting').click(function(e){
	var west_point_number = document.querySelectorAll('.west_port #Sel');
  var east_point_number = document.querySelectorAll('.east_port #Sel');

	var w_connect_data = JSON.parse(document.querySelector('.w_connect_data').value);
	var e_connect_data = JSON.parse(document.querySelector('.e_connect_data').value);

  if(west_point_number.length != 1 || east_point_number.length != 1){
 	  alert('연결해제를 하시려면 각 단자에서 포트를 하나씩 선택하셔야 합니다.');
	}else{
		var west_JSON = document.querySelector(`.west_port #Sel`).dataset.id;
		var east_JSON = document.querySelector(`.east_port #Sel`).dataset.id;

		west_json = JSON.parse(west_JSON);
		east_json = JSON.parse(east_JSON);

		var w_sharenum = west_json.sharenum;
		var w_num = west_json.num;
		var w_oppnodename = west_json.oppnodename;
		var w_portname = west_json.portname;

		var e_sharenum = east_json.sharenum;
		var e_num = east_json.num;
		var e_oppnodename = east_json.oppnodename;
		var e_portname = east_json.portname;

		if(
			w_connect_data[w_num].some(function(element){
				if(element.sharenum === east_json.sharenum && element.num === east_json.num){
					return true;
				}
			})
		){
			$.ajax({
				method : 'post',
				url : '/connect/disconnecting',
				data : {west_json : west_JSON, east_json : east_JSON}
			}).done(function(result){
				var json = JSON.parse(result);
				var w_connect_data = json.w_connect_data;
				var e_connect_data = json.e_connect_data;
				var w_port = json.w_port;
				var e_port = json.e_port;

				document.querySelector('.west_port').innerHTML = w_port;
				document.querySelector('.east_port').innerHTML = e_port;
				document.querySelector('.w_connect_data').value = JSON.stringify(json.w_connect_data);
				document.querySelector('.e_connect_data').value = JSON.stringify(json.e_connect_data);

			}).fail(function(xhr,textStatus,errorThrown){
				console.log(xhr,textStatus,errorThrown);
			});
		}else{

			alert('선택하신 포트들은 서로 연결되어 있지 않습니다.');
		}
	}
});
