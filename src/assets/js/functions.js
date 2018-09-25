function userDidTapBackButton(){
  let mPath = window.location.pathname;
  if(mPath == "/" || mPath == "/consulta" || mPath == "/cuenta" || mPath == "/actualiza"){
    // console.log("LIMPIA LOCALSTORAGE");
    // localStorage.clear();
    // console.log("IR A HOME");
    Connect.goToRoot();
  } else {
    // localStorage.setItem('backButton', "true");
    Connect.validaSesion();
    Connect.goBack();
  }
}

function validaSesion(){
  // console.log("VALIDATING SESSION...");
  Connect.validaSesion();
}

function quitPorta(){

  ga('send', 'event', {
    eventCategory: 'finalizar',
    eventAction: 'finalizar',
    eventValue: 1
  });

  // console.log("LIMPIA LOCALSTORAGE");
  // localStorage.clear();
  // console.log("IR A HOME");
  Connect.goToRoot();
}

function requestToken() {

  let promise = TokenManager.getToken();
  promise.then(
    function(token){
    // function(token,tipoOTP,date){
      var mToken = JSON.parse(token)
      responseToken(mToken.token, mToken.typeOTP, mToken.date,'');
    },
    function(mensaje){
      responseToken('', '', '', mensaje);
    }
  );
  if (typeof promise.run !== "undefined") {
    promise.run();
  }
}

function responseToken(tokenString,tipoOTP,date,message){
  window.angularComponentRef.componentFn(tokenString, tipoOTP, date, message);
}

function hideBackButton(){
  Connect.hideBackButton();
}
