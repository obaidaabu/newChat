
appControllers.controller('userProfileCtrl', function ($rootScope, $scope,$state,$stateParams,EntityService,SubjectService,UserService) {
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = false;
  $scope.userProfile = UserService.GetUserProfile();
  $scope.first_name = $scope.userProfile.first_name;

  $scope.a=function(){
    $state.go('app.subjects');
  }
  $scope.isAnimated =  $stateParams.isAnimated;
  //$scope.userProfile = angular.fromJson(window.localStorage['user']);
  $scope.subjects = [];
  SubjectService.GetMySubjects($scope.userProfile.userId)
    .then(function (subjects) {
      $scope.subjects = subjects;
    }, function (err) {
    });


  $scope.goToSetting = function () {
    $state.go("app.expenseSetting");
  };

});


appControllers.controller('profileSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

  $scope.navigateTo = function (stateName,objectData) {
    if ($ionicHistory.currentStateName() != stateName) {
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });

      $ionicViewSwitcher.nextDirection('back');

      $state.go(stateName, {
        isAnimated: objectData,
      });
    }
  };
});
