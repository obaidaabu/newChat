appControllers.controller('chatCtrl', function ($scope, $timeout,$ionicScrollDelegate, $rootScope, $state, ConfigurationService, ChatService, UserService, EntityService) {
  var date = new Date();
  $scope.dateString = date.toLocaleDateString();
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = true;
  $scope.chatDetails = EntityService.getMessageDetails();
  $scope.conversationId = $scope.chatDetails.conversationId;
  $scope.messages = [];
  var createrId =  $scope.conversationId.split("-")[0];



  $scope.userDetails = ConfigurationService.UserDetails();
  ChatService.setMessages($scope.conversationId);
  $scope.messages = ChatService.getMessages();

  $timeout(function(){
    ChatService.scrollBottom();
  },0)

  window.addEventListener('native.keyboardshow', function(){
    ChatService.scrollBottom();
  });

  $rootScope.$on('sendChatEvent', function(event, mass) {
    $scope.messages = ChatService.getMessages();
    date = new Date();
    $scope.dateString = date.toLocaleDateString();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
  $scope.blockUser=function () {
    ChatService.blockUser($scope.chatDetails);
  }
  $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
      conversationUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + $scope.userDetails._id);
      conversationUserRef.remove();
    })

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
    $state.go('app.userProfile',{userId:createrId })

  }

  $scope.sendMessage = function (msg) {
    date = new Date();
    $scope.dateString = date.toLocaleDateString();
    ChatService.sendMessage(msg, $scope.chatDetails);

    $scope.data.message = "";
  }
})
appControllers.controller('OnlineUserCtrl', function ($scope, EntityService) {
  var chatDetails = EntityService.getMessageDetails();
  var conversationId = chatDetails.conversationId;
  var createrId = conversationId.split("-")[0];
  var isUserOnlineRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
  isUserOnlineRef.on("value", function (userSnapshot) {
    if (userSnapshot.val() && userSnapshot.val() == 'online') {
      $scope.isUserOnline = true;
    }
    else{
      $scope.isUserOnline = false;
    }
  });
})
