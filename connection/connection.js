function close_nodelist(self){
	if(self.value === "노드리스트 닫기"){
		document.querySelector('.nodelist').style.display = 'none';
		self.value = "노드리스트 보기";
	}else{
		document.querySelector('.nodelist').style.display = 'flex';
		self.value = "노드리스트 닫기";
	}
}

function showlines(self){
	if(self.value === '연결선 보기'){
		if(document.querySelector('#west_name').value === "" || document.querySelector('#east_name').value === "" ){
			alert('연결선을 나타낼 포트가 없습니다.')
		}else{
			var w_connect_data = JSON.parse(document.querySelector('.w_connect_data').value);
			var e_sharenum = JSON.parse(document.querySelector('.east_port .spread').dataset.id).sharenum;

			for(var i = 1; i<= Object.keys(w_connect_data).length;i++){

				for(var j in w_connect_data[i]){

					if(w_connect_data[i][j].sharenum === e_sharenum){
						var w_class = i;
						var e_class = w_connect_data[i][j].num;
						var west_point = document.querySelector(`.west_port .n${w_class}`);
						var east_point = document.querySelector(`.east_port .n${e_class}`);

						var west_off = getOffset(west_point);
						var east_off = getOffset(east_point);
						// middle
						var x_w = west_off.left + west_off.width/2;
						var y_w = west_off.top + west_off.height/2;
						// middle
						var x_e = east_off.left + east_off.width/2;
						var y_e = east_off.top + east_off.height/2;
							// distance
						var length = Math.sqrt(((x_e-x_w) * (x_e-x_w)) + ((y_e-y_w) * (y_e-y_w)));
							// center
						var cx = ((x_w + x_e) / 2) - (length / 2);
						var cy = ((y_w + y_e) / 2) - (1 / 2);
								// angle
						var angle = Math.atan2((y_e-y_w),(x_e-x_w))*(180/Math.PI);
						// make hr
						var htmlLine = "<div class='line' style='padding:0px; margin:0px; height:1px; background-color:black; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
						//
						self.value = '연결선 없애기'
						document.querySelector(".connecting_ports").innerHTML += htmlLine;
					}
				}
			}
		}
	}else{
		var lines = document.querySelectorAll('.line');
		for(var i = 0;i<lines.length;i++){
			lines[i].remove();
		}
		self.value = "연결선 보기";
	}

}


function spread_MDF(self){
	var json = JSON.parse(self.dataset.id);
	var portnumber = parseInt(json.portnumber);
	var sharenum = parseInt(json.sharenum);
	var port_height = parseInt(json.port_height);

	if(self.value === '펼쳐보기'){
		if(portnumber<21){
			document.querySelector(`#p${sharenum}`).style.height = `((${portnumber} * 2) + 9.3)rem`;
		}else if(portnumber>20 && portnumber<41){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '26rem';
			document.querySelector(`#p${sharenum}`).style.width = '26rem';
			document.querySelector(`#p${sharenum}`).style.height = (parseInt(portnumber/2) + (portnumber%2)) *2.2 + 9.3 + 'rem';
		}else if(portnumber>40 && portnumber<61){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '39rem';
			document.querySelector(`#p${sharenum}`).style.width = '39rem';
			document.querySelector(`#p${sharenum}`).style.height = ((parseInt(portnumber/3) + Math.floor(Math.sqrt(portnumber%3)))*2.2) + 9.3 + 'rem';
		}else if(portnumber>60 && portnumber<81){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '52rem';
			document.querySelector(`#p${sharenum}`).style.width = '52rem';
			document.querySelector(`#p${sharenum}`).style.height = ((parseInt(portnumber/4) + Math.floor(Math.sqrt(portnumber%4)))*2.2) + 9.3 + 'rem';
		}else if(portnumber>80 && portnumber<101){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '65rem';
			document.querySelector(`#p${sharenum}`).style.width = '65rem';
			document.querySelector(`#p${sharenum}`).style.height = ((parseInt(portnumber/5) + Math.floor(Math.sqrt(Math.sqrt(portnumber%5))))*2.2) + 9.3 + 'rem';
		}else if(portnumber>100 && portnumber<121){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '78rem';
			document.querySelector(`#p${sharenum}`).style.width = '78rem';
			document.querySelector(`#p${sharenum}`).style.height = ((parseInt(portnumber/6) + Math.floor(Math.sqrt(Math.sqrt(portnumber%6))))*2.2) + 9.3 + 'rem';
		}else if(portnumber>120 && portnumber<129){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '91rem';
			document.querySelector(`#p${sharenum}`).style.width = '91rem';
			document.querySelector(`#p${sharenum}`).style.height = ((parseInt(portnumber/7) + Math.floor(Math.sqrt(Math.sqrt(portnumber%7))))*2.2) + 9.3 + 'rem';
		}
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='inline';
			document.querySelector(`#p${sharenum} .r`+i).style.display='inline';
		}
		self.value = '닫기'
	}else{
		document.querySelector(`#p${sharenum}`).style.height = `${port_height}rem`;
		if(portnumber>20){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '13rem';
			document.querySelector(`#p${sharenum}`).style.width = '13rem';
		}
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='none';
			document.querySelector(`#p${sharenum} .r`+i).style.display='none';
		}
		self.value = '펼쳐보기'
	}
}

function spread_CDF(self){
	var json = JSON.parse(self.dataset.id);
	var portnumber = parseInt(json.portnumber);
	var sharenum = parseInt(json.sharenum);
	var port_width = parseInt(json.port_width);

	var height_on = (Math.ceil(portnumber/32)*9.3) + 9.3 +'rem';
	var width_on = '102.88rem';
	if(self.value === '펼쳐보기'){
		self.value = '닫기'
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='inline';
			document.querySelector(`#p${sharenum} .r`+i).style.display='inline';
		}
		document.querySelector(`#p${sharenum} .portsinport`).className = 'portsinport_on';
		document.querySelector(`#p${sharenum}`).style.height = height_on;
		document.querySelector(`#p${sharenum}`).style.width = width_on;
		for(var i = 0;i<Math.ceil(portnumber/32);i++){
			document.querySelector(`#p${sharenum} .CDF_E1_32row`).className = 'CDF_E1_32row_on';
		}
	}else{
		self.value = '펼쳐보기'
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='none';
			document.querySelector(`#p${sharenum} .r`+i).style.display='none';
		}
		document.querySelector(`#p${sharenum} .portsinport_on`).className = 'portsinport';
		for(var i = 0;i<Math.ceil(portnumber/32);i++){
			document.querySelector(`#p${sharenum} .CDF_E1_32row_on`).className = 'CDF_E1_32row';
		}
		document.querySelector(`#p${sharenum} .portsinport`).style.width = `${port_width}rem`;
		document.querySelector(`#p${sharenum}`).style.width = `${port_width}rem`;
		document.querySelector(`#p${sharenum}`).style.height = '18.1rem';
	}
}

function node_tree_spread(self){
	if(self.value === '+'){
		self.value = '-';
		document.querySelector(`.under${self.id}`).style.display = 'block';
	}else{
		self.value = '+';
		document.querySelector(`.under${self.id}`).style.display = 'none';
	}
}


function getOffset( el ) {
   var rect = el.getBoundingClientRect();
	 var x = document.querySelector(".connecting_ports").getBoundingClientRect();

   return {
       left: rect.left + window.pageXOffset,
       top: rect.top + window.pageYOffset - x.top,
       width: rect.width,
       height: rect.height
   };
 }


function selecting(e){
	var id = e.target.id;
	if(id ==='nUm'){
		var targets = document.querySelectorAll('#target');
		if(targets.length != 0){
			for(var i in targets){
				targets[i].id = "nUm";
			}
		}
		var json = e.target.dataset.id;
		json = JSON.parse(json);
		var sharenum = json.sharenum;

		if(document.querySelectorAll(`#p${sharenum} #Sel`).length === 0){
			e.target.id = 'Sel';
		}else{
			document.querySelector(`#p${sharenum} #Sel`).id = "nUm";
			e.target.id = 'Sel';
		}
	}else if(id==='Sel' || id==='target'){
		var targets = document.querySelectorAll('#target');
		if(targets.length != 0){
			for(var i in targets){
				targets[i].id = "nUm";
			}
		}
		e.target.id = 'nUm'
	}
}

//포트 더블 클릭 했을 때 연결된 포트 파란색으로 바꾸어 주기(이 상태에서는 저장 불가)
function displaying_connects(e){
	var target = e.target
	//target은 반드시 하나만 선택될 수 있도록 제약을 걸 것.
	if(target.id==='nUm' || target.id==='Sel'){
		var Sels = document.querySelectorAll('#Sel');
		if(Sels.length != 0){
			for(var i in Sels){
				Sels[i].id = "nUm";
			}
		}
		var sharenum = JSON.parse(target.dataset.id).sharenum;
		var num = JSON.parse(target.dataset.id).num;
		var w_connect_data = JSON.parse(document.querySelector('.w_connect_data').value);
		var e_connect_data = JSON.parse(document.querySelector('.e_connect_data').value);
		//target을 유일하게 만\
		if(document.querySelectorAll(`#p${sharenum} #target`).length === 0){
			e.target.id = "target";
		}else{
			var targets = document.querySelectorAll('#target');
			for(var i in targets){
				targets[i].id = "nUm";
			}
			e.target.id = "target";
		}

		var west = document.querySelectorAll('.west_port #target');
		var east = document.querySelectorAll('.east_port #target');

		if(west.length === 1){
			var opp_ports = w_connect_data[num];
			if(opp_ports.length === 0){
				alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.');
				e.target.id = "nUm";
			}else{
				var k = 0;
				for(var i in opp_ports){
					if(opp_ports[i].sharenum === parseInt(document.querySelector('.east_port .port_sharenum').value)){
						document.querySelector(`.east_port .n${opp_ports[i].num}`).id = "target";
						k += 1;
					}
				}
				if(k === 0){
					alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.')
					e.target.id = "nUm";
				}
			}
		}else if(east.length ===1){
			var opp_ports = e_connect_data[num];
			if(opp_ports.length === 0){
				alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.');
				e.target.id = "nUm";
			}else{
				var k = 0;
				for(var i in opp_ports){
					if(opp_ports[i].sharenum === parseInt(document.querySelector('.west_port .port_sharenum').value)){
						document.querySelector(`.west_port .n${opp_ports[i].num}`).id = "target";
						k += 1;
					}
				}
				if(k === 0){
					alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.')
					e.target.id = "nUm";
				}
			}
		}
	}
		// if(judge_exist === 0){
		// 	alert('현재 필드 위에 선택하신 포트와 연결된 포트가 없습니다.')
		// 	target.id = 'nUm';
		// }
}

document.addEventListener('dblclick',displaying_connects)

document.addEventListener('click',selecting);

document.querySelector('.nodelist').style.display = 'none';
