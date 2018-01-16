var myExtObject = (function() {

  return {
    requestToken: function() {
      console.log("SOLICITANDO TOKEN");
      Connect.requestToken();
    },
    responseToken: function() {
      console.log("TOKEN: " + tokenString);
    }
  }

})(myExtObject||{})
