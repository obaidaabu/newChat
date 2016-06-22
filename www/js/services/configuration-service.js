appServices.factory('ConfigurationService', function () {
  var userDetails = null;
  return {

    ServerUrl: function () {
      return "https://chatad.herokuapp.com";
      // return "http://10.0.0.3:3000";
      //return "http://192.168.1.14:3000";
    },
    UserDetails: function(){

      if(!userDetails){
        if(window.localStorage['user']){
          userDetails = angular.fromJson(window.localStorage['user']);
        }
      }
      return userDetails;
    }
  }
});
