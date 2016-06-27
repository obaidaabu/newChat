appControllers.controller('loginCtrl', function ($scope, $state,UserService, $timeout) {
  $scope.fbLogin = function () {
    console.log("fblogin")
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
            console.log("create")
            window.localStorage['user'] = angular.toJson(user);
            var ref = new Firebase("https://chatoi.firebaseio.com");

            ref.authWithCustomToken(user.fireToken, function (error, authData) {

              if (error) {
                console.log("Login Failed!", error);
              } else {
                console.log("subjects")

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
        fbToken: 'EAAZAMbMtmoBIBAGcmDiZBc7mjcWxwTVskQyU0TRdGiZATVe3iRWlZAmlP7dOQNoN9iwZArvyFutCFRyUFyQXHUN9auZCvz6h5zZBSeQZB9fqmhoZAKtzbU0dPLZBfjRZByacjIa1cOWEta324b8NWuowayuuycMWarJGeWKhS5f5XdGjTJt5tqKZClm6z6F8gO9n28su1yivdOBCjALPzt4PZChMl',
        notification_token: 'b95a00b4-96e0-41c6-9331-fa787a54291b'

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
