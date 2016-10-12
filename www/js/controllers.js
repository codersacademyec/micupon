angular.module('micupon.controllers', [])

.controller('AppCtrl', function($ionicModal, AccountService, $state, $scope, $rootScope, $ionicLoading, $ionicPopup, socialProvider, $timeout) {

    $rootScope.loginData = {};
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $rootScope
    }).then(function(modal) {
        $rootScope.modal = modal;
    });
    $rootScope.closeLogin = function() {
        $rootScope.modal.hide();
    };
    $rootScope.showLogin = function() {
        $rootScope.modal.show();
    };
    $rootScope.login = function(i) {
        Stamplay.User.socialLogin(socialProvider[i])
    };

    $rootScope.logout = function() {
        $ionicLoading.show();
        var jwt = window.location.origin + "-jwt";
        window.localStorage.removeItem(jwt);
        AccountService.currentUser()
        .then(function(user) {
            $rootScope.user = user;
            $rootScope.showLogin();
            $ionicLoading.hide();
        }, function(error) {
            console.error(error);
            $ionicLoading.hide();
            $state.go($state.current, {}, {reload: true});
        })
    }
    $rootScope.user = {"_id":"57b7ac4fe1af8c0434720491","appId":"miparqueo","displayName":"Gonzalo Aller","name":{"familyName":"Aller","givenName":"Gonzalo"},"pictures":{"facebook":"https://graph.facebook.com/10210477627084919/picture"},"givenRole":"57af24c32e101f405ecebd4a","email":"gonzaller@me.com","identities":{"facebook":{"facebookUid":"10210477627084919","_json":{"timezone":-3,"first_name":"Gonzalo","last_name":"Aller","locale":"es_LA","picture":{"data":{"url":"https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13322155_10209828060006148_4865973369382732877_n.jpg?oh=44baf6b5e046137288fd83c114b491d0&oe=5856DB75","is_silhouette":false}},"link":"https://www.facebook.com/app_scoped_user_id/10210477627084919/","gender":"male","email":"gonzaller@me.com","age_range":{"min":21},"name":"Gonzalo Aller","id":"10210477627084919"},"emails":[{"value":"gonzaller@me.com"}],"accessToken":"EAAIjuROBonoBAPZA6EgZCsmhgJZC7OdA2sTOnDXxTijYRmMPpgCgn3eBx2p9msnBO6UZAGrM6HOZBDLxBqkSz16WeuWDvzKMiQCWAEXpNEpDDaNfd3FOabVQ1nZCo3xrZCfOD5MtgLy6Io8ZBArZCukjuj86T1dXzCSgZD"}},"__v":0,"dt_update":"2016-08-28T23:28:18.400Z","dt_create":"2016-08-20T01:03:11.170Z","emailVerified":true,"verificationCode":"907089e2acc08ad816d3","profileImg":"https://graph.facebook.com/10210477627084919/picture","id":"57b7ac4fe1af8c0434720491"};
    AccountService.currentUser()
    .then(function(user) {
        if (user || $rootScope.user) {
            $rootScope.user = user ? user : $rootScope.user;
            Stamplay.Object("usuarios").get({
                owner: $rootScope.user._id
            })
            .then(function(res) {
                $rootScope.user.perfil = res.data[0];
                Stamplay.Object("usuarios").patch($rootScope.user.perfil.id, {push_token:$rootScope.push_token})
                    .then(function(res) {
                      // success
                    }, function(err) {
                      // error
                    })
            }, function(err) {
                        // Error
                    });
        } else {
            $rootScope.showLogin();
        }
    })


})

.controller('BusquedaCtrl', ['$scope',function(s) {
    s.listado = [
    {nombre: 'Pizzería', imagen:'ico_comida1'},
    {nombre: 'Comida rápida', imagen:'ico_comida2'},
    {nombre: 'Rotisería', imagen:'ico_comida3'},
    {nombre: 'Desayunos', imagen:'ico_comida4'},
    {nombre: 'Restaurante', imagen:'ico_comida5'},
    {nombre: 'Sushi', imagen:'ico_comida6'},
    {nombre: 'Casa de té', imagen:'ico_comida7'},
    {nombre: 'Cervecería', imagen:'ico_comida8'},
    {nombre: 'Bares', imagen:'ico_comida9'}
    ];
}])
.controller('CuponesCtrl', ['$scope',function(s) {
    s.listado = [
    {nombre: 'Pizzería', imagen:'ico_comida1'},
    {nombre: 'Comida rápida', imagen:'ico_comida2'},
    {nombre: 'Rotisería', imagen:'ico_comida3'},
    {nombre: 'Desayunos', imagen:'ico_comida4'},
    {nombre: 'Restaurante', imagen:'ico_comida5'},
    {nombre: 'Sushi', imagen:'ico_comida6'},
    {nombre: 'Casa de té', imagen:'ico_comida7'},
    {nombre: 'Cervecería', imagen:'ico_comida8'},
    {nombre: 'Bares', imagen:'ico_comida9'}
    ];
}])
.controller('MapaCtrl', ['$scope','$rootScope','$cordovaGeolocation','$ionicLoading','$ionicPopup', function(s,r,$cordovaGeolocation,$ionicLoading,$ionicPopup) {
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
                    radius: 500 // in meters
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
            //r.lat= -0.205611; 
            //r.long= -78.485556;
            var latLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //var latLong = new google.maps.LatLng(r.lat, r.long);
            s.map.setCenter(latLong);
            s.map.setZoom(15);
            if (s.markerLocation) {
                s.markerLocation.setMap(null);
            }
            s.markerLocation = new google.maps.Marker({
                position: latLong,
                map: s.map,
                icon: 'img/UbicacionUsuario_.png'
            });
            s.circulo(s.markerLocation);
            if (s.markerBusqueda) s.markerBusqueda.setMap(null);
            s.currPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            s.consultarLocales(1500);
            $ionicLoading.hide();

        }, function(error) {
            console.log(error.message);
        })
    }

    s.localesCercanosMarker = [];
    s.nombreLocal =[];
    s.consultarLocales = function(dist) {
                $ionicLoading.show({
                    template: 'Buscando...'
                });
                Stamplay.Query('object', 'locales')
                    .near('Point', [s.currPos.lng, s.currPos.lat], dist)
                    .exec().then(function(res) {
                        s.localesCercanos = res.data;
                        s.removeLocalesMarkers();
                        for (var i = 0; i < res.data.length; i++) {
                            var coord = res.data[i]._geolocation.coordinates;
                            s.nombreLocal[i] = res.data[i].nombre;
                            console.log(i+" "+s.nombreLocal[i]);
                            s.localesCercanosMarker.push(new google.maps.Marker({
                                position: new google.maps.LatLng(coord[1], coord[0]),
                                map: s.map,
                                title: res.data[i].nombre,
                                array_pos: i
                            }));

                            s.localesCercanosMarker[i].addListener('click', function() {
                                s.localSeleccionado = s.localesCercanos[this.array_pos];
                                s.coord = s.localSeleccionado._geolocation.coordinates;
                                var contentString = '<div id="content">'+
                                  '<div id="siteNotice">'+
                                  '</div>'+
                                  '<b>'+s.localSeleccionado.nombre+'</b>'+
                                  '<p>'+'Comercio asociado MiCupon'+'</p>'+
                                  '<p>'+'Cupones disponibles: '+ '<b> 1 </b>'+'</p>'+
                                  '</div>';
                                var infowindow = new google.maps.InfoWindow({
                                content: contentString
                                });
                                console.log(this.array_pos);
                                infowindow.open(s.map, s.localesCercanosMarker[this.array_pos]);
                              });
                            
                        }
                        if(res.data.length > 0){
                            $ionicPopup.alert({
                             title: 'Se encontraron ofertas cercanas!',
                             buttons: [{
                                text: 'Aceptar',
                                type: 'button-positive'
                              }]
                           });
                        }

                        $ionicLoading.hide();
                    });
    }
    s.removeLocalesMarkers = function() {
                for (var i = 0; i < s.localesCercanosMarker.length; i++) {
                    s.localesCercanosMarker[i].setMap(null)
                }
                s.localesCercanosMarker = [];
    }
    s.checkDistance = function(lat1,lon1,lat2,lon2){
        var R = 6371; // km
        var dLat = (lat2-lat1)* (Math.PI / 180);
        var dLon = (lon2-lon1)* (Math.PI / 180);
        var lat1 = lat1* (Math.PI / 180);
        var lat2 = lat2* (Math.PI / 180);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    }
    s.coords = []
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady () {

    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    var callbackFn = function(location) {
        console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
        var latLong = new google.maps.LatLng(location.latitude, location.longitude);
        s.map.setCenter(latLong);
        if (s.markerLocation) {
                s.markerLocation.setMap(null);
            }
            s.markerLocation = new google.maps.Marker({
                position: latLong,
                map: s.map,
                icon: 'img/UbicacionUsuario_.png'
            });
            s.coords.push({lat:location.latitude,long:location.longitude})
            s.circulo(s.markerLocation);
            if(s.checkDistance(s.coords[0].lat,s.coords[0].long,location.latitude, location.longitude) >= 0.5){
                s.coords = [];
                s.currPos = {
                lat: location.latitude,
                lng: location.longitude
            };
                s.consultarLocales(500);
            }
        backgroundGeolocation.finish();
    };

    var failureFn = function(error) {
        console.log('BackgroundGeolocation error');
    };

    // BackgroundGeolocation is highly configurable. See platform specific configuration options
    backgroundGeolocation.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        interval: 60000
    });

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    // backgroundGeolocation.stop();
}
}]);
