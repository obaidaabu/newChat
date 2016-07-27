//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
var db = null; //Use for SQLite database.
window.globalVariable = {
  //custom color style variable
  color: {
    appPrimaryColor: "",
    dropboxColor: "#017EE6",
    facebookColor: "#3C5C99",
    foursquareColor: "#F94777",
    googlePlusColor: "#D73D32",
    instagramColor: "#517FA4",
    wordpressColor: "#0087BE"
  },// End custom color style variable
  startPage: {
    url: "/app/subjects",//Url of start page.
    state: "app.subjects"//State name of start page.
  },
  message: {
    errorMessage: "Technical error please try again later." //Default error message.
  },
  oAuth: {
    dropbox: "your_api_key",//Use for Dropbox API clientID.
    facebook: "your_api_key",//Use for Facebook API appID.
    foursquare: "your_api_key", //Use for Foursquare API clientID.
    instagram: "your_api_key",//Use for Instagram API clientID.
    googlePlus: "your_api_key",//Use for Google API clientID.
  },
  adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable


angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMaterial', 'angularMoment', 'ngMessages', 'ngCordova', 'firebase'])
  .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet,UserService, EntityService,$timeout,Firebase,ConfigurationService) {
    function getDefaultStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : " + appPrimaryColor + " !important; " +
        "   border-style            : none;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    }// End create custom defaultStyle

    // Create custom style for product view.
    function getProductStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : " + appPrimaryColor + " !important;" +
        "   border-style            : none;" +
        "   background-image        : url('img/background_cover_pixels.png') !important;" +
        "   background-size         : initial !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    }// End create custom style for product view.

    // Create custom style for contract us view.
    function getContractUsStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : transparent !important;" +
        "   border-style            : none;" +
        "   background-image        : none !important;" +
        "   background-position-y   : 4px !important;" +
        "   background-size         : initial !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    } // End create custom style for contract us view.

    // Create custom style for Social Network view.
    function getSocialNetworkStyle(socialColor) {
      return "" +
        ".material-background-nav-bar {" +
        "   background              : " + socialColor + " !important;" +
        "   border-style            : none;" +
        "} " +
        "md-ink-bar {" +
        "   color                   : " + socialColor + " !important;" +
        "   background              : " + socialColor + " !important;" +
        "}" +
        "md-tab-item {" +
        "   color                   : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
        "   border-left-color       : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
        "    border-top-color       : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-gap {" +
        "   border-top-color        : " + socialColor + " !important;" +
        "   border-bottom-color     : " + socialColor + " !important;" +
        "}" +
        "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
        "  border-right-color       : " + socialColor + " !important;" +
        " }" +
        ".spinner-android {" +
        "   stroke                  : " + socialColor + " !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                   : " + socialColor + " !important;" +
        "}" +
        "a.md-button.md-primary, .md-button.md-primary {" +
        "   color                   : " + socialColor + " !important;" +
        "}";
    }// End create custom style for Social Network view.


    function initialRootScope() {
      $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
      $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
      $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
    };

    function hideActionControl() {
      //For android if user tap hardware back button, Action and Dialog should be hide.
      $mdBottomSheet.cancel();
      $mdDialog.cancel();
    };


    // createCustomStyle will change a style of view while view changing.
    // Parameter :
    // stateName = name of state that going to change for add style of that page.
    function createCustomStyle(stateName) {
      var customStyle =
        ".material-background {" +
        "   background-color          : " + appPrimaryColor + " !important;" +
        "   border-style              : none;" +
        "}" +
        ".spinner-android {" +
        "   stroke                    : " + appPrimaryColor + " !important;" +
        "}";

      switch (stateName) {
        case "app.productList" :
        case "app.productDetail":
        case "app.productCheckout":
        case "app.clothShop" :
        case "app.catalog" :
          customStyle += getProductStyle();
          break;
        case "app.dropboxLogin" :
        case "app.dropboxProfile":
        case "app.dropboxFeed" :
          customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
          break;
        case "app.facebookLogin" :
        case "app.facebookProfile":
        case "app.facebookFeed" :
        case "app.facebookFriendList":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
          break;
        case "app.foursquareLogin" :
        case "app.foursquareProfile":
        case "app.foursquareFeed" :
          customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
          break;
        case "app.googlePlusLogin" :
        case "app.googlePlusProfile":
        case "app.googlePlusFeed" :
          customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
          break;
        case "app.instagramLogin" :
        case "app.instagramProfile":
        case "app.instagramFeed" :
          customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
          break;
        case "app.wordpressLogin" :
        case "app.wordpressFeed":
        case "app.wordpressPost" :
          customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
          break;
        case "app.contractUs":
          customStyle += getContractUsStyle();
          break;
        default:
          customStyle += getDefaultStyle();
          break;
      }
      return customStyle;
    }// End createCustomStyle

    // Add custom style while initial application.
    $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);
    $ionicPlatform.on('pause', function() {
      Firebase.goOffline();

    });
    $ionicPlatform.on('resume', function() {
      Firebase.goOnline();

    });
    $ionicPlatform.ready(function () {
      //ionic.Platform.isFullScreen = true;

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      //var messageDetails = {
      //  conversationId: "575f27a54c5c031100d2d9ff-578fc2e1dc2c8b1100078962",
      //  userName: "Yohana Khoury",
      //  subjectName: "ggg",
      //  fbPhotoUrl:"https://scontent.xx.fbcdn.net/v/t1.0-1/p480x480/10514725_10152127260155566_3423545955096845695_n.jpg?oh=cfdb018d3812e7ad3b1f80c36971a82e&oe=57EE3104"
      //}
      //EntityService.setMessageDetails(messageDetails);
      //$timeout(function(){
      //  $state.go("app.chat");
      //},3000)

      if(window.cordova && typeof window.plugins.OneSignal != 'undefined'){
        var notificationOpenedCallback = function (jsonData) {

          var messageDetails = {
            conversationId: jsonData.additionalData.conversationId,
            userName: jsonData.additionalData.userName,
            subjectName: jsonData.additionalData.subjectName,
            fbPhotoUrl: jsonData.additionalData.fbPhotoUrl
          }
          EntityService.setMessageDetails(messageDetails);
          $timeout(function(){
            $state.go("app.chat");
          },3000)


        };
        window.plugins.OneSignal.init("ee6f85c1-a2ff-4d1b-9fa6-29dd4cc306ef",
          { googleProjectNumber: "238478083352" },
          notificationOpenedCallback);
        window.plugins.OneSignal.enableNotificationsWhenActive(false);
      }
      //window.localStorage.clear();
      var user=ConfigurationService.UserDetails();
      if (user) {
        UserService.CheckUser()
          .then(function (user) {
            if(user.isNeedLogin === false){

              var ref = new Firebase("https://chatoi.firebaseio.com");

              ref.authWithCustomToken(user.fireToken, function (error, authData) {

                if (error) {
                  console.log("Login Failed!", error);
                } else {
                  $state.go("app.subjects");
                }
              });
            }
            else{
              $state.go("login");
            }
          }, function (err) {
            $state.go("login");
          });
      }else{
        $state.go("login");
      }
      //initialSQLite();
      initialRootScope();

      //Checking if view is changing it will go to this function.
      $rootScope.$on('$ionicView.beforeEnter', function () {
        //hide Action Control for android back button.
        hideActionControl();
        // Add custom style ti view.
        $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
      });
    });

  })
  .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $mdColorPalette, $mdIconProvider) {


    // Use for change ionic spinner to android pattern.
    $ionicConfigProvider.spinner.icon("android");
    $ionicConfigProvider.views.swipeBackEnabled(false);

    // mdIconProvider is function of Angular Material.
    // It use for reference .SVG file and improve performance loading.
    $mdIconProvider
      .icon('facebook', 'img/icons/facebook.svg')
      .icon('twitter', 'img/icons/twitter.svg')
      .icon('mail', 'img/icons/mail.svg')
      .icon('message', 'img/icons/message.svg')
      .icon('share-arrow', 'img/icons/share-arrow.svg')
      .icon('more', 'img/icons/more_vert.svg');

    //mdThemingProvider use for change theme color of Ionic Material Design Application.
    /* You can select color from Material Color List configuration :
     * red
     * pink
     * purple
     * purple
     * deep-purple
     * indigo
     * blue
     * light-blue
     * cyan
     * teal
     * green
     * light-green
     * lime
     * yellow
     * amber
     * orange
     * deep-orange
     * brown
     * grey
     * blue-grey
     */
    //Learn more about material color patten: https://www.materialpalette.com/
    //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
    $mdThemingProvider
      .theme('default')
      .primaryPalette('indigo')
      .accentPalette('indigo');

    appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

    //$stateProvider is using for add or edit HTML view to navigation bar.
    //
    //Schema :
    //state_name(String)      : Name of state to use in application.
    //page_name(String)       : Name of page to present at localhost url.
    //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
    //html_file_path(String)  : Path of html file.
    //controller_name(String) : Name of Controller.
    //
    //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
    //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
    $stateProvider
      .state('app', {
        url: "/app",
        cache: false,
        abstract: true,
        templateUrl: "templates/menu/html/menu.html",
        controller: 'menuCtrl'
      })
      .state('login', {
        url: "/login",
        params: {
          isAnimated: false
        },
        templateUrl: "templates/login/html/login.html",
        controller: "loginCtrl"

      })
      .state('app.subjects', {
        url: "/subjects",
        cache: false,
        params: {
          isAnimated: false

        },
        views: {
          'menuContent': {
            templateUrl: "templates/subjects/html/subjects.html",
            controller: "subjectsCtrl"
          }
        }
      })
      .state('app.messages', {
        url: "/messages",
        cache: false,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/messages/html/messages.html",
            controller: "messagesCtrl"
          }
        }
      })
      .state('app.addSubject', {
        url: "/addSubject",
        cache: false,
        params: {
          noteDetail: null,
          actionDelete: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/subjects/html/add-subject.html",
            controller: 'addSubjectCtrl'
          }
        }
      }).state('app.filter', {
        url: "/filter",
      cache: false,
        params: {
          noteDetail: null,
          actionDelete: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/subjects/html/filter.html",
            controller: 'filterCtrl'
          }
        }
      }).state('app.blockedUsers', {
        url: "/blockedUsers",
      cache: false,
        params: {
          noteDetail: null,
          actionDelete: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/blockedUsers/html/blockedUsers.html",
            controller: 'blockedUsersCtrl'
          }
        }
      })
      .state('app.chat', {
        url: "/chat",
        cache: false,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/chat/html/chat.html",
            controller: "chatCtrl"
          }
        }
      })
      //.state('app.profile', {
      //  url: "/profile",
      //  params:{
      //    isAnimated:true
      //  },
      //  views: {
      //    'menuContent': {
      //      templateUrl: "templates/themes/profile/html/profile.html",
      //      controller: "expenseDashboardCtrl"
      //    }
      //  }
      //})
      .state('app.myProfile', {
        url: "/myProfile",
        cache: false,
        params: {
          isAnimated: false,
          userId: ''
        },
        views: {
          'menuContent': {
            templateUrl: "templates/themes/myProfile/html/myProfile.html",
            controller: "myProfileCtrl"
          }
        }
      })
      .state('app.userProfile', {
        url: "/userProfile/:userId/:first_name",
        cache: false,
        params: {
          isAnimated: false,
          userId: '',
          first_name: ''
        },
        views: {
          'menuContent': {
            templateUrl: "templates/themes/userProfile/html/userProfile.html",
            controller: "userProfileCtrl"
          }
        }
      })
  });
