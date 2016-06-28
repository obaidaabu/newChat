
appControllers.controller('userProfileCtrl', function ($rootScope, $scope,$state,$stateParams,EntityService,SubjectService) {
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = false;
  $scope.first_name=$state.params.first_name;

  $scope.a=function(){
    $state.go('app.subjects');
  }
  $scope.isAnimated =  $stateParams.isAnimated;
  //$scope.userProfile = angular.fromJson(window.localStorage['user']);
  $scope.subjects = [];
  SubjectService.GetMySubjects($state.params.userId)
    .then(function (subjects) {
      $scope.subjects = subjects;
      $scope.userProfile=subjects[0].user;
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
