// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('micupon', ['ionic','ngCordova', 'micupon.controllers', 'micupon.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    window.plugins.OneSignal
    .startInit("9c796239-b48c-4e56-a37a-76849a47dc6d", "")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.mapa', {
    url: '/mapa',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapa.html',
        controller: 'MapaCtrl'
      }
    }
  })
  .state('app.busqueda', {
    url: '/busqueda',
    views: {
      'menuContent': {
        templateUrl: 'templates/busqueda.html',
        controller: 'BusquedaCtrl'
      }
    }
  })
  .state('app.cupones', {
    url: '/cupones',
    views: {
      'menuContent': {
        templateUrl: 'templates/cupones.html',
        controller: 'CuponesCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/mapa');
})
 .directive('map', function() {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&',
                initFunct: '&'
            },
            link: function($scope, $element, $attr) {
                function initialize() {
                    $scope.initFunct();
                }
                if (document.readyState === "complete") {
                    initialize();
                } else {
                    google.maps.event.addDomListener(window, 'load', initialize);
                }
            }
        }
    });
