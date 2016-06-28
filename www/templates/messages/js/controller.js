appControllers.controller('messagesCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $firebaseArray, ConfigurationService, MessagesService, UserService, EntityService) {

  $rootScope.isHeaderExpanded = true;
  $scope.$on('sendMessagesEvent', function(event, mass) {
    $scope.messages = MessagesService.getMessages();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
  $scope.goToChat = function (message) {
    var messageDetails = {
      conversationId: message.conversationId,
      fbPhotoUrl: message.fbPhotoUrl,
      userName: message.userName,
      subjectName: message.subjectName
    }
    EntityService.setMessageDetails(messageDetails);
    $state.go('app.chat', {conversationId: message.conversationId})
  }
  $scope.goToUserProfile = function (message) {
    var createrId = message.conversationId.split("-")[0];
    UserService.GetUser(createrId)
      .then(function (user) {
        EntityService.setProfile(user);
        $state.go("app.profile",{otherProfile: true});
      }, function (err) {
      });

  }
})
