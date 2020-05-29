const goToRootParams = {
  name: "goToRoot",
  parameters: null,
  callbackName: null,
};
const validaSesionParams = {
  name: "validaSession",
  parameters: null,
  callbackName: null,
};
const goBackParams = {
  name: "goBack",
  parameters: null,
  allbackName: null,
};

const hideBackButtonParams = {
  name: "hideBackButton",
  parameters: null,
  callbackName: null,
};

function userDidTapBackButton() {
  var mPath = window.location.pathname;
  var miConnect = window.webkit.messageHandlers.Connect;
  if (
    mPath == "/" ||
    mPath == "/consulta" ||
    mPath == "/cuenta" ||
    mPath == "/actualiza"
  ) {
    if (typeof Connect !== "undefined") Connect.goToRoot();
    else if (
      window.webkit !== undefined &&
      window.webkit.messageHandlers.Connect !== undefined
    )
      var miConnect = window.webkit.messageHandlers.Connect;
    miConnect.postMessage(JSON.stringify(goToRootParams));
  } else {
    if (typeof Connect !== "undefined") {
      Connect.validaSesion();
      Connect.goBack();
    } else if (
      window.webkit !== undefined &&
      window.webkit.messageHandlers.Connect !== undefined
    ) {
      var miConnect = window.webkit.messageHandlers.Connect;
      miConnect.postMessage(JSON.stringify(validaSesionParams));
      miConnect.postMessage(JSON.stringify(goBackParams));
    }
  }
}

function validaSesion() {
  if (typeof Connect !== "undefined") {
    Connect.validaSesion();
  } else if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.Connect !== undefined
  ) {
    var miConnect = window.webkit.messageHandlers.Connect;
    miConnect.postMessage(JSON.stringify(validaSesionParams));
  }
}

function getSSO() {
  if (typeof Connect !== "undefined") {
    return { connect: Connect.getSSOToken(), error: null, wk: false };
  } else if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.Connect !== undefined
  ) {
    return { connect: null, error: null, wk: true };
  }

  //estamos en supernet u otra plataforma o hay un error en la nativa
  return { connect: null, error: true, wk: false };
}

function quitPorta() {
  if (typeof Connect !== "undefined") Connect.goToRoot();
  else if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.Connect !== undefined
  ) {
    var miConnect = window.webkit.messageHandlers.Connect;
    miConnect.postMessage(JSON.stringify(goToRootParams));
  }
}

function requestToken() {
  console.log("Token request");
  if (typeof Connect !== "undefined") {
    var mToken = null;
    var promise = TokenManager.getToken();
    promise.then(
      function (token) {
        mToken = JSON.parse(token);
        responseToken(mToken.token, mToken.typeOTP, mToken.date, "");
      },
      function (mensaje) {
        mToken = null;
        responseToken("", "", "", mensaje);
      }
    );
    if (typeof promise.run !== "undefined") {
      promise.run();
    }
  } else if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.Connect !== undefined
  ) {
    console.log("NUEVO");
    let params = {
      name: "superToken",
      parameters: null,
      callbackName: "supetokenResponse",
    };
    window.webkit.messageHandlers.Connect.postMessage(JSON.stringify(params));
  }
}

function supetokenResponse(code) {
  console.log("CALLBACK!!");
  console.log(code);
  var obj = JSON.parse(code);

  if (obj.status == "true") {
    let label = document.getElementById("tokenLabel");
    label.innerHTML = obj.params.token;
    console.log("token -> " + bj.params.token);
  } else {
    let label = document.getElementById("tokenLabel");
    label.innerHTML = obj.params.token;
    console.log("token -> " + bj.params.message);
  }
}

function responseToken(tokenString, tipoOTP, date, message) {
  window.angularComponentRef.componentFn(tokenString, tipoOTP, date, message);
}

function hideBackButton() {
  if (typeof Connect !== "undefined") Connect.hideBackButton();
  else if (
    window.webkit !== undefined &&
    window.webkit.messageHandlers.Connect !== undefined
  ) {
    var miConnect = window.webkit.messageHandlers.Connect;
    miConnect.postMessage(JSON.stringify(hideBackButton));
  }
}

function setTitle() {}
