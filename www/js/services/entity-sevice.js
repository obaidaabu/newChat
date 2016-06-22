appServices.factory('EntityService', function (ConfigurationService,$q) {
  var otherProfile = null;
  var messageToDeal = null;
  var messages = [];
  var deleteFromArray = function(array,item){
    for(var i=0; i<array.length;i++){
      if(array[i]._id == item._id) {
        array.splice(i,1);
      }
    }
  };
  var setProfile = function(user){
    otherProfile = user;
  }

  var getOtherProfile = function(){
    return otherProfile;
  }

  var setMessageDetails = function(message){
    messageToDeal = message;
  }

  var getMessageDetails = function(){
    return messageToDeal;
  }
  var checkUnreadMessages = function(){
    for(var i = 0; i< messages.length; i++){
      if(messages[i].readMessage === false){
        return true;
      }
    }
    return false;
  }
  var setMessages = function(snapshot){
    var deferred = $q.defer();
    var userDetails=ConfigurationService.UserDetails();
    angular.forEach(snapshot.val(), function (value, key) {
      var conversationId = key;
      if(value.messages){
        var messagesArray = Object.getOwnPropertyNames(value.messages);

        var lastMessageKey = messagesArray[messagesArray.length - 1];

        var lastMessage = value.messages[lastMessageKey].body;
        var lastSender = value.messages[lastMessageKey].sender;

        var createrId = conversationId.split("-")[0];

        var readMessage = false;
        if(value.read){
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
          //online: online,
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
    deferred.resolve(messages);
    return deferred.promise;
  }
  var getMessages = function(){
    return messages;
  }
  return {
    deleteFromArray : deleteFromArray,
    setProfile : setProfile,
    getOtherProfile: getOtherProfile,
    setMessageDetails : setMessageDetails,
    getMessageDetails: getMessageDetails,
    setMessages: setMessages,
    getMessages: getMessages,
    checkUnreadMessages: checkUnreadMessages
  };
});
