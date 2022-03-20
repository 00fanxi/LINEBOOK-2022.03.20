var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie');

var template = require('./lib/template.js');
var dbshow = require('./lib/dbshow.js');

//몽고디비 모듈 사용
var MongoClient =require('mongodb').MongoClient;

var db;
var counterdb;
MongoClient.connect('mongodb://localhost:27017/local', function(err,client){
	if(err) {return console.log(err)}
		console.log('conncected with DB')
		db = client.db('connectdata');
		counterdb = client.db('counter');
});

var app = http.createServer(function(request,response){
	var _url = request.url;
	var queryData = url.parse(_url,true).query;
	var pathname = url.parse(_url,true).pathname;

	function checkCookieBoth(){
		if(request.headers.cookie != undefined){
			var cookies = cookie.parse(request.headers.cookie);
			if(cookies.bG9naW5fc3VjY2Vzcw != "==Q2h1bmdCZW9tU2VvazEyNjNDb21wbGV0ZWRUaGlzUHJvamVjdEF0" && cookies.bG9naW5fc3VjY2Vzcw != "==VHdvVGhvdXNhbmRUd293ZW50eVR3b01hcmNoRWlnaHRlZW4="){
				response.writeHead(302,{Location:encodeURI(`/login`)});
				response.end();
			}
		}else{
			response.writeHead(302,{Location:encodeURI(`/login`)});
			response.end();
		}
	}

	function checkCookieAdmin(){
		if(request.headers.cookie != undefined){
			var cookies = cookie.parse(request.headers.cookie);
			if(cookies.bG9naW5fc3VjY2Vzcw != "==Q2h1bmdCZW9tU2VvazEyNjNDb21wbGV0ZWRUaGlzUHJvamVjdEF0"){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	}

	if(pathname === '/'){
		checkCookieBoth();
			db.listCollections().toArray(function(err,collections){
					var nodenames = [];
					for(var i in collections){
						nodenames.push(collections[i].name);
					}
				counterdb.collection('node_tree').find({}).toArray(function(err,nodelist){
					if(queryData.id === undefined || nodenames.indexOf(queryData.id) === -1){
						fs.readFile(`./HOME/HOME.css`,'utf8',function(err,CSS){
							fs.readFile(`./public/linebook.js`,'utf8',function(err,JS){
								fs.readFile(`./public/linebook_ajax.js`,'utf8',function(err,ajax){
									fs.readFile(`.public/jquery-3.6.0.min.js`,'utf8',function(err,jquery){
										var newnodeform = template.NEWNODEFORM(nodelist);
										var list = template.List(nodelist)
										var HTML = template.HOME_HTML(CSS,JS,jquery,ajax,nodelist,newnodeform,list);
										response.writeHead(200);
										response.end(HTML);
									});
								});
							});
						});
					}else{
						fs.readFile(`./public/linebook.css`,'utf8',function(err,CSS){
								fs.readFile(`./ports_css/CDF_E1.css`,'utf8',function(err,CDF_E1){
									fs.readFile(`./ports_css/MDF.css`,'utf8',function(err,MDF){
										fs.readFile(`./ports_css/FDF.css`,'utf8',function(err,FDF){
											fs.readFile(`./public/linebook.js`,'utf8',function(err,JS){
												fs.readFile(`./public/jquery-3.6.0.min.js`,'utf8',function(err,jquery){
													fs.readFile(`./public/linebook_ajax.js`,'utf8',function(err,ajax){
														var title = queryData.id;
														var list = template.List(nodelist);
														var newportform = template.NEWPORTFORM(nodenames,title);
														var newnodeform = template.NEWNODEFORM(nodelist);

														db.collection(title).find({_id : {$ne : 'portorder'}}).toArray(function(err,result){
															var porttotal = result.length;

															var opp_usingport;
															var opp_bridgeport;
															var opp_disableport;
															var opp_json ={};

															var data_order=[];//result를 portorder에 맞춰서 재배열

															function getOpps(data_order, callback){
																var got = 0;
																for(var i in data_order){
																	oppnodename = data_order[i].oppnodename;
																	oppsharenum = data_order[i].sharenum;
																	db.collection(oppnodename).find({sharenum : oppsharenum}).toArray(function(err,result2){

																		opp_usingport = result2[0].usingport;
																		opp_bridgeport = result2[0].bridgeport;
																		opp_disableport = result2[0].disableport;
																		var j;
																		for(var l in opp_bridgeport){
																			j = opp_usingport.indexOf(opp_bridgeport[l]);
																			opp_usingport.splice(j,1);
																		}
																		opp_json[result2[0].sharenum] = [opp_usingport,opp_bridgeport,opp_disableport];
																		//여기를 단순 배열이 아닌 object로 넘겨서 찾게하면 되지 않을까
																		if(++got === data_order.length){

																			callback();
																		}
																	});
																}
															}
															function callback(){
																var ports = dbshow.showport(opp_json,porttotal,data_order);
																var HTML = template.HTML(title,CSS,CDF_E1,MDF,FDF,JS,jquery,ajax,list,ports,newportform,newnodeform,porttotal);
																response.writeHead(200);
																response.end(HTML);
															}

														if(result.length === 0){
															var HTML = template.HTML(title,CSS,CDF_E1,MDF,FDF,JS,jquery,ajax,list,"",newportform,newnodeform,"");
															response.writeHead(200);
															response.end(HTML);
														}else{
															db.collection(title).find({_id : 'portorder'}).toArray(function(err,order){
																order = order[0].portorder;
																for(var k in order){
																	var index = order.indexOf(result[k]._id);
																	data_order.splice(index,0,result[k]);
																}
																getOpps(data_order,callback);
															});
														}
													});
												});
											});
										});
									});
								});
							});
						});
					}
				});
			});
	}else if(pathname==='/check/nodename'){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var newnodename = post.newnodename;
				db.listCollections().toArray(function(err,collections){
					var nodenames = [];
					for(var i in collections){
						nodenames.push(collections[i].name);
					}
					if(nodenames.indexOf(newnodename) === -1){
						var result = "true";
					}else{
						var result = "false";
					}
					response.writeHead(200)
					response.end(result);
				});
			});
		}else{
			response.writeHead(200)
			response.end('access_denied');
		}
	}else if(pathname==='/check/portname'){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var newportname = `_${post.newportname}`;
				var nodename = post.nodename;
				var oppnodename = post.oppnodename;

				db.collection(nodename).find({oppnodename : oppnodename, portname : newportname}).toArray(function(err,result){
					if(result.length != 0){
						var result = "false";
					}else{
						var result = "true";
					}
					response.writeHead(200)
					response.end(result);
				});
			});
		}else{
			var result = ('access_denied');
			response.writeHead(200)
			response.end(result);
		}
	}else if(pathname==='/check/deletenode'){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var nodename = post.nodename;
				counterdb.collection('node_tree').find({_id : nodename}).toArray(function(err,result2){
					db.collection(nodename).find({_id : {$ne : 'portorder'}}).toArray(function(err,result){
						if(result.length != 0){
							var result = "false";
						// 해당 노드가 상위 노드인데 하위노드가 존재한다면
						}else if(result.length === 0 && result2.length != 0 && result2[0].under_node.length !=0){
							var result = "false";
						}else{
							var result = "true";
						}
						response.writeHead(200)
						response.end(result);
					});
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==='/check/deleteport'){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var nodename = post.nodename;
				var sharenum = parseInt(post.sharenum);

				db.collection(nodename).find({sharenum : sharenum}).toArray(function(err,result){
					if(result[0].usingport.length != 0){
						var torf = "false";
						response.writeHead(200)
						response.end(torf);
					}else{
						db.collection(result[0].oppnodename).find({sharenum : sharenum}).toArray(function(err,result){
							if(result[0].usingport.length != 0){
								var torf = "false";
								response.writeHead(200)
								response.end(torf);
							}else{
								var torf = "true";
								response.writeHead(200)
								response.end(torf);
							}
						})
					}
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==='/create/newnode'){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var title = post.newnodename;
				var upper_node = post.upper_node;
				//디비에 해당 노드 이름의 콜렉션 생성, portorder에 등록, node_tree에 등록.
				db.createCollection(title,function(err,collection){
					db.collection(title).insertOne({_id : 'portorder', portorder : []},function(err,result){
						if(upper_node === ""){
							counterdb.collection('node_tree').insertOne({_id : title , upper_node : title, under_node : []},function(err,result){
								response.writeHead(302, {Location:encodeURI(`/?id=${title}`)})
								response.end();
							});
						}else{
							counterdb.collection('node_tree').updateOne({_id : upper_node},{$push : {under_node : title}},function(err,result){
								response.writeHead(302, {Location:encodeURI(`/?id=${title}`)})
								response.end();
							});
						}
					});
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/create_newport"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var thisnode = post.thisnode;
				var port_name = `_${post.port_name}`;
				var thisnode = post.thisnode;
				var oppnode = post.oppnode;
				var cable_type = post.cable_type;
				var port_type = post.port_type;
				var port_number = post.port_number;
				var port_number_selfInput = post.port_number_selfInput;
				var tr = post.TR;
				var opp_tr;
				var sharenum;
				var plus_port = "";
				var this_id;
				var opp_id;
				var latestupdate = Date();

				//포트 넘버 처리
				if(port_number==='others'){
					port_number = port_number_selfInput;
				}
				port_number = Number(port_number);

				//TX,RX 처리
				if(tr === "TX"){
					opp_tr = "RX";
				}else if(tr === "RX"){
					opp_tr = "TX";
				}else{
					opp_tr = "";
					tr = ""
				}

				//rx,tx 비고에 넣기
				function putrtx(port_type,reference,tr){
					var rtx;
					for(var i = 1;i<=port_number;i++){
						if(tr != ""){
							if(tr === 'TX'){
								if(i%2 != 0 && (i-1)%4 === 0){
									rtx = "TX";
								}else if(i%2 != 0 && (i-1)%4 != 0){
									rtx = "RX";
								}else{
									rtx = "";
								}
							}else{
								if(i%2 != 0 && (i-1)%4 === 0){
									rtx = "RX";
								}else if(i%2 != 0 && (i-1)%4 != 0){
									rtx = "TX";
								}else{
									rtx = "";
								}
							}
						}else{
							rtx = "";
						}
						reference[i] = rtx;
					}
					return reference;
				}

				//avaliable port,reference, usage, connectstat처리
				var available = [];
				var this_reference = {};
				var opp_reference = {};
				var usage = {};
				var connectstat = {};

					putrtx(port_type,this_reference,tr);
					putrtx(port_type,opp_reference,opp_tr);

				for(var i = 1;i<=port_number;i++){
					available.push(i);
					usage[i] = "";
					connectstat[i] = [];
				}

				//_id 및 sharenum 처리
				counterdb.collection('id_counter').findOne({_id : 'id_counter'},function(err,id_result){
					counterdb.collection('sharenum_counter').findOne({_id : 'sharenum_counter'},function(err,sharenum_result){
					//DB에 해당 포트 정보 생성, id_counter에 새로운 id 나가고, sharenum_counter에도 새로운 sharenum 나가고.
							this_id = id_result.id_counter;
							opp_id = this_id + 1;
							sharenum = sharenum_result.sharenum_counter;

							db.collection(thisnode).insertOne({
								_id : this_id,
								sharenum : sharenum,
								portname : port_name,
								nodename : thisnode,
								oppnodename : oppnode,
								portnumber : port_number,
								porttype: port_type,
								cabletype : cable_type,
								usingport : [],
								bridgeport : [],
								disableport : [],
								availableport : available,
								reference : this_reference,
								usage : usage,
								connectstat : connectstat,
								latestupdate : latestupdate
							},function(err,result){
								if(err) return console.log(err);
							});

							db.collection(thisnode).updateOne({_id : 'portorder'},{$push : {portorder : this_id}},function(err,result){
							});

							db.collection(oppnode).insertOne({
								_id : opp_id,
								sharenum : sharenum,
								portname : port_name,
								nodename : oppnode,
								oppnodename : thisnode,
								portnumber : port_number,
								porttype: port_type,
								cabletype : cable_type,
								usingport : [],
								bridgeport : [],
								disableport : [],
								availableport : available,
								reference : opp_reference,
								usage : usage,
								connectstat : connectstat,
								latestupdate : latestupdate
							},function(err,result){
								if(err) return console.log(err);
							});

							db.collection(oppnode).updateOne({_id : 'portorder'},{$push : {portorder : opp_id}},function(err,result){
							});

						counterdb.collection('id_counter').updateOne({_id : 'id_counter'},{$inc : {id_counter : 2}},function(err,result){
						});
						counterdb.collection('sharenum_counter').updateOne({_id : 'sharenum_counter'},{$inc : {sharenum_counter : 1}},function(err,result){
						});
					});
				});

				response.writeHead(302,{location :encodeURI(`/?id=${thisnode}`)});
				response.end();
		});
		}else{
			var result = ('access_denied');
			response.writeHead(200)
			response.end(result);
		}
	}else if(pathname==="/save/refer"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var put = qs.parse(body);
				var nodename = put.nodename;
				var _id = parseInt(put._id);
				var num = parseInt(put.num);
				var content = put.content;
				var refnum = `reference.${num}`;

				db.collection(nodename).updateOne({_id : _id},{$set : {[refnum] : content}}, function(err,result){
				});
				response.writeHead(200);
				response.end();
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/save/usage"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var put = qs.parse(body);
				var nodename = put.nodename;
				var _id = parseInt(put._id);
				var num = parseInt(put.num);
				var content = put.content;
				var usagenum = `usage.${num}`;

				db.collection(nodename).updateOne({_id : _id},{$set : {[usagenum] : content}}, function(err,result){
				});
				response.writeHead(200);
				response.end();
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/save/disable"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var put = qs.parse(body);
				var nodename = put.nodename;
				var _id = parseInt(put._id);
				var num = parseInt(put.num);
				//ajax로 받은 값이 available에 있을 경우에만 실행
				db.collection(nodename).findOne({_id : _id}, function(err,result){
					if(result.availableport.indexOf(num) != -1){
						db.collection(nodename).updateOne({_id : _id},{$push : {disableport : num}}, function(err,result){
						});
						db.collection(nodename).updateOne({_id : _id},{$pull : {availableport : num}},function(err,result){
						});
						response.writeHead(200);
						response.end();
					};
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/save/available"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var put = qs.parse(body);
				var nodename = put.nodename;
				var _id = parseInt(put._id);
				var num = parseInt(put.num);
				//ajax로 받은 값이 disable에 있을 경우에만 실행

				db.collection(nodename).findOne({_id : _id}, function(err,result){
					if(result.disableport.indexOf(num) != -1){
						db.collection(nodename).updateOne({_id : _id},{$push : {availableport : num}}, function(err,result){
						});
						db.collection(nodename).updateOne({_id : _id},{$pull : {disableport : num}},function(err,result){
						});
						response.writeHead(200);
						response.end();
					};
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/delete/node"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var nodename = post.nodename;
				//DB의 해당 노드 컬렉션 삭제
				//node_tree에서 삭제(상위의 경우 이미 하위가 없다는걸 통과했기때문에 doc 자체 삭제, 하위의 경우 under_node에서 해당 노드만 splice)
				db.collection(nodename).drop(function(err,delok){
					counterdb.collection('node_tree').find({_id : nodename}).toArray(function(err,result2){
						if(result2.length != 0){
							counterdb.collection('node_tree').deleteOne({_id : nodename},function(err,delok){
								response.writeHead(302, {Location:`/`});
								response.end();
							});
						}else{
							counterdb.collection('node_tree').updateOne({under_node : {$in : [nodename]}},{$pull : {under_node : nodename}},function(err,result3){
								response.writeHead(302, {Location:`/`});
								response.end();
							});
						}
					})
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/delete/port"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var thisnode = post.thisnode;
				var oppnode = post.oppnode;
				var sharenum = post.sharenum;
				var _id = Number(post._id);
				numin = Number(sharenum);
				//db에서 해당 DOC삭제
				db.collection(thisnode).deleteOne({sharenum : numin},function(err,result){
					if(err) throw err;
					db.collection(thisnode).updateOne({_id : 'portorder'},{$pull : {portorder : _id}},function(err,result){
						db.collection(oppnode).find({sharenum : numin}).toArray(function(err,result2){
							var opp_id = result2[0]._id;
							db.collection(oppnode).updateOne({_id : 'portorder'},{$pull : {portorder : opp_id}},function(err,result){
								db.collection(oppnode).deleteOne({sharenum : numin},function(err,result){
									if(err) throw err;
									response.writeHead(302,{Location:encodeURI(`/?id=${thisnode}`)});
									response.end();
								});
							});
						})
					});
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect/thisnode"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var thisnode = post.nodename;
				// collection 이름에는 empty가 들어갈 수 없다.
				if(thisnode != ""){
					var oppnodelist = [];
					db.collection(thisnode).find({_id : {$ne : 'portorder'}}).toArray(function(err,result){
						for(var i = 0;i<result.length;i++){
							if(oppnodelist.indexOf(result[i].oppnodename) === -1){
								oppnodelist.push(result[i].oppnodename);
							}
						};
						var json = {oppnodelist : oppnodelist};
						json = JSON.stringify(json);

						response.writeHead(200);
						response.end(json);
					});
				}
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect/oppnode"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var thisnode = post.nodename;
				var oppnode = post.oppnodename;
				var which_side = post.which_side;

				if(oppnode != ""){
					db.collection(thisnode).find({oppnodename : oppnode}).toArray(function(err,result){
						var portnamelist = [];
						for(var i in result){
							portnamelist.push(result[i].portname);
						};

						if(portnamelist != []){
							var json = {portnamelist : portnamelist};
							json = JSON.stringify(json);

							response.writeHead(200);
							response.end(json);
						}
					})
				}else{
					var json = {portnamelist : []};
					json = JSON.stringify(json);

					response.writeHead(200);
					response.end(json);
				}
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect/portname"){
		if(checkCookieAdmin()){

			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var thisnode = post.nodename;
				var oppnode = post.oppnodename;
				var portname = post.portname;

				if(portname != ""){
					db.collection(thisnode).find({oppnodename : oppnode, portname : portname}).toArray(function(err,result){
						// 반대 포트 연결상태 확인후 using,available,disable 추출
						var p = result[0];
						var connect_data = p.connectstat;
						db.collection(p.oppnodename).find({sharenum : p.sharenum}).toArray(function(err,result){

					    var opp_usingport = result[0].usingport;
					    var opp_bridgeport = result[0].bridgeport;
					    var opp_disableport = result[0].disableport;
					    var j;
					    for(var i in opp_bridgeport){
					      j = opp_usingport.indexOf(opp_bridgeport[i]);
					      opp_usingport.splice(j,1);
					    }
							var port = dbshow.showportOne(opp_usingport,opp_bridgeport,opp_disableport,p);

							var data_json = {port : port, connect_data : connect_data};
							data_json = JSON.stringify(data_json);
							response.writeHead(200);
							response.end(data_json);
						});
					});
				}else{
					var data_json = `{"port" : "", "connect_data" : ""}`;
					response.writeHead(200);
					response.end(port);
				}
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect/connecting"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var west_json = JSON.parse(post.west_json);
				var east_json = JSON.parse(post.east_json);

				var w_sharenum = west_json.sharenum;
				var w_num = west_json.num;
				var e_sharenum = east_json.sharenum;
				var e_num = east_json.num;
				var nodename = west_json.nodename;

				db.collection(nodename).find({sharenum : w_sharenum}).toArray(function(err,result){
					var connectstat = result[0].connectstat;
					connectstat[w_num].push(east_json);
					var w_connect_data = connectstat;
					//새로 연결된 포트가 usingport에 있고 bridgeport에는 없으면 bridgeport에 해당 포트를 추가하고, 아무데도 없으면 usingport에만 추가.
					//둘다 있으면 connectstat에만 추가
					if(result[0].usingport.indexOf(w_num) != -1 && result[0].bridgeport.indexOf(w_num) === -1){
						db.collection(nodename).updateOne({sharenum : w_sharenum},{$push : {bridgeport : w_num}}, function(err,result){
						});
					}else if(result[0].usingport.indexOf(w_num) === -1){
						db.collection(nodename).updateOne({sharenum : w_sharenum},{$push : {usingport : w_num}}, function(err,result){
						});
						db.collection(nodename).updateOne({sharenum : w_sharenum},{$pull : {availableport : w_num}}, function(err,result){
						});
					}

					var connectstat_num = `connectstat.${w_num}`;
					db.collection(nodename).updateOne({sharenum : w_sharenum},{$set : {[connectstat_num] : connectstat[w_num]}},function(err,result){
					});

					db.collection(nodename).find({sharenum : e_sharenum}).toArray(function(err,result){
						var connectstat = result[0].connectstat;
						connectstat[e_num].push(west_json);
						var e_connect_data = connectstat;

						//새로 연결된 포트가 usingport에 있고 bridgeport에는 없으면 bridgeport에 해당 포트를 추가하고, 아무데도 없으면 usingport에만 추가.
						//둘다 있으면 connectstat에만 추가
						if(result[0].usingport.indexOf(e_num) != -1 && result[0].bridgeport.indexOf(e_num) === -1){
							db.collection(nodename).updateOne({sharenum : e_sharenum},{$push : {bridgeport : e_num}}, function(err,result){
							});
						}else if(result[0].usingport.indexOf(e_num) === -1){
							db.collection(nodename).updateOne({sharenum : e_sharenum},{$push : {usingport : e_num}}, function(err,result){
							});
							db.collection(nodename).updateOne({sharenum : e_sharenum},{$pull : {availableport : e_num}}, function(err,result){
							});
						}

						var connectstat_num = `connectstat.${e_num}`;
						db.collection(nodename).updateOne({sharenum : e_sharenum},{$set : {[connectstat_num] : connectstat[e_num]}},function(err,result){
						});
						//west
						db.collection(nodename).find({sharenum : w_sharenum}).toArray(function(err,w){
							// 반대 포트 연결상태 확인후 using,available,disable 추출
							var p = w[0];
							db.collection(p.oppnodename).find({sharenum : p.sharenum}).toArray(function(err,result){

								var opp_usingport = result[0].usingport;
								var opp_bridgeport = result[0].bridgeport;
								var opp_disableport = result[0].disableport;
								var j;
								for(var i in opp_bridgeport){
									j = opp_usingport.indexOf(opp_bridgeport[i]);
									opp_usingport.splice(j,1);
								}
								var w_port = dbshow.showportOne(opp_usingport,opp_bridgeport,opp_disableport,p);
								//east
								db.collection(nodename).find({sharenum : e_sharenum}).toArray(function(err,e){
									// 반대 포트 연결상태 확인후 using,available,disable 추출
									var p = e[0];
									db.collection(p.oppnodename).find({sharenum : p.sharenum}).toArray(function(err,result){

										var opp_usingport = result[0].usingport;
										var opp_bridgeport = result[0].bridgeport;
										var opp_disableport = result[0].disableport;
										var j;
										for(var i in opp_bridgeport){
											j = opp_usingport.indexOf(opp_bridgeport[i]);
											opp_usingport.splice(j,1);
										}
										var e_port = dbshow.showportOne(opp_usingport,opp_bridgeport,opp_disableport,p);

										var data_json = {w_connect_data : w[0].connectstat, e_connect_data : e[0].connectstat, w_port : w_port, e_port : e_port};
										data_json = JSON.stringify(data_json);
										response.writeHead(200);
										response.end(data_json);
									});
								});
							});
						});
					});
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect/disconnecting"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var west_json = JSON.parse(post.west_json);
				var east_json = JSON.parse(post.east_json);

				var w_sharenum = west_json.sharenum;
				var w_num = west_json.num;
				var e_sharenum = east_json.sharenum;
				var e_num = east_json.num;
				var nodename = west_json.nodename;

				//WEST
				db.collection(nodename).find({sharenum : w_sharenum}).toArray(function(err,result){
					var connectstat = result[0].connectstat;
					var w_new_connectstat = [];
					for(var i in connectstat[w_num]){
						if(connectstat[w_num][i].sharenum !== e_sharenum || connectstat[w_num][i].num !== e_num){
							w_new_connectstat.push(connectstat[w_num][i]);
						}
					}
					if(result[0].bridgeport.indexOf(w_num) === -1){
						db.collection(nodename).updateOne({sharenum : w_sharenum},{$pull : {usingport : w_num}}, function(err,result){
						});
						db.collection(nodename).updateOne({sharenum : w_sharenum},{$push : {availableport : w_num}}, function(err,result){
						});
					}else if(result[0].bridgeport.indexOf(w_num) !== -1){
						if(result[0].connectstat[w_num].length === 2){
							db.collection(nodename).updateOne({sharenum : w_sharenum},{$pull : {bridgeport : w_num}}, function(err,result){
							});
						}
					}
					var connectstat_num = `connectstat.${w_num}`;
					db.collection(nodename).updateOne({sharenum : w_sharenum},{$set : {[connectstat_num] : w_new_connectstat}},function(err,result){
					});

					//EAST
					db.collection(nodename).find({sharenum : e_sharenum}).toArray(function(err,result){
						var connectstat = result[0].connectstat;
						var e_new_connectstat = [];
						for(var i in connectstat[e_num]){
							if(connectstat[e_num][i].sharenum !== w_sharenum || connectstat[e_num][i].num !== w_num){
								e_new_connectstat.push(connectstat[e_num][i]);
							}
						}
						if(result[0].bridgeport.indexOf(e_num) === -1){
							db.collection(nodename).updateOne({sharenum : e_sharenum},{$pull : {usingport : e_num}}, function(err,result){
							});
							db.collection(nodename).updateOne({sharenum : e_sharenum},{$push : {availableport : e_num}}, function(err,result){
							});
						}else if(result[0].bridgeport.indexOf(e_num) !== -1){
							if(result[0].connectstat[e_num].length === 2){
								db.collection(nodename).updateOne({sharenum : e_sharenum},{$pull : {bridgeport : e_num}}, function(err,result){
								});
							}
						}

						var connectstat_num = `connectstat.${e_num}`;
						db.collection(nodename).updateOne({sharenum : e_sharenum},{$set : {[connectstat_num] : e_new_connectstat}},function(err,result){
						});

						//west
						db.collection(nodename).find({sharenum : w_sharenum}).toArray(function(err,w){
							// 반대 포트 연결상태 확인후 using,available,disable 추출
							var p = w[0];
							db.collection(p.oppnodename).find({sharenum : p.sharenum}).toArray(function(err,result){

								var opp_usingport = result[0].usingport;
								var opp_bridgeport = result[0].bridgeport;
								var opp_disableport = result[0].disableport;
								var j;
								for(var i in opp_bridgeport){
									j = opp_usingport.indexOf(opp_bridgeport[i]);
									opp_usingport.splice(j,1);
								}
								var w_port = dbshow.showportOne(opp_usingport,opp_bridgeport,opp_disableport,p);
								//east
								db.collection(nodename).find({sharenum : e_sharenum}).toArray(function(err,e){
									// 반대 포트 연결상태 확인후 using,available,disable 추출
									var p = e[0];
									db.collection(p.oppnodename).find({sharenum : p.sharenum}).toArray(function(err,result){

										var opp_usingport = result[0].usingport;
										var opp_bridgeport = result[0].bridgeport;
										var opp_disableport = result[0].disableport;
										var j;
										for(var i in opp_bridgeport){
											j = opp_usingport.indexOf(opp_bridgeport[i]);
											opp_usingport.splice(j,1);
										}
										var e_port = dbshow.showportOne(opp_usingport,opp_bridgeport,opp_disableport,p);

										var data_json = {w_connect_data : w[0].connectstat, e_connect_data : e[0].connectstat, w_port : w_port, e_port : e_port};
										data_json = JSON.stringify(data_json);
										response.writeHead(200);
										response.end(data_json);
									});
								});
							});
						});
					});
				});
			});
		}else{
		  var result = ('access_denied');
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/connect_control"){
		if(checkCookieAdmin()){
			var allnodelist = [];
			db.listCollections().toArray(function(err,collections){
				for(var i = 0;i<collections.length;i++){
					allnodelist.push(collections[i].name);
				}
				counterdb.collection('node_tree').find({}).toArray(function(err,nodelist){
					fs.readFile(`./connection/connection.css`,'utf8',function(err,CSS){
						fs.readFile(`./connection/connection.js`,'utf8',function(err,JS){
							fs.readFile(`./public/jquery-3.6.0.min.js`,'utf8',function(err,jquery){
								fs.readFile(`./connection/connection_ajax.js`,'utf8',function(err,ajax){
									fs.readFile(`./ports_css/CDF_E1.css`,'utf8',function(err,CDF_E1){
										fs.readFile(`./ports_css/MDF.css`,'utf8',function(err,MDF){
											fs.readFile(`./ports_css/FDF.css`,'utf8',function(err,FDF){
												var nodelists = template.List(nodelist);
												var HTML = template.connect_control(CSS,CDF_E1,MDF,FDF,JS,jquery,ajax,allnodelist,nodelists);
												response.writeHead(200);
												response.end(HTML);
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}else{
		  var result = template.access_denied();
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/order/port"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var nodename = post.nodename;
				var before = post.before;
				var after = post.after;

				if(before != "" && after != ""){
					var new_portorder;
					before = parseInt(before);
					after = parseInt(after);

					db.collection(nodename).find({_id : 'portorder'}).toArray(function(err,result){
						var portorder = result[0].portorder;

						new_portorder = portorder;

						var before_id = portorder[before];

						new_portorder.splice(before,1);
						new_portorder.splice(after,0,before_id);

						db.collection(nodename).updateOne({_id : 'portorder'},{$set : {portorder : new_portorder}},function(err,result){
						})

						response.writeHead(302,{Location:encodeURI(`/?id=${nodename}`)});
						response.end();
					})
				}else{
					response.writeHead(302,{Location:encodeURI(`/?id=${nodename}`)});
					response.end();
				}
			});
		}else{
			var result = template.access_denied();
		  response.writeHead(200)
		  response.end(result);
		}
	}else if(pathname==="/allconnect"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var json = JSON.parse(post.json);
			var nodename = json.nodename;
			var sharenum = json.sharenum;
			var num = json.num;
			var oppnodename = json.oppnodename;
			var portname = json.portname;
			var next = {};
			var content = {};
			var html = `
<div class="allconnect_body" id="allconOn">
	<button onclick="closeAllconnect()">X</button>
	<div class="title">연결된 포트 전부 보기</div>

	<form method="post" onsubmit="return getHidden()" action="/allconnect/change" class="row">연결된 포트 용도/비고 한번에 변경 : &nbsp<input type="text" name="content" class="content" placeholder="용도 또는 비고 작성">
	<input type="hidden" name="json" class="allconnect_json" value="">
	<input type="hidden" name="nodename" class="allconnect_nodename">
	&nbsp<select name="uor" class="UsageOrRefer"><option selected value="usage">용도</option>
	<option value="reference">비고</option></select>
	&nbsp<input type="submit" class="change" value="변경">
	</form>

	<div class="allconnect_row">`


			db.listCollections().toArray(function(err,result){
				for(var i in result){
					content[result[i].name] = [];
				}
			})
			//next를 받으면 첫번째 배열의 노드부터 순서대로 각 노드의 연결된 포트들을 content에 추가하고 반대노드의 포트 정보를 new_next에 넣는다.
			var show_connect_first = new Promise(function(resolve,reject){

				db.collection(nodename).find({sharenum : sharenum}).toArray(function(err,result){

					content[nodename].push([oppnodename,portname,num]);
					next[sharenum] = [oppnodename,nodename,sharenum,portname,num];

					var connected_ports = result[0].connectstat[num];

					for(var i in connected_ports){
						content[nodename].push([connected_ports[i].oppnodename,connected_ports[i].portname,connected_ports[i].num]);
						next[connected_ports[i].sharenum]=[connected_ports[i].oppnodename,connected_ports[i].nodename,connected_ports[i].sharenum,connected_ports[i].portname,connected_ports[i].num];
					}
					resolve([next,content]);
				});
			});


			var show_connect_next = function(array){
				return new Promise(function(resolve,reject){
					var content = array[1];
					var next = array[0];
					var new_next = {};
					var count = 0;

					var next_sharenums = Object.keys(next);

					for(var i in next_sharenums){
						var nodename = next[next_sharenums[i]][0];
						var oppnodename = next[next_sharenums[i]][1];
						var sharenum = next[next_sharenums[i]][2];
						var portname = next[next_sharenums[i]][3];
						var num = next[next_sharenums[i]][4];

						content[nodename].push([oppnodename,portname,num]);

						db.collection(nodename).find({sharenum : sharenum}).toArray(function(err,result){

							var connected_ports = result[0].connectstat[next[result[0].sharenum][4]];
							for(var j in connected_ports){
								content[result[0].nodename].push([connected_ports[j].oppnodename,connected_ports[j].portname,connected_ports[j].num]);
								new_next[connected_ports[j].sharenum]=[connected_ports[j].oppnodename,connected_ports[j].nodename,connected_ports[j].sharenum,connected_ports[j].portname,connected_ports[j].num];
							}
							if(++count === next_sharenums.length){

								var json = JSON.stringify(content);
								if(Object.keys(new_next).length === 0){
									html += `<input type="hidden" class="allconnect_hidden" value=${json}>`
									////////////////////////////////////////////////
									var content_nodes = Object.keys(content);
									for(var i in content_nodes){
										var portsinnode = content[content_nodes[i]];
										if(portsinnode.length != 0){
											html += `
													<div class="allconnect_column">
														<div class="nodename">${content_nodes[i]}</div>`
											for(var j in portsinnode){
												html += `<div class="card">
														<div class="container">
															<p><b>${portsinnode[j][0]}</b><p>
															<p class="portname">${portsinnode[j][1]}</p>
															<p>${portsinnode[j][2]}번 포트</p>
														</div>
													</div>`
											}
											html += `</div>`
										}
									}
									html += `</div></div>`
									response.writeHead(200);
									response.end(html);
									////////////////////////////////////////////////////////////
								}else{
									var array = [new_next,content];
									show_connect_next(array);
								}
							}
						})
					}
				})
			}


			function show_connect_all(nodename,oppnodename,sharenum,portname,num){
				show_connect_first
				.then(show_connect_next)
			}

			show_connect_all(nodename,oppnodename,sharenum,portname,num);

		});
	}else if(pathname==="/allconnect/change"){
		if(checkCookieAdmin()){
			var body = '';
			request.on('data',function(data){
				body = body + data;
			});
			request.on('end',function(){
				var post = qs.parse(body);
				var content = post.content;
				var uor = post.uor;
				var json = JSON.parse(post.json);
				var title = post.nodename;

				var json_names = Object.keys(json);

				for(var i in json_names){
					var nodename = json_names[i]
					var portsinnode = json[nodename];
					for(var j in portsinnode){
						var oppnodename = portsinnode[j][0];
						var portname = portsinnode[j][1];
						var num = portsinnode[j][2];
						if(uor === 'usage'){
							var doubleDoc = `usage.${num}`;
						}else{
							var doubleDoc = `reference.${num}`;
						}
						db.collection(nodename).updateOne({oppnodename : oppnodename, portname : portname},{$set : {[doubleDoc] : content}},function(err,result){
						})
					}
				}
				response.writeHead(302, {Location:encodeURI(`/?id=${title}`)})
				response.end();
			});
		}else{
			var result = template.access_denied();
			response.writeHead(200)
			response.end(result);
		}
	}else if(pathname==="/search"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var search_string = post.search_string;
			var search1 = `<div class="searched_result_form"><input type="button" value="닫기" onclick="search_quit()">
			<div class="title">검색 결과</div><div class="content">`;
			var searched = "";
			var searched_number = 0;
			var pattern = new RegExp(search_string);

			db.listCollections().toArray(function(err,result){
				var collections = [];
				for(var i in result){
					collections.push(result[i].name);
				}
				var got = 0;
				for(var i in collections){
					db.collection(collections[i]).find({_id : {$ne : 'portorder'}}).toArray(function(err,result2){
						for(var k in result2){
							var nresult = Object.keys(result2[k].usage).length;
							for(var g = 1;g<=nresult;g++){
								if(result2[k].usage[g].match(pattern) != null){
									searched_number +=1;
									searched += `<a href="/?id=${result2[k].nodename}">
<str>${result2[k].nodename}</str> 노드의 <str>${result2[k].oppnodename}</str>로 가는 <str>${result2[k].portname}</str> 포트의 <str>${g}</str>번 단자<br>
일치내용 <str style="color : green">(용도)</str> : <str style="color : blue">${result2[k].usage[g]}</str></a>`
								}
								if(result2[k].reference[g].match(pattern) != null){
									searched_number +=1;
									searched += `<a href="/?id=${result2[k].nodename}">
<str>${result2[k].nodename}</str> 노드의 <str>${result2[k].oppnodename}</str>로 가는 <str>${result2[k].portname}</str> 포트의 <str>${g}</str>번 단자<br>
일치내용 <str style="color : red">(비고)</str> : <str style="color : blue">${result2[k].reference[g]}</str></a>`
								}
							}
						}

						if(++got === collections.length){
							var result = search1 + `총 ${searched_number}건의 검색 결과가 있습니다.` + searched +`</div></div>`
							response.writeHead(200);
							response.end(result);
						}
					});
				}
			});
		});
	}else if(pathname==="/login"){
		fs.readFile(`./login/login.css`,'utf8',function(err,CSS){
			fs.readFile(`./login/login.js`,'utf8',function(err,js){
				fs.readFile(`./public/jquery-3.6.0.min.js`,'utf8',function(err,jquery){
					var html = template.login(CSS,js,jquery);
					response.writeHead(200,{'Set-Cookie' : 'bG9naW5fc3VjY2Vzcw=; Max-Age=0'});
					response.end(html);
				});
			});
		});
	}else if(pathname==="/login/session"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var id = post.id;
			var pw = post.pw;

			if(id === 'admin' && pw === 'wjdqjatjr12630519'){
				var result = 'success_admin';
			}else if(id === 'client' && pw === 'wjdqjatjr1263'){
				var result = 'success_client';
			}else{
				var result = 'fail';
			}

			response.writeHead(200)
			response.end(result);
		});
	}else{
		response.writeHead(404);
		response.end('Not found');
	}
});
app.listen(3000);
































//
