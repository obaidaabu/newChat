appServices.factory('SubjectService', function ($http, $log, $q, ConfigurationService,$cordovaGeolocation) {
  return {
    GetCategories: function () {
      var deferred = $q.defer();
      $http.get(ConfigurationService.ServerUrl() + '/api/subjects/categories' , {
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
    GetSubjects: function (userSubjects,userId) {
      var deferred = $q.defer();
      if(userId == undefined){
        userId = null;
      }
      var myFilter={};
      if(window.localStorage["myFilter"]) {
        myFilter=angular.fromJson(window.localStorage["myFilter"]);
      }
      else {
        myFilter = {
          nearMe: false,
          gender: 'both',
          categories: {}
        }
        window.localStorage["myFilter"]=angular.toJson(myFilter);
      }
      if(myFilter.nearMe) {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            myFilter.locationCoords=[lat,long];
            tryPost();
          }, function (err) {
            myFilter.locationCoords=[];
            tryPost();
            // error
          });
      }
      else
      {
        myFilter.locationCoords=[];
        tryPost();
      }
      myFilter.categories= Object.keys(myFilter.categories);
      function tryPost() {
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects/filter?userSubjects=' + userSubjects + '&userId=' + userId, myFilter, {
          headers: {
            "access-token": ConfigurationService.UserDetails().token
          }
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
      }
      return deferred.promise;
    },
    GetMySubjects: function (userId) {
      var deferred = $q.defer();
      if(userId == undefined){
        userId = null;
      }
        tryPost();
      function tryPost() {
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects/filter?userSubjects=true&userId=' + userId,{}, {
          headers: {
            "access-token": ConfigurationService.UserDetails().token
          }
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
      }
      return deferred.promise;
    },
    CreateSubject: function (subject) {
      var deferred = $q.defer();
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          subject.locationCoords=[lat,long];
          tryPost();
        }, function (err) {
          subject.locationCoords=[];
          tryPost();
          // error
        });
      function tryPost() {

        $http.post(ConfigurationService.ServerUrl() + '/api/subjects',
          subject
          , {
            headers: {
              "access-token": ConfigurationService.UserDetails().token
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            //   $log.error(msg, code);
          });
      }
      return deferred.promise;
    },
    DeleteSubjects: function (subject) {
      var deferred = $q.defer();
      $http.delete(ConfigurationService.ServerUrl() + '/api/subjects?_id='+ subject._id, {
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
    }
  }
})
