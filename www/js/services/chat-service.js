appServices.factory('ChatService', function($ionicScrollDelegate, $firebaseObject, ConfigurationService){
  var allmessages = [];
  var userDetails = ConfigurationService.UserDetails();
  var userName = userDetails.first_name + " " + userDetails.last_name;
  var conversaionId;
  var myConversaionId;
  var createrId;
  var subjectId;
  var createrId;
  var myUrl;
  var otherUrl;
  var conversationUserRef;
  var conversationOterUserRef;

  var hanleOtherMessageRead;

  var scrollBottom = function(){
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true);
  };

  return {
    getMessages: function() {
      return allmessages;
    },
    setMessages: function(conversaion){
      allmessages = [];
      conversaionId = conversaion;
      createrId = conversaionId.split("-")[0];
      subjectId = conversaionId.split("-")[1];
      myConversaionId = userDetails._id + '-' + subjectId;
      myUrl = "https://chatoi.firebaseio.com/chats/" + userDetails._id + "/" + myConversaionId;
      otherUrl = "https://chatoi.firebaseio.com/chats/" + createrId + "/" + conversaionId;
      conversationUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + userDetails._id);
      conversationOterUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + createrId);

      hanleOtherMessageRead = new Firebase(otherUrl + "/read");
      conversationUserRef.set({
        conversationId: conversaion,

      });

      var firebaseRef = new Firebase('https://chatoi.firebaseio.com/chats/' + userDetails._id + '/' + myConversaionId+ '/messages');
      firebaseRef.on('child_added', function(dataSnapshot) {
        allmessages.push(dataSnapshot.val());
        scrollBottom();

      });
    },
    sendMessage: function(msg, chatDetails){
      scrollBottom();
      var myRef, otherRef;
      var isFirstMessage = false;
      if(allmessages.length == 0){
        isFirstMessage = true;
      }
      if(isFirstMessage){
        otherRef = new Firebase(otherUrl);
        myRef = new Firebase(myUrl);
        otherRef.set({
          userName: chatDetails.userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: chatDetails.fbPhotoUrl,
        });
        myRef.set({
          userName: userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: userDetails.fbPhotoUrl,
          read: true
        });
        isFirstMessage = false;
      }
      otherUrl = new Firebase(otherUrl + "/messages");
      myUrl = new Firebase(myUrl + "/messages");
      var newMessageOtherUrl = otherUrl.push();
      var newMessageRef2 = myUrl.push();
      var msgTosend = {
        body: msg,
        sender: userDetails._id
      }
      newMessageOtherUrl.set(msgTosend);
      newMessageRef2.set(msgTosend);

      var didUserRead = $firebaseObject(conversationOterUserRef);
      didUserRead.$loaded(function(value){
        if(!value.conversationId){
          hanleOtherMessageRead.set(false);
        }else if (value.conversationId !== conversaionId){
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
            message: msg,
            conversationId: conversaionId,
            userName: chatDetails.userName,
            subjectName: chatDetails.subjectName,
            fbPhotoUrl: chatDetails.fbPhotoUrl
          }
          //NotificationService.SendMessage(message)
          //  .then(function (message) {
          //
          //  }, function (err) {
          //  });
        }
      });


    }
  }
})
