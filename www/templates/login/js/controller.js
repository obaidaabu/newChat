appControllers.controller('loginCtrl', function ($scope, $state,UserService, $timeout) {
  $scope.fbLogin = function () {
    console.log("fblogin")
    debugger
    if (window.cordova) {
      console.log("cordova")
      UserService.FBlogin().then(function success(s) {


        window.localStorage['fbData'] = angular.toJson(s.authResponse);
        var fbData = s.authResponse;
        console.log("fbData"+fbData['accessToken'])
        var user = {
          fbToken: fbData['accessToken']
        }
        console.log("user"+user.toString())
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
         console.error(err)
          });
        //alert($scope.FbName)


      }, function error(msg) {
        console.log("Error while performing Facebook login", msg);
      })
    } else {
      console.log("cordova else")
      var user = {
        fbToken: 'fbDataEAAZAMbMtmoBIBAFu684rNHbyosdN6bT7aLJahex0tD1WltM5ZBx9XiNJfZCLGsGMJ2xZBV5OqgjQUpSRp2PcLE7h2tG4BFqfJtPl6ZAj5F7PXokzwRT2kzdSZAcSKtA2FnX44ZC2iGaPhK1QUjiW1KPTnYfCzEoWlMiizHnknmQA6gNgnIzwrZCtCThgTZBrZBKwXbxTS9ihueWUz0ITRYZCjbk',
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
