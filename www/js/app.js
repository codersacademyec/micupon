angular.module('micupon', ['ionic', 'ngCordova', 'micupon.controllers', 'micupon.services'])
.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {

    var push = new Ionic.Push({
      "debug": true
    });
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
   
    push.register(function(token) {
      console.log("My Device token:",token.token);
      $rootScope.push_token = token.token;
      push.saveToken(token);  // persist the token in the Ionic Platform
    });

  });
})
.constant("socialProvider", ["facebook", "google"])
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
