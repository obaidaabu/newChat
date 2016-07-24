appControllers.controller('chatCtrl', function ($scope, $timeout,$ionicScrollDelegate, $rootScope, $state, ConfigurationService, ChatService, UserService, EntityService) {
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = true;
  $scope.chatDetails = EntityService.getMessageDetails();
  $scope.conversationId = $scope.chatDetails.conversationId;
  $scope.messages = [];


  $scope.userDetails = ConfigurationService.UserDetails();
  ChatService.setMessages($scope.conversationId);
  $scope.messages = ChatService.getMessages();

  $timeout(function(){
    //$('.chats').parent().scrollTop( $('.chats').parent()[0].scrollHeight);
    ChatService.scrollBottom();
  },0)

  window.addEventListener('native.keyboardshow', function(){
    $timeout(function(){
      $('.chats').parent().scrollTop( $('.chats').parent()[0].scrollHeight);
    },0)
  });

  $rootScope.$on('sendChatEvent', function(event, mass) {
    $scope.messages = ChatService.getMessages();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
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
    var createrId =  $scope.conversationId.split("-")[0];
    $state.go('app.userProfile',{userId:createrId })

  }

  $scope.sendMessage = function (msg) {
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
