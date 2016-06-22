appControllers.controller('loginCtrl', function ($scope, $state,UserService, $timeout) {
  $scope.fbLogin = function () {
    debugger
    if (window.cordova) {
      UserService.FBlogin().then(function success(s) {


        window.localStorage['fbData'] = angular.toJson(s.authResponse);
        var fbData = s.authResponse;

        var user = {
          fbToken: fbData['accessToken']
        }
        UserService.CreateUser(user)
          .then(function (user) {
            window.localStorage['user'] = angular.toJson(user);
            var ref = new Firebase("https://chatoi.firebaseio.com");

            ref.authWithCustomToken(user.fireToken, function (error, authData) {

              if (error) {
                console.log("Login Failed!", error);
              } else {
                $state.go("app.subjects");
              }
            });
            $state.go("tab.subjects");
          }, function (err) {
          });
        //alert($scope.FbName)


      }, function error(msg) {
        console.log("Error while performing Facebook login", msg);
      })
    } else {
      var user = {
        fbToken: 'EAAZAMbMtmoBIBAGfywiAYNWheXdeVsoX7O0GKxOx1DHAjO52Y6H6bhxS5E6MyFSSLaJNTgMOC8oAOTX3El5ZCZB9ESFUXpU7XKKcjdyTLInXqDrCZCTb1ExRQKAZBGqSLmp2trDUv5t7W9ZBUXKvPEvHH6FwId0KPXm3nNWiwUZAJjwDCZCZAQLYXOoL5dZBy61JR9AtZBQzY9OD1WZAMWEBsCE8',
        notification_token: 'ac92b0ec-117b-4c8c-87d1-12519f8f0578'

      }

      UserService.CreateUser(user)
        .then(function (user) {
          window.localStorage['user'] = angular.toJson(user);
          var ref = new Firebase("https://chatoi.firebaseio.com");

          ref.authWithCustomToken(user.fireToken, function (error, authData) {

            if (error) {
              console.log("Login Failed!", error);
            } else {
              $state.go("app.subjects");
            }
          });
          $state.go("app.subjects");
        }, function (err) {
        });
    }

  };

});// End of facebook login controller.
