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
  },100)

  window.addEventListener('native.keyboardshow', function(){
    $timeout(function(){
      $ionicScrollDelegate.scrollBottom(false);
    },300)

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
  $scope.blockUser = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Block User',
      template: 'Are you sure you want to block '+ $scope.chatDetails.userName+' ?',
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Block</b>',
          type: 'button-positive',
          onTap: function(e) {
            return "sss";
          }
        }
      ]
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

  $scope.reportUser=function () {
    $scope.data={is_toBlocked:true,reason:""};
    var confirmPopup = $ionicPopup.show({
      title: 'Report User',
      template: '<textarea cols="4" ng-model="data.reason" placeholder="Giv us more details"></textarea>   <md-checkbox aria-label="Checkbox" ng-model="data.is_toBlocked">Also block this user ? </md-checkbox>',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Report</b>',
          type: 'button-positive',
          onTap: function(e) {
              return {is_toBlocked:$scope.data.is_toBlocked,report:{user:$scope.chatDetails.conversationId.split('-')[1],reason:$scope.data.reason}};
            }
          }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        ChatService.ReportUser(res.report);
        if(res.is_toBlocked)
        {
          ChatService.blockUser($scope.chatDetails);
        }
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
    UserService.SetUserProfile($scope.chatDetails);
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
