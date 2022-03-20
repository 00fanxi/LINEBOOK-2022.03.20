function checkPW(){
  var id = document.querySelector('#user_id').value;
  var pw = document.querySelector('#user_pw').value;
  $.ajax({
    method : 'post',
    url : '/login/session',
    data : {id : id, pw : pw}
  }).done(function(result){
    if(result === 'success_admin'){
      document.cookie = `${btoa("login_success")}=${btoa("ChungBeomSeok1263CompletedThisProjectAt")};Path='/';Secure`;
      window.location.replace("http://localhost:3000/");
    }else if(result === 'success_client'){
      document.cookie = `${btoa("login_success")}=${btoa("TwoThousandTwowentyTwoMarchEighteen")};Path='/';Secure`;
      window.location.replace("http://localhost:3000/");
    }else{
      alert('아이디나 비밀번호가 일치하지 않습니다.')
      window.location.replace("http://localhost:3000/login");
    }
  }).fail(function(xhr,textStatus,errorThrown){
    console.log(xhr,textStatus,errorThrown);
  });
}
