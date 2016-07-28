appControllers.controller('chatCtrl', function ($scope, $timeout,$ionicScrollDelegate, $rootScope, $state,$ionicPopup, ConfigurationService, ChatService, UserService, EntityService) {
  var date = new Date();
  $scope.dateString = date.toLocaleDateString();
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = true;
  $scope.chatDetails = EntityService.getMessageDetails();
  $scope.conversationId = $scope.chatDetails.conversationId;
  $scope.messages = [];
  var createrId =  $scope.conversationId.split("-")[0];

  $scope.sendInputPlaceHolder = "Message"

  $scope.userDetails = ConfigurationService.UserDetails();
  ChatService.setMessages($scope.conversationId);
  $scope.messages = ChatService.getMessages();

  $timeout(function(){
    ChatService.scrollBottom();
  },0)

  window.addEventListener('native.keyboardshow', function(){
    $timeout(function(){
      ChatService.scrollBottom();
    },100)

  });

  $rootScope.$on('sendChatEvent', function(event, mass) {
    $scope.messages = ChatService.getMessages();
    date = new Date();
    $scope.dateString = date.toLocaleDateString();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
  $rootScope.$on('otherUserBlock', function(event, mass) {
    if(mass){
      $scope.sendInputPlaceHolder = "this user is blocked"
    }
    $scope.disableSend = mass;

  });
  $scope.blockUser=function () {
    debugger
    var confirmPopup = $ionicPopup.confirm({
      title: 'Block User',
      template: 'Are you sure you want to block '+ $scope.chatDetails.userName+' ?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        ChatService.blockUser($scope.chatDetails);
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });

  }
  $scope.reason="";
  $scope.is_toBlocked=true;
  $scope.reportUser=function () {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Report User',
      template: '<textarea cols="4" ng-model="reason" placeholder="Giv us more details"></textarea>   <md-checkbox aria-label="Checkbox" ng-model="is_toBlocked">Also block this user ? </md-checkbox>'
    });
    confirmPopup.then(function(res) {
      if(res) {
        debugger
        ChatService.report({user:$scope.chatDetails.conversationId.split('-')[1],resaon:$scope.reason});
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });

    //ChatService.blockUser($scope.chatDetails);
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
appControllers.controller('OnlineUserCtrl', function ($scope,$firebaseObject, ConfigurationService, EntityService) {
  var userDetails = ConfigurationService.UserDetails();
  var chatDetails = EntityService.getMessageDetails();
  var conversationId = chatDetails.conversationId;
  var createrId = conversationId.split("-")[0];
  var isUserOnlineRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
  var blockedUrl = "https://chatoi.firebaseio.com/chats/" + createrId + "/blocked/" + userDetails._id;
  var blockedRef = new Firebase(blockedUrl);
  var blockUser = $firebaseObject(blockedRef);
  blockUser.$loaded(function(value){
    if(value.userId){
      $scope.isUserOnline = false;
    }
    else{
      isUserOnlineRef.on("value", function (userSnapshot) {
        if (userSnapshot.val() && userSnapshot.val() == 'online') {
          $scope.isUserOnline = true;
        }
        else{
          $scope.isUserOnline = false;
        }
      });
    }
  })

})
