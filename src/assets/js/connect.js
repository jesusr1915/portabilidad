function userDidTapBackButton(){
  var mPath = window.location.pathname;
  if(mPath == "/" || mPath == "/consulta" || mPath == "/cuenta" || mPath == "/actualiza"){
    //localStorage.clear();
    Connect.goToRoot();
  } else {
    //localStorage.setItem('backButton', "true");
    Connect.validaSesion();
    Connect.goBack();
  }
}

function validaSesion(){
  Connect.validaSesion();
}

function quitPorta(){

  ga('send', 'event', {
    eventCategory: 'finalizar',
    eventAction: 'finalizar',
    eventValue: 1
  });

  //localStorage.clear();
  Connect.goToRoot();
}

function requestToken() {
  var mToken = null;
  console.log("PIDE TOKEN");
  var promise = TokenManager.getToken();
  promise.then(
    function(token){
      console.log("RESPONDE TOKEN " + token);
      mToken = JSON.parse(token)
      responseToken(mToken.token, mToken.typeOTP, mToken.date,'');
    },
    function(mensaje){
      console.log("RESPONDE ERROR " + mensaje);
      mToken = null;
      responseToken('', '', '', mensaje);
    }
  );
  if (typeof promise.run !== "undefined") {
    console.log("EJECUTA PROMISE");
    promise.run();
  }
}

function responseToken(tokenString,tipoOTP,date,message){
  console.log("RESPONSE TOKEN");
  window.angularComponentRef.componentFn(tokenString, tipoOTP, date, message);
}

function hideBackButton(){
  Connect.hideBackButton();
}
