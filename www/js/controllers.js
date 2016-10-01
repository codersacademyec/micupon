angular.module('micupon.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('BusquedaCtrl', function($scope) {
    
})

.controller('MapaCtrl', ['$scope','$rootScope','$cordovaGeolocation','$ionicLoading', function(s,r,$cordovaGeolocation,$ionicLoading) {
  s.location = $cordovaGeolocation;
    s.mapCreated = function(map) {
        s.map = map;
    };
    s.iniciarMapa = function($element) {
        var mapOptions = {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        s.map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
        s.centrarMapa();
    }
    s.circulo = function(marker) {
                var sunCircle = {
                    strokeColor: "#62B2FC",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#62B2FC",
                    fillOpacity: 0.35,
                    map: s.map,
                    radius: s.radioBusqueda // in meters
                };
                if (s.cityCircle) {
                    s.cityCircle.setMap(null);
                }
                s.cityCircle = new google.maps.Circle(sunCircle);
                s.cityCircle.bindTo('center', marker, 'position');
            }
    s.centrarMapa = function() {
        /*$ionicLoading.show({
            template: 'Cargando...'
        });*/
        var options = {
            timeout: 30000,
            enableHighAccuracy: true
        };
        s.location.getCurrentPosition(options).then(function(position) {
            r.lat = position.coords.latitude;
            r.long = position.coords.longitude;
            var latLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            s.map.setCenter(latLong);
            s.map.setZoom(15);
            if (s.markerLocation) {
                s.markerLocation.setMap(null);
            }
            s.markerLocation = new google.maps.Marker({
                position: latLong,
                map: s.map
            });
            s.circulo(s.markerLocation);
            if (s.markerBusqueda) s.markerBusqueda.setMap(null);
            s.currPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            $ionicLoading.hide();

        }, function(error) {
            console.log(error.message);
        })
    }
}]);