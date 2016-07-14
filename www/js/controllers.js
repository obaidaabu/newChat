var appControllers = angular.module('starter.controllers', []); // Use for all controller of application.
var appServices = angular.module('starter.services', []);// Use for all service of application.

appControllers.controller('NewMessagesCtrl', function ($scope, MessagesService) {

  $scope.checkUndreadMessage = function(){

    return MessagesService.checkUndreadMessage();
  }
});
