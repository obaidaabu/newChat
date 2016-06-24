appServices.factory('MessagesService', function($ionicScrollDelegate, $firebaseObject, ConfigurationService) {
  var messages = [];
  var userDetails = ConfigurationService.UserDetails();
  var ref = new Firebase("https://chatoi.firebaseio.com/chats/" + userDetails._id);
  ref.on("value", function (snapshot) {
    angular.forEach(snapshot.val(), function (value, key) {

      var conversationId = key;
      if (value.messages) {
        var messagesArray = Object.getOwnPropertyNames(value.messages);
        var lastMessageKey = messagesArray[messagesArray.length - 1];
        var lastMessage = value.messages[lastMessageKey].body;
        var createrId = conversationId.split("-")[0];

        var readMessage = false;
        if (value.read) {
          readMessage = value.read;
        }


        var indexx = common.indexOfConv(messages, conversationId);
        var msg = {
          conversationId: conversationId,
          lastMessage: lastMessage,
          lastMessageKey: lastMessageKey,
          subjectName: value.subjectName,
          fbPhotoUrl: value.fbPhotoUrl,
          userName: value.userName,
          readMessage: readMessage

        }

        if (indexx === -1) {
          messages.push(msg);
        }
        else {
          messages[indexx] = msg;

        }
        var userRef = new Firebase('https://chatoi.firebaseio.com/presence/' + createrId);
        userRef.on("value", function (userSnapshot) {

          var online = true;
          if (userSnapshot.val() == 'offline') {
            online = false;

          }

          var indexx = common.indexOfConv(messages, conversationId);

          messages[indexx].online = online

        });
      }

    });
  });

  return {
    getMessages: function () {
      return messages;
    }
  }
})
