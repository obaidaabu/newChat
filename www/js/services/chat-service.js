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
  var isUserBlocked = false;
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
      var blockedUrl = "https://chatoi.firebaseio.com/chats/" + createrId + "/blocked/" + userDetails._id;
      var blockedRef = new Firebase(blockedUrl);
      var blockUser = $firebaseObject(blockedRef);
      blockUser.$loaded(function(value){
        if(value.userId){
          isUserBlocked = true;
        }
      })

      var myblockedUrl = "https://chatoi.firebaseio.com/chats/" + userDetails._id  + "/blocked/" + createrId;
      var myblockedRef = new Firebase(myblockedUrl);
      var myblockUser = $firebaseObject(myblockedRef);
      myblockUser.$loaded(function(value){
        if(value.userId){
          $rootScope.$broadcast('otherUserBlock', true);
        }else{
          $rootScope.$broadcast('otherUserBlock', false);
        }
      })


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
    blockUser:function (chatDetails) {
      createrId = conversaionId.split("-")[0];
      var blockedUserRef=new Firebase("https://chatoi.firebaseio.com/chats/" + userDetails._id+"/blocked/"+createrId);
      var blockedUser = blockedUserRef.set({
        userName: chatDetails.userName,
        fbPhotoUrl: chatDetails.fbPhotoUrl,
        userId:createrId
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
        var otherToSend = {
          userName: userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: userDetails.fbPhotoUrl
        }

        myRef.set({
          userName: chatDetails.userName,
          subjectName: chatDetails.subjectName,
          fbPhotoUrl: chatDetails.fbPhotoUrl,
          read: true
        });

        if(isUserBlocked){
          otherToSend.read = true;
        }

        otherRef.set(otherToSend);
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

      newMessageRef2.set(msgTosend);
      if(!isUserBlocked){
        newMessageOtherUrl.set(msgTosend);

        var didUserRead = $firebaseObject(conversationOterUserRef);
        didUserRead.$loaded(function(value){
          if(!value){
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
      }
    },
    ReportUser: function (report) {
      var deferred = $q.defer();
      $http.post(ConfigurationService.ServerUrl() + '/api/users/report',report, {
        headers: {
          "access-token": ConfigurationService.UserDetails().token
        }
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(msg);
        //   $log.error(msg, code);
      });
      return deferred.promise;
    },
    scrollBottom: scrollBottom
  }
})
