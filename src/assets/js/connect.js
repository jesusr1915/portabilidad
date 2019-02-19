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

  // ga('send', 'event', {
  //   eventCategory: 'finalizar',
  //   eventAction: 'finalizar',
  //   eventValue: 1
  // });

  //localStorage.clear();
  Connect.goToRoot();
}

function requestToken() {
  var mToken = null;
  var promise = TokenManager.getToken();
  promise.then(
    function(token){
      mToken = JSON.parse(token)
      responseToken(mToken.token, mToken.typeOTP, mToken.date,'');
    },
    function(mensaje){
      mToken = null;
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
