appControllers.controller('chatCtrl', function ($scope, $firebaseObject, $ionicScrollDelegate, $location, $state, $stateParams, $timeout, $firebaseArray, ConfigurationService, EntityService,NotificationService,ChatService) {

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


  $scope.sendMessage = function (msg) {
    ChatService.sendMessage(msg, $scope.chatDetails);
    $scope.data.message = "";
    //var isFirstMessage = false;
    //if($scope.messages.length == 0){
    //  isFirstMessage = true;
    //}
    //
    ////var otherConversaionOnline="https://chatoi.firebaseio.com/chats/" + $scope.conversationId.split("-")[0] + "/" + $scope.userId + '-' + $scope.conversationId.split("-")[1];
    //var ref2, ref1;
    //if (isFirstMessage) {
    //  ref2 = new Firebase(otherUrl);
    //  ref1 = new Firebase(myUrl);
    //
    //  var newMessageRef2 = ref2.push();
    //  var newMessageRef1 = ref1.push();
    //  ref1.set({
    //    userName: $scope.chatDetails.userName,
    //    subjectName: $scope.chatDetails.subjectName,
    //    fbPhotoUrl: $scope.chatDetails.fbPhotoUrl,
    //    read: true
    //
    //  });
    //  ref2.set({
    //    userName: userName,
    //    subjectName: $scope.chatDetails.subjectName,
    //    fbPhotoUrl: $scope.userDetails.fbPhotoUrl
    //  });
    //
    //  var aa = $firebaseObject(conversationOterUserRef);
    //  aa.$loaded(function(value){
    //    if(!value.conversationId){
    //      hanleOtherMessageRead.set(false);
    //    }else if (value.conversationId !== otherConversationId){
    //      hanleOtherMessageRead.set(false);
    //    }
    //    else{
    //      hanleOtherMessageRead.set(true);
    //    }
    //
    //  })
    //
    //  isFirstMessage = false;
    //}
    //
    //
    //ref2 = new Firebase(otherUrl + "/messages");
    //ref1 = new Firebase(myUrl + "/messages");
    //var newMessageRef1 = ref1.push();
    //newMessageRef1.set(
    //  {
    //    body: msg,
    //    sender: $scope.userDetails._id
    //  }
    //);
    //var newMessageRef2 = ref2.push();
    //newMessageRef2.set(
    //  {
    //    body: msg,
    //    sender: $scope.userDetails._id
    //  }
    //);
    //var aa = $firebaseObject(conversationOterUserRef);
    //aa.$loaded(function(value){
    //  if(!value.conversationId){
    //    hanleOtherMessageRead.set(false);
    //  }else if (value.conversationId !== otherConversationId){
    //    hanleOtherMessageRead.set(false);
    //  }
    //  else{
    //    hanleOtherMessageRead.set(true);
    //  }
    //})
    //
    //var userRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
    //userRef.on("value", function (userSnapshot) {
    //  if (userSnapshot.val() == 'offline') {
    //
    //    var message = {
    //      user: createrId,
    //      message: msg,
    //      conversationId: otherConversationId,
    //      userName: $scope.chatDetails.userName,
    //      subjectName: $scope.chatDetails.subjectName,
    //      fbPhotoUrl: $scope.chatDetails.fbPhotoUrl
    //    }
    //    //NotificationService.SendMessage(message)
    //    //  .then(function (message) {
    //    //
    //    //  }, function (err) {
    //    //  });
    //  }
    //});


  }
})
