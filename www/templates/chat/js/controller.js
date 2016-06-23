appControllers.controller('chatCtrl', function ($scope, $firebaseObject, $ionicScrollDelegate, $location, $state, $stateParams, $timeout, $firebaseArray, ConfigurationService, EntityService,NotificationService) {

  $scope.chatDetails = EntityService.getMessageDetails();
  $scope.conversationId = $scope.chatDetails.conversationId;
  $scope.messages = [];
  $scope.userDetails = ConfigurationService.UserDetails();

  $scope.messageIsMine = function(userId){
    return $scope.userDetails === userId;
  };

  $scope.getBubbleClass = function(userId){
    var classname = 'from-them';
    if($scope.messageIsMine(userId)){
      classname = 'from-me';
    }
    return classname;
  };

  var userName = $scope.userDetails.first_name + " " + $scope.userDetails.last_name;

  var createrId = $scope.conversationId.split("-")[0];
  var subjectId = $scope.conversationId.split("-")[1];
  //var createrUser = userRef.val(createrId);
  var otherConversationId = $scope.userDetails._id + '-' + subjectId;
  var myUrl = "https://chatoi.firebaseio.com/chats/" + $scope.userDetails._id + "/" + $scope.conversationId;
  var otherUrl = "https://chatoi.firebaseio.com/chats/" + createrId + "/" + otherConversationId;
  var myMessages = new Firebase(myUrl + "/messages");
  var loadedMessages = $firebaseArray(myMessages);
  loadedMessages.$loaded(function(msgs){
    $scope.messages = $firebaseArray(myMessages);
  })


  var conversationUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + $scope.userDetails._id);
  var conversationOterUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + createrId);
  var hanleMyMessageRead = new Firebase(myUrl + "/read");
  var hanleOtherMessageRead = new Firebase(otherUrl + "/read");
  conversationUserRef.set({
    conversationId: $scope.conversationId,

  });
  hanleMyMessageRead.set(true);

  $timeout(function () {
    $ionicScrollDelegate.scrollBottom();
  },300)

  //});
  $scope.sendMessage = function () {
    $ionicScrollDelegate.scrollBottom();

    var isFirstMessage = false;
    if($scope.messages.length == 0){
      isFirstMessage = true;
    }

    //var otherConversaionOnline="https://chatoi.firebaseio.com/chats/" + $scope.conversationId.split("-")[0] + "/" + $scope.userId + '-' + $scope.conversationId.split("-")[1];
    var ref2, ref1;
    if (isFirstMessage) {
      ref2 = new Firebase(otherUrl);
      ref1 = new Firebase(myUrl);

      var newMessageRef2 = ref2.push();
      var newMessageRef1 = ref1.push();
      ref1.set({
        userName: $scope.chatDetails.userName,
        subjectName: $scope.chatDetails.subjectName,
        fbPhotoUrl: $scope.chatDetails.fbPhotoUrl,
        read: true

      });
      ref2.set({
        userName: userName,
        subjectName: $scope.chatDetails.subjectName,
        fbPhotoUrl: $scope.userDetails.fbPhotoUrl
      });

      var aa = $firebaseObject(conversationOterUserRef);
      aa.$loaded(function(value){
        if(!value.conversationId){
          hanleOtherMessageRead.set(false);
        }else if (value.conversationId !== otherConversationId){
          hanleOtherMessageRead.set(false);
        }
        else{
          hanleOtherMessageRead.set(true);
        }

      })

      isFirstMessage = false;
    }


    ref2 = new Firebase(otherUrl + "/messages");
    ref1 = new Firebase(myUrl + "/messages");
    var newMessageRef1 = ref1.push();
    newMessageRef1.set(
      {
        body: $scope.messageContent,
        sender: $scope.userDetails._id
      }
    );
    var newMessageRef2 = ref2.push();
    newMessageRef2.set(
      {
        body: $scope.messageContent,
        sender: $scope.userDetails._id
      }
    );
    var aa = $firebaseObject(conversationOterUserRef);
    aa.$loaded(function(value){
      if(!value.conversationId){
        hanleOtherMessageRead.set(false);
      }else if (value.conversationId !== otherConversationId){
        hanleOtherMessageRead.set(false);
      }
      else{
        hanleOtherMessageRead.set(true);
      }
    })

    var userRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
    userRef.on("value", function (userSnapshot) {
      if (userSnapshot.val() == 'offline') {

        var message = {
          user: createrId,
          message: $scope.messageContent,
          conversationId: otherConversationId,
          userName: $scope.chatDetails.userName,
          subjectName: $scope.chatDetails.subjectName,
          fbPhotoUrl: $scope.chatDetails.fbPhotoUrl
        }
        NotificationService.SendMessage(message)
          .then(function (message) {

          }, function (err) {
          });
      }
    });



    delete $scope.messageContent;
  }
})
