appControllers.controller('subjectsCtrl', function ($scope, $state,$interval, $stateParams, $timeout, SubjectService, EntityService, UserService) {
  $scope.isExpanded = true;
  $scope.subjects = [];
  if (window.cordova && typeof window.plugins.OneSignal != 'undefined' && !window.localStorage['notification_token']) {
    $timeout(function () {
      window.plugins.OneSignal.getIds(function (ids) {

        UserService.RegisterNotification(ids.userId)
          .then(function (userToken) {
            window.localStorage['notification_token'] = userToken;
          }, function (err) {
          });
      });
    }, 5000)
  }
  $scope.doRefresh=function(){
    $scope.$broadcast('scroll.refreshComplete');
    SubjectService.GetSubjects(false)
      .then(function (subjects) {
        $scope.subjects = subjects;
      }, function (err) {
      });
  }
  var stopTime = $interval($scope.doRefresh, 10000);
  $scope.$on("$destroy", function() {
    if (stopTime) {
      $interval.cancel(stopTime);
    }
  });
  $scope.doRefresh();
  $scope.goToUserProfile = function (user) {
    EntityService.setProfile(user);
    $state.go("app.profile",{otherProfile: true});
  }


  $scope.goToChat = function (subject) {

    var userName = subject.user.first_name + " " + subject.user.last_name;
    var messageDetails = {
      conversationId: subject.user._id + "-" + subject._id,
      userName: userName,
      subjectName: subject.title,
      fbPhotoUrl: subject.user.fbPhotoUrl
    }
    EntityService.setMessageDetails(messageDetails);
    $state.go('app.chat')
  }
$scope.goToFilter=function(){
  $state.go('app.filter');
  }
  $scope.goToAddSubject=function(){
    $state.go('app.addSubject');
  }

})
appControllers.controller('addSubjectCtrl', function ($scope, $state, SubjectService, NoteDB, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {
  $scope.isExpanded=true;
  // initialForm is the first activity in the controller.
  // It will initial all variable data and let the function works when page load.
  $scope.subject = {};
  $scope.categories = [];

  $scope.initialForm = function () {

    $scope.subject = {
      title: '',
      user: window.localStorage['userId'],
      description: ''
    }
    SubjectService.GetCategories()
      .then(function (categories) {
        $scope.categories = categories;
      }, function (err) {
      });

    $scope.actionDelete = $stateParams.actionDelete;

    // $scope.note is the variable that store note detail data that receive form note list page.
    // Parameter :
    // $scope.actionDelete = status that pass from note list page.
    // $stateParams.contractdetail(object) = note data that user select from note list page.
    $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);

    // $scope.noteList is the variable that store data from NoteDB service.
    $scope.noteList = [];

  };// End initialForm.

  $scope.createSubject = function () {
    debugger
    $scope.subject.categories = [];
    for (var i = 0; i < $scope.categories.length; i++) {
      if ($scope.categories[i].isSelected) {
        $scope.subject.categories.push($scope.categories[i]._id);
      }
    }
      SubjectService.CreateSubject($scope.subject)
        .then(function () {
          $state.go("app.subjects");
        }, function (err) {
        });
  }

  //getNoteData is for get note detail data.
  $scope.getNoteData = function (actionDelete, noteDetail) {
    // tempNoteData is temporary note data detail.
    var tempNoteData = {
      id: null,
      title: '',
      detail: '',
      createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
    };

    // If actionDelete is true note Detail Page will show note detail that receive form note list page.
    // else it will show tempNoteData for user to add new data.
    return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
  };// End getNoteData.

  // showListBottomSheet is for showing the bottom sheet.
  // Parameter :
  // $event(object) = position of control that user tap.
  // noteForm(object) = note object that presenting on the view.
  $scope.showListBottomSheet = function ($event, noteForm) {

    $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

    $mdBottomSheet.show({
      templateUrl: 'contract-actions-template',
      targetEvent: $event,
      scope: $scope.$new(false),
    });
  };// End showing the bottom sheet.

  // validateRequiredField is for validate the required field.
  // Parameter :
  // form(object) = note object that presenting on the view.
  $scope.validateRequiredField = function (form) {
    return !(form.noteTitle.$error.required == undefined);
  };// End validate the required field.

  // saveNote is for save note.
  // Parameter :
  // note(object) = note object that presenting on the view.
  // $event(object) = position of control that user tap.
  $scope.saveNote = function (note, $event) {
    // $mdBottomSheet.hide() use for hide bottom sheet.
    $mdBottomSheet.hide();

    // mdDialog.show use for show alert box for Confirm to save data.
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      targetEvent: $event,
      locals: {
        displayOption: {
          title: "Confirm to save data?",
          content: "Data will save to Local Storage.",
          ok: "Confirm",
          cancel: "Close"
        }
      }
    }).then(function () {

      // For confirm button to save data.
      try {
        // To update data by calling  NoteDB.update($scope.note) service.
        if ($scope.actionDelete) {

          if ($scope.note.id == null) {
            $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
          }
          NoteDB.update($scope.note);
        } // End update data.

        // To add new data by calling NoteDB.insert(note) service.
        else {
          NoteDB.insert(note);
          $scope.noteList = NoteDB.selectAll();
          $scope.actionDelete = true;
        }// End  add new  data.

        // Showing toast for save data is success.
        $mdToast.show({
          controller: 'toastController',
          templateUrl: 'toast.html',
          hideDelay: 400,
          position: 'top',
          locals: {
            displayOption: {
              title: "Data Saved !"
            }
          }
        });//End showing toast.
      }
      catch (e) {
        // Showing toast for unable to save data.
        $mdToast.show({
          controller: 'toastController',
          templateUrl: 'toast.html',
          hideDelay: 800,
          position: 'top',
          locals: {
            displayOption: {
              title: window.globalVariable.message.errorMessage
            }
          }
        });// End showing toast.
      }

    }, function () {
      // For cancel button to save data.
    });// End alert box.
  };// End save note.

  // deleteNote is for remove note.
  // Parameter :
  // note(object) = note object that presenting on the view.
  // $event(object) = position of control that user tap.
  $scope.deleteNote = function (note, $event) {
    // $mdBottomSheet.hide() use for hide bottom sheet.
    $mdBottomSheet.hide();

    // mdDialog.show use for show alert box for Confirm to delete data.
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      targetEvent: $event,
      locals: {
        displayOption: {
          title: "Confirm to remove data?",
          content: "Data will remove from Local Storage.",
          ok: "Confirm",
          cancel: "Close"
        }
      }
    }).then(function () {
      // For confirm button to remove data.
      try {
        // Remove note by calling  NoteDB.delete(note) service.
        if ($scope.note.id == null) {
          $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
        }
        NoteDB.delete(note);
        $ionicHistory.goBack();
      }// End remove note.
      catch (e) {
        // Showing toast for unable to remove data.
        $mdToast.show({
          controller: 'toastController',
          templateUrl: 'toast.html',
          hideDelay: 800,
          position: 'top',
          locals: {
            displayOption: {
              title: window.globalVariable.message.errorMessage
            }
          }
        });//End showing toast.
      }

    }, function () {
      // For cancel button to remove data.
    });// End alert box.
  };// End remove note.

  $scope.initialForm();
});// End of Notes Detail Page  Controller.
appControllers.controller('filterCtrl', function ($scope, NoteDB,$state, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory,SubjectService) {

  $scope.saveFilter = function () {

    angular.forEach($scope.myFilter.categories, function (value, key) {
      if (!value) {
        delete $scope.myFilter.categories[key];
      }
    });
    window.localStorage["myFilter"] = angular.toJson($scope.myFilter);
    $state.go('app.subjects');
    //$state.go('app.subjects', {}, {reload: true});
    //$state.go('app.subjects');

  }
  // initialForm is the first activity in the controller.
  // It will initial all variable data and let the function works when page load.
  $scope.initialForm = function () {
    SubjectService.GetCategories()
      .then(function (categories) {
        $scope.categories = categories;
      }, function (err) {
      });

    if (!window.localStorage["myFilter"]) {
      $scope.myFilter = {
        nearMe: false,
        gender: 'both',
        categories: {}
      }
      window.localStorage["myFilter"] = angular.toJson($scope.myFilter);
    }
    else {
      $scope.myFilter = angular.fromJson(window.localStorage["myFilter"]);
    }
  };// End initialForm.
  $scope.initialForm();
});// End of Notes Detail Page  Controller.

