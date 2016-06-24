// Controller of expense dashboard page.
appControllers.controller('userProfileCtrl', function ($scope,$state,$stateParams,EntityService,SubjectService) {
$scope.first_name=$state.params.first_name;
  //$scope.isAnimated is the variable that use for receive object data from state params.
  //For enable/disable row animation.
  $scope.a=function(){
    debugger
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
  // doSomeThing is for do something when user click on a button
  $scope.doSomeThing = function () {
    // You can put any function here.
  } // End doSomeThing.

  // goToSetting is for navigate to Dashboard Setting page
  $scope.goToSetting = function () {
    $state.go("app.expenseSetting");
  };// End goToSetting.

});// End of controller expense dashboard.

// Controller of expense dashboard setting.
appControllers.controller('profileSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

  // navigateTo is for navigate to other page
  // by using targetPage to be the destination state.
  // Parameter :
  // stateNames = target state to go.
  // objectData = Object data will send to destination state.
  $scope.navigateTo = function (stateName,objectData) {
    if ($ionicHistory.currentStateName() != stateName) {
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });

      //Next view animate will display in back direction
      $ionicViewSwitcher.nextDirection('back');

      $state.go(stateName, {
        isAnimated: objectData,
      });
    }
  }; // End of navigateTo.
}); // End of controller expense dashboard setting.
