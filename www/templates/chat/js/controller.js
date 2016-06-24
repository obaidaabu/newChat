appControllers.controller('chatCtrl', function ($scope, $state, ConfigurationService, ChatService, UserService, EntityService) {
  $scope.isExpanded = true;
  $scope.chatDetails = EntityService.getMessageDetails();
  $scope.conversationId = $scope.chatDetails.conversationId;
  $scope.messages = [];
  $scope.userDetails = ConfigurationService.UserDetails();
  ChatService.setMessages($scope.conversationId);

  $scope.messages = ChatService.getMessages();

  $scope.messageIsMine = function(userId){
    return $scope.userDetails._id === userId;
  };

  $scope.getBubbleClass = function(userId){
    var classname = 'from-them';
    if($scope.messageIsMine(userId)){
      classname = 'from-me';
    }
    return classname;
  };
  $scope.goToUserProfile = function () {
    var createrId =  $scope.conversationId.split("-")[0];
    UserService.GetUser(createrId)
      .then(function (user) {
        EntityService.setProfile(user);
        $state.go("app.myProfile",{otherProfile: true});
      }, function (err) {
      });

  }

  $scope.sendMessage = function (msg) {
    ChatService.sendMessage(msg, $scope.chatDetails);
    $scope.data.message = "";
  }
})
