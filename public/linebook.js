function spread_MDF(self){
	var json = JSON.parse(self.dataset.id);
	var portnumber = parseInt(json.portnumber);
	var sharenum = parseInt(json.sharenum);
	var port_height = Number(json.port_height);

	if(self.value === '펼쳐보기'){
		if(portnumber<21){
			document.querySelector(`#p${sharenum}`).style.height = (portnumber*2.2 +9.3) +`rem`;
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
	var portnumber = Number(json.portnumber);
	var sharenum = Number(json.sharenum);
	var port_width = Number(json.port_width);

	var height_on = (Math.ceil(portnumber/32)*9.3) + 9.3 +'rem';
	if(portnumber >= 32){
		var width_on = '102.88rem';
	}else if(portnumber <32 && portnumber >4){
		var width_on = 12.49297 * (Math.ceil(portnumber/4)) + 'rem';
	}else{
		var width_on = '13rem';
	}
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

function spread_FDF(self){
	var json = JSON.parse(self.dataset.id);
	var portnumber = parseInt(json.portnumber);
	var sharenum = parseInt(json.sharenum);
	var port_width = Number(json.port_width);

	if(self.value === '펼쳐보기'){
		if(portnumber<2){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '13rem';
		}else if(portnumber>2 && portnumber <5){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = (12.9 * portnumber) + 'rem';
			document.querySelector(`#p${sharenum}`).style.width = (12.9 * portnumber) + 'rem';
		}else if(portnumber>4){
			console.log('hi')
			document.querySelector(`#p${sharenum} .portsinport`).style.width = '51.6rem';
			document.querySelector(`#p${sharenum}`).style.width = '51.6rem';
			document.querySelector(`#p${sharenum} .portsinport`).style.height = 2.2 * Math.ceil(portnumber/4) + 'rem';
			document.querySelector(`#p${sharenum}`).style.height = 2.2 * Math.ceil(portnumber/4) + 9.3 +'rem';
		}
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='inline';
			document.querySelector(`#p${sharenum} .r`+i).style.display='inline';
		}
		self.value = '닫기'
	}else{
		if(portnumber<2){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = port_width + 'rem';
		}else if(portnumber>2 && portnumber <5){
			document.querySelector(`#p${sharenum} .portsinport`).style.width = port_width + 'rem';
			document.querySelector(`#p${sharenum}`).style.width = port_width + 'rem';
		}else if(portnumber>4){
			console.log('hi')
			document.querySelector(`#p${sharenum} .portsinport`).style.width = port_width + 'rem';
			document.querySelector(`#p${sharenum}`).style.width = port_width + 'rem';
			document.querySelector(`#p${sharenum} .portsinport`).style.height = 2.2 * Math.ceil(portnumber/12) + 'rem';
			document.querySelector(`#p${sharenum}`).style.height = 2.2 * Math.ceil(portnumber/12) + 9.3 +'rem';
		}
		for(var i = 1;i<=portnumber;i++){
			document.querySelector(`#p${sharenum} .u`+i).style.display='none';
			document.querySelector(`#p${sharenum} .r`+i).style.display='none';
		}
		self.value = '펼쳐보기'
	}
}

function close_nodelist(self){
	if(self.value === "노드리스트 닫기"){
		document.querySelector('.nodelist').style.display = 'none';
		self.value = "노드리스트 보기";
	}else{
		document.querySelector('.nodelist').style.display = 'flex';
		self.value = "노드리스트 닫기";
	}
}

function searching_in_node(){
	var search_str = document.querySelector('.search_string').value;
	//현재 페이지에있는 sharenum과 그에 따른 port_number을 구한다.
	var share_num_t = document.querySelectorAll('.port_sharenum');
	var search_result = '<검색 결과>';
	var total = 0;
	for(var i =0;i<share_num_t.length;i++){
		var sharenum = share_num_t[i].value;
		var port_number = Number(document.querySelector(`#p${sharenum} .port_number`).value);
		var oppnode = document.querySelector(`#p${sharenum} .Oppnode`).value;
		var port_id = document.querySelector(`#p${sharenum} .port_Name`).value;
		for(var j = 1;j<=port_number;j++){
			var usage = document.querySelector(`#p${sharenum} .u${j}`).value;
			var refer = document.querySelector(`#p${sharenum} .r${j}`).value;
			if(usage.indexOf(search_str)!=-1 || refer.indexOf(search_str)!=-1){
				search_result += `
${oppnode}로 가는 ${port_id}포트의 ${j}번 단자 (용도 : ${usage} / 비고 : ${refer})`
				total += 1;
			}
		}

	}
	if(search_result === '<검색 결과>' ){
		search_result += `
검색 결과 일치하는 항목 : 0 건
현재 노드에는 일치하는 항목이 없습니다.`
	}else{
		var split = search_result.split('\n');
		split.splice(1,0,`총 ${total}건의 검색 결과가 있습니다.`);
		var search_result = split.join('\n');
	}
	confirm(search_result)
}

//불량 포트 설정 AJAX
function setting_disable(self){
	var sharenum = self.id;
	//select의 값으로 실제포트의 클래스를 만들어 백그라운드를 붉은색으로 만들고 아이디를 disabled_port로 만든다.
	//사용중인 포트는 alert
	var num = document.querySelector(`#p${sharenum} .set_disable_select`).value;
	var classnum = 'n' + document.querySelector(`#p${sharenum} .set_disable_select`).value;
	if(document.querySelector(`#p${sharenum} .${classnum}`).style.background === 'green' || document.querySelector(`#p${sharenum} .${classnum}`).style.background === 'orange'){
		alert('사용중인 포트는 불량포트로 지정할 수 없습니다.')
	}else if(document.querySelector(`#p${sharenum} .${classnum}`).style.background === 'red'){
		alert('이미 불량포트로 지정된 포트입니다.')
	}else{
		document.querySelector(`#p${sharenum} .${classnum}`).style.background = 'red';
		document.querySelector(`#p${sharenum} .${classnum}`).id = 'disabled_port';
		//disabled된 포트를 set select에서는 뺴고 remove에 추가한다.
		document.querySelector(`#p${sharenum} .diset${num}`).style.display = 'none';
		document.querySelector(`#p${sharenum} .disrem${num}`).style.display = 'inline';
		//display에 추가
		document.querySelector(`#p${sharenum} #Disable`).innerText = Number(document.querySelector(`#p${sharenum} #Disable`).innerText)+1;

		document.querySelector(`#p${sharenum} #capable`).innerText = Number(document.querySelector(`#p${sharenum} #capable`).innerText)-1;
	}
}
//불량포트 해제 AJAX
function removing_disable(self){
	var sharenum = self.id;
	//select의 값으로 실제포트의 클래스를 만들어 백그라운드를 없애고 아이디를 nUm으로 되돌린다.
	var num = document.querySelector(`#p${sharenum} .remove_disable_select`).value;
	var classnum = 'n' + document.querySelector(`#p${sharenum} .remove_disable_select`).value;
	console.log(document.querySelector(`#p${sharenum} .remove_disable_select`).value)
	if(document.querySelector(`#p${sharenum} .${classnum}`).style.background === ""){
		alert('이미 불량포트 해제가 완료된 포트입니다.')
	}else if(document.querySelector(`#p${sharenum} .remove_disable_select`).value != ""){
		document.querySelector(`#p${sharenum} .${classnum}`).removeAttribute("style");
		document.querySelector(`#p${sharenum} .${classnum}`).id = 'nUm';
		//disabled에서 해제된 포트를 remove select에서는 뺴고 set에 추가한다.
		document.querySelector(`#p${sharenum} .diset${num}`).style.display = 'inline';
		document.querySelector(`#p${sharenum} .disrem${num}`).style.display = 'none';
		//display에서 빼기
		document.querySelector(`#p${sharenum} #Disable`).innerText = Number(document.querySelector(`#p${sharenum} #Disable`).innerText)-1;
		document.querySelector(`#p${sharenum} #capable`).innerText = Number(document.querySelector(`#p${sharenum} #capable`).innerText)+1;
	}
}

//새 포트 생성 폼에서 직접입력시 숫자 입력창 표시
function selfInput(){
	if(document.querySelector('.newportform .port_number').value==="others"){
		document.querySelector('.port_number_selfInput').style.display="block"
	}else{
		document.querySelector('.port_number_selfInput').style.display="none"
	}
}

// 새 포트 생성 폼에서 CDF-E1 선택시 TX/RX 선택창 표시
function CDF_TR_check(){
	console.log(document.querySelector('.port_type').value)
	if(document.querySelector('.port_type').value==="CDF_E1"){
		document.querySelector('.CDF_TR').style.display="block";
	}else{
		document.querySelector('.CDF_TR').style.display="none";
	}
}

//새 노드 생성 폼 나타났다 사라지기
function newnodeform(){
	document.querySelector(".newnodeform").style.display = "flex";
}

function newnodequit(){
	document.querySelector(".newnodeform").style.display = "none";
}

//새 포트 생성 폼 나타났다 사라지기
function newportform(){
	document.querySelector(".newportform").style.display = "flex";
}

function newportquit(){
	document.querySelector(".newportform").style.display = "none";
}

//allconnect 닫기
function closeAllconnect(){
	document.querySelector('#allconOn').remove();
}

//searched 닫기
function search_quit(){
	document.querySelector('.searched_result_form').remove();
}

//포트 삭제 버튼 불량설정/해제 버튼 활성화
function portcontrol(self){
	var number = document.querySelectorAll('.deleteport').length;
	if(self.value === '포트관리'){
		for(var i =0;i<number;i++){
			document.querySelector('#deleteport_none').style.display = 'inline';
			document.querySelector('#deleteport_none').id = 'deleteport_inline';
			document.querySelector('#disable_party_none').style.display = 'block';
			document.querySelector('#disable_party_none').id = 'disable_party_block';
		}
		self.value = '포트관리 닫기'
	}else{
		for(var i =0;i<number;i++){
			document.querySelector('#deleteport_inline').style.display = 'none';
			document.querySelector('#deleteport_inline').id = 'deleteport_none';
			document.querySelector('#disable_party_block').style.display = 'none';
			document.querySelector('#disable_party_block').id = 'disable_party_none';
		}
		self.value = '포트관리'
	}
}

//orderport 취소
function order_port_quit(){
	document.querySelector('#order_port_on').id = 'order_port_off';
}

function order_port(){
	document.querySelector('#order_port_off').id = 'order_port_on';
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













//
