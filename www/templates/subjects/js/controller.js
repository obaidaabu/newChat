appControllers.controller('subjectsCtrl', function ($scope, $state,$interval, $stateParams, $timeout, SubjectService, EntityService, UserService) {

  $scope.subjects = [];
  if (window.cordova && typeof window.plugins.OneSignal != 'undefined' && !window.localStorage['notification_token']) {
    $timeout(function () {
      window.plugins.OneSignal.getIds(function (ids) {

        UserService.RegisterNotification(ids.userId)
          .then(function (userToken) {
            window.localStorage['notification_token'] = userToken;
          }, function (err) {
          });
      });
    }, 5000)
  }
  $scope.doRefresh=function(){
    $scope.$broadcast('scroll.refreshComplete');
    SubjectService.GetSubjects(false)
      .then(function (subjects) {
        $scope.subjects = subjects;
      }, function (err) {
      });
  }
  //var stopTime = $interval($scope.doRefresh, 10000);
  $scope.$on("$destroy", function() {
    if (stopTime) {
      $interval.cancel(stopTime);
    }
  });
  $scope.doRefresh();
  $scope.goToUserProfile = function (user) {
    EntityService.setProfile(user);
    $state.go("app.profile",{otherProfile: true});
  }


  $scope.goToChat = function (subject) {

    var userName = subject.user.first_name + " " + subject.user.last_name;
    var messageDetails = {
      conversationId: subject.user._id + "-" + subject._id,
      userName: userName,
      subjectName: subject.title,
      fbPhotoUrl: subject.user.fbPhotoUrl
    }
    EntityService.setMessageDetails(messageDetails);
    $state.go('app.chat')
  }


})
