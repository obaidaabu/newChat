appControllers.controller('loginCtrl', function ($scope, $state,UserService, $timeout) {
  $scope.fbLogin = function () {
    console.log("fblogin")
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
        fbToken: 'EAAZAMbMtmoBIBAF265St7cNyjjt6yRiRHzcJorOxTk9RrOPGMp4Uxdb8fyz3yx8B2tsKQC80jfJgWfgBBx8tincEFt7nlDiHd3Mq7CgFDYe57TjQ1q0KIzPrFbRujW9GKJMfz8duIWGVZA8OZAvjA0QNOnKakMkeKtGFHA8fEgjBCcczgId',
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
