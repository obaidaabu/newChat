appControllers.controller('messagesCtrl', function ($scope, $state, $stateParams, $timeout, $firebaseArray, ConfigurationService, MessagesService, UserService, EntityService) {
  $scope.messages = MessagesService.getMessages();


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
