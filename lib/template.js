var template ={
}

// 로그인 페이지를
template.login = function(CSS,js,jquery){
	return `	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>login</title>
		<style>
			${CSS}
		</style>
		<script>
		${js}
		${jquery}
		</script>

	</head>
	<body>
		<div class="loginbody">
			<div class="loginForm">
				<div class="title">Sign in to 선번장.com</div>
				<div class="row">
					ID : &nbsp<input id="user_id" type="text" placeholder="id 입력">
				</div>
				<div class="row">
					PW : &nbsp<input id="user_pw" type="password" placeholder="pw 입력">
				</div>
				<input type="button" class="submit" value="sign in" onclick="checkPW()">
			</div>
			<div class="advertise">
				에러 문의 : 兵1263期 정범석 010-8615-0607 (개발자)
			</div>
		</div>
	</body>
	</html>
	`
}

// 새로운 포트 만들기 폼
template.NEWPORTFORM = function(filelist,title,num){

	var oppoption = ''
	for(var i =0;i<filelist.length;i++){
		if(title===filelist[i]){
			continue;
		}
		oppoption = oppoption + `<option value="${filelist[i]}">${filelist[i]}</option>`;
	}

	return`
	<input type="button" class="createport" title="새 포트 생성" value="포트 생성" onclick="newportform()">

	<form action="/create_newport" class="newportform" method="post" onsubmit="return check_port_double()">
		<input type="hidden" name="thisnode" value="${title}">
		<h2>새 포트 생성</h2>
		<label>1.장비 종류
			<select name="port_type" class="port_type" onchange="CDF_TR_checkANDcore()">
				<option value="IDF">IDF</option>
				<option value="CDF_E1">CDF-E1</option>
				<option value="CDF">CDF</option>
				<option value="MDF">MDF</option>
				<option value="FDF">FDF</option>
				<option value="patch">패치판넬</option>
				<option value="hub">허브</option>
				<option value="switch">스위치</option>
				<option value="router">라우터</option>
				<option value="cypto">암호장비</option>
				<option value="csu">CSU</option>
				<option value="dsu">DSU</option>
				<option value="div">DIV</option>
				<option value="MSPP">MSPP</option>
			</select>
		</label>
		<div class="CDF_TR" style="display:none">
			<label>
				1번이 TX
				<input type="radio" class="TR" name="TR" value="TX">
			</label>
			<label>
				1번이 RX
				<input type="radio" class="TR" name="TR" value="RX">
			</label>
		</div>
		<label>
			2.케이블 종류
			<select name="cable_type" class="cable_type">
				<option value="coaxial">Coaxial</option>
				<option value="optical">Optical</option>
			</select>
		</label>
		<div class="port_or_core">
		<div class="normal_port">
		<label>
		3.포트 수
		<select name="port_number" class="port_number" onchange="selfInput()">
			<option value="25">25p</option>
			<option value="42">42p</option>
			<option value="50">50p</option>
			<option value="75">75p</option>
			<option value="100">100p</option>
			<option value="128">128p</option>
			<option value="others">직접입력</option>
		</select>
		</label>
		<input type="number" class="port_number_selfInput" placeholder="직접입력" name="port_number_selfInput" min="4" max="128" style="display: none">
		</div>
		</div>
		<label>
		4.반대편 노드 선택
		<select class="selected_oppnode" name="oppnode">
			${oppoption}
		</select>
		</label>
		<label class="port_name_part">
			5.이름 :
			<input type="text" name="port_name" class="newportname" placeholder="사용목적 또는 번호" required pattern="^[a-zA-Zㄱ-힣0-9_]{1,12}$">
		</label>
		<div style="color:red; font-size:0.8rem;">*12글자 이내, 특수문자&공백 제외</div>
		<div>
			<input type="button" class="newportquit" value="취소" onclick="newportquit()">
			<input type="submit" class="newportsubmit" value="생성">
		</div>
	</form>
	`
	}
//새로운 폴더 만들기 폼

template.NEWNODEFORM = function(nodelist){
	var upper_nodelist = [];
	for(var i in nodelist){
		var upper_node = nodelist[i].upper_node;
		upper_nodelist.push(upper_node);
	}
	var upper_html_list = `<option selected value=""></option>`
	for(var i in upper_nodelist){
		upper_html_list += `<option value="${upper_nodelist[i]}">${upper_nodelist[i]}</option>`
	}

	return `<form action="/create/newnode" class="newnodeform" onsubmit="return checking_node_double()" method="post">
		<h2>새 노드 생성</h2>
		<div class="row">상위 노드 선택 <select class="upper_node" name="upper_node">${upper_html_list}</select></div>
		<input type="text" class="newnodetext" name="newnodename" placeholder="생성할 노드 이름 입력" autofocus pattern="^[a-zA-Zㄱ-힣_]{1}[a-zA-Zㄱ-힣0-9_]{0,9}$">
		<div style="color:red; font-size:0.8rem; margin-top:0.3rem;">*10글자 이내, 특수문자&공백 제외, 숫자로 시작 안됨</div>
		<input type="button" value="취소" class="newnodequit" onclick="newnodequit()">
		<input type="submit" value="생성" class="newnodesubmit">
	</form>`
}

//메인화면 HTML
template.HTML = function(title,CSS,CDF_E1,MDF,FDF,JS,jquery,ajax,list,data,newportform,newnodeform,porttotal){
	var order_port_option;
	for(var i = 0;i<porttotal;i++){
		order_port_option += `<option value="${i}">${i}</option>`
	}

	return `
	<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
	<style>
		${CSS}
		${MDF}
		${CDF_E1}
		${FDF}
	</style>

	<script>
	${jquery}
	</script>

</head>
<body>
	<nav>
		<form action="/" method="post">
			<input type="submit" value="홈으로">
		</form>
		<form action="/connect_control" method="post">
			<input type="submit" value="연결관리">
		</form>
		<form action="/delete/node" class="deleteform" method="post" onsubmit="return check_delete_node()">
			<input type="hidden" class="nodename" name="nodename" value="${title}">
			<input type="submit" value="현재노드 삭제" title="현재 노드 삭제">
		</form>
		<input type="button" title="새 노드 생성" value="노드 생성" onclick="newnodeform()">
		<input type="button" value="노드리스트 닫기" onclick="close_nodelist(this)">
		<input type="button" value="포트 위치 이동" onclick="order_port('${title}')">
		<input type="button" class="portcontrol" value="포트관리" onclick="portcontrol(this)">
		${newportform}
		<input type="button" class="search_string_submit" value="검색" onclick="search()">
		<input type="text" class="search_string" placeholder="찾고 싶으신 포트의 용도나 비고를 입력한 후 검색을 누르세요.">
		<form method="get" class="logOut" action="/login">
			<input type="submit" value="로그아웃">
		</form>
	</nav>
<h1>
	${title}
	<input type="hidden" class="hidden_title" value="${title}">
</h1>
	<div class="homebody">
		${newnodeform}
		${list}

		<form class="order_port_form" id="order_port_off" action="/order/port" method="post">
			<span class="title">포트 위치 이동</span>
			<div class="row">
				<span>기존 포트 위치 :</span>
				<select name="before">
					<option selected value=""></option>
					${order_port_option}
				</select>
			</div>
			<input type="hidden" name="nodename" value="${title}">
			<div class="row">
				<span>이동할 포트 위치 :</span>
				<select name="after">
					<option selected value=""></option>
					${order_port_option}
				</select>
			</div>
			<div class="row">
				<input type="button" value="취소" onclick="order_port_quit()">
				<input type="submit" value="이동">
			</div>
		</form>
		<div class="searched">
		</div>

		<div class="ports">
		${data}
		</div>
		<div class="allconnect">
		</div>
	</div>

	<script>
		${JS}
		${ajax}
	</script>
</body>
</html>
	`;
}

//홈 화면 HTML
template.HOME_HTML = function(CSS,JS,jquery,ajax,filelist,newnodeform,list){

	return `
	<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>HOME</title>
	<style>
		${CSS}
	</style>
	<script>
	${jquery}
	</script>

</head>
<body>
	<h1>
	선번장.com
	</h1>
	<nav>
	<input type="button" title="새 노드 생성" value="노드 생성" onclick="newnodeform()">
		<form action="/connect_control" method="post">
			<input type="submit" value="연결관리">
		</form>
		<form method="get" class="logOut" action="/login">
			<input type="submit" value="로그아웃">
		</form>
	</nav>
	<h2>
		 노드 목록
		${newnodeform}
	</h2>
	${list}
	<script>
		${JS}
		${ajax}
	</script>
</body>
</html>
	`;
}

//노드리스트 화면에 들어가는 HTML
template.List = function(nodelist){

	var list = '<div class="nodelist">';
	var i = 0;
	for(var i in nodelist){
		var upper_node = nodelist[i].upper_node;

		list = list + `<div class="row">
		<input type="button" class="tree_form" id="${upper_node}" title="하위 노드 보기" value="-" onclick="node_tree_spread(this)">
		<a title="${upper_node}로 이동" href="/?id=${upper_node}">${upper_node}</a>
		</div>`;
		list += `<div class="under${upper_node}">`;
		for(var j in nodelist[i].under_node){
			list += `<div class="row">┕
			<a title="${nodelist[i].under_node[j]}로 이동" href="/?id=${nodelist[i].under_node[j]}">${nodelist[i].under_node[j]}</a>
			</div>`;
		}
		list += `</div>`
	}
	list = list + '</div>';
	return list;
}

template.Orderport = function(){
	return
`<div class="order_port_form">
	<span>포트 위치 이동</span>
	<div class="row">
		<span>기존 포트 위치 :</span>
		<select>
			<option selected value=""></option>
		</select>
	</div>
	<div class="row">
		<span>이동할 포트 위치 :</span>
		<select>
			<option selected value=""></option>
		</select>
	</div>
</div>`
}

//연결관리
template.connect_control = function(CSS,CDF_E1,MDF,FDF,JS,jquery,ajax,filelist,nodelist){
	var center_this = `<option selected value=""></option>`
	for(var i = 0;i<filelist.length;i++){
		center_this += `<option value="${filelist[i]}">${filelist[i]}</option>`
	}
	return`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>연결관리</title>
	<style>
		${CSS}
		${CDF_E1}
		${MDF}
		${FDF}
	</style>

	<script>
	${jquery}
	</script>
</head>
<body>
	<nav class="numb">
		<form action="/" method="post">
			<input type="submit" value="홈으로">
		</form>
		<input type="button" class="connecting" value="연결">
		<input type="button" class="disconnecting" value="연결해제">
		<input type="button" class="button" value="연결선 보기" onclick="showlines(this)">
		<input type="button" value="노드리스트 보기" onclick="close_nodelist(this)">
		<input type="hidden" class="w_connect_data" value="{}">
		<input type="hidden" class="e_connect_data" value="{}">
	</nav>
<div id = "header_info">
	<div class="west">
		<label class="West_opp">
			P1
			<select class="opps" id="west_opp">
				<option selected value=""></option>
			</select>
		</label>
		<label class="West_name">
			이름
			<select class="names" id="west_name">
				<option selected value=""></option>
			</select>
		</label>
	</div>
	<div class="center">
		<label class="Center_this">
			현재 노드
				<select class="center_this">
					${center_this}
				</select>
		</label>
	</div>
	<div class="east">
		<label class="East_opp">
			P2
			<select class="opps" id="east_opp">
				<option selected value=""></option>
			</select>
		</label>
		<label class="East_name">
			이름
			<select class="names" id="east_name">
				<option selected value=""></option>
			</select>
		</label>
	</div>
</div>

<div class="connecting_ports">
${nodelist}
	<div class="west_port">

	</div>
	<div class="east_port">

	</div>
</div>

	<script>
		${JS}
		${ajax}
	</script>
</body>
</html>
	`
}

template.access_denied = function(url){
	if(url === undefined){
		var url = "/"
	}
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta http-equiv="refresh" charset="utf8" content="3;url=${url}"></meta>
		Access Denied<br>
		권한이 없는 계정입니다.
	</head>
	</html>`
}

module.exports = template;
