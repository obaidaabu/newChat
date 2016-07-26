appServices.factory('ChatService', function($q, $timeout, $rootScope, $ionicScrollDelegate, $firebaseObject, $firebaseArray, ConfigurationService, NotificationService){
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
  var hanleMyMessageRead;
  var hanleOtherMessageRead;

  var scrollBottom = function(){
    //$timeout(function(){
    //  $('.chats').parent().scrollTop( $('.chats').parent()[0].scrollHeight);
    //},0)
    $ionicScrollDelegate.scrollBottom(true);
    $ionicScrollDelegate.resize();
  };

  return {
    getMessages: function() {
      return allmessages;
    },
    setMessages: function(conversaion){
      conversaionId = conversaion;
      createrId = conversaionId.split("-")[0];
      subjectId = conversaionId.split("-")[1];
      myConversaionId = userDetails._id + '-' + subjectId;
      otherUrl = "https://chatoi.firebaseio.com/chats/" + createrId + "/" + myConversaionId;
      myUrl = "https://chatoi.firebaseio.com/chats/" + userDetails._id  + "/" + conversaionId;
      conversationUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + userDetails._id);
      conversationOterUserRef = new Firebase('https://chatoi.firebaseio.com/conversationOnline/' + createrId);

      hanleOtherMessageRead = new Firebase(otherUrl + "/read");
      hanleMyMessageRead = new Firebase(myUrl + "/read");
      hanleMyMessageRead.set(true);
      conversationUserRef.set({
        conversationId: conversaion,

      });

      var isUserOnlineRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
      isUserOnlineRef.on("value", function (userSnapshot) {
        if (userSnapshot.val() && userSnapshot.val() == 'online') {
          $rootScope.$broadcast('sendUserOnlineEvent', true);
        }
        else{
          $rootScope.$broadcast('sendUserOnlineEvent', false);
        }
      });

      var firebaseRef = new Firebase('https://chatoi.firebaseio.com/chats/' + userDetails._id + '/' + conversaionId);
      var firebaseRef2 = new Firebase('https://chatoi.firebaseio.com/chats/' + userDetails._id + '/' + conversaionId +"/messages");
      var a = $firebaseArray(firebaseRef2);
      a.$loaded(function(h){
        allmessages = h;
        $rootScope.$broadcast('sendChatEvent', 'sendChatEvent');
      })
      firebaseRef.on('value', function(dataSnapshot) {
        //allmessages = dataSnapshot.val().messages;
        //$rootScope.$broadcast('sendChatEvent', 'sendChatEvent');
        scrollBottom();

      });
    },
    sendMessage: function(msg, chatDetails){

      var myRef, otherRef;
      var isFirstMessage = false;
      if(!allmessages || allmessages.length == 0){
        isFirstMessage = true;
      }
      if(isFirstMessage){
        otherRef = new Firebase(otherUrl);
        myRef = new Firebase(myUrl);
        myRef.set({
          userName: chatDetails.userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: chatDetails.fbPhotoUrl,
          read: true
        });
        otherRef.set({
          userName: userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: userDetails.fbPhotoUrl
        });
        isFirstMessage = false;
      }
      otherRef = new Firebase(otherUrl + "/messages");
      myRef = new Firebase(myUrl + "/messages");
      var newMessageOtherUrl = otherRef.push();
      var newMessageRef2 = myRef.push();
      var date = new Date();
      var msgTosend = {
        body: msg,
        sender: userDetails._id,
        create_date: date.toJSON(),
        date_string: date.toLocaleDateString()
      }
      newMessageOtherUrl.set(msgTosend);
      newMessageRef2.set(msgTosend);

      var didUserRead = $firebaseObject(conversationOterUserRef);
      didUserRead.$loaded(function(value){
        if(!value.conversationId){
          hanleOtherMessageRead.set(false);
        }else if (value.conversationId !== myConversaionId){
          hanleOtherMessageRead.set(false);
        }
        else{
          hanleOtherMessageRead.set(true);
        }
      })

      var userRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
      var isOtherUserOnline = $firebaseObject(userRef);
      isOtherUserOnline.$loaded(function(value){
        if(value && value.$value == 'offline'){
          var message = {
            user: createrId,
            message: msg,
            conversationId: myConversaionId,
            userName: userName,
            subjectName: chatDetails.subjectName,
            fbPhotoUrl: userDetails.fbPhotoUrl
          }
          NotificationService.SendMessage(message)
            .then(function (message) {

            }, function (err) {
            });
        }
      })



    },
    scrollBottom: scrollBottom
  }
})
