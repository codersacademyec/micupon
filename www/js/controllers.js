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
                    $state.go($state.current, {}, {
                        reload: true
                    });
                })
        }
        /*$rootScope.user = {
  "_id": "580425362f32a04d67ba1cdf",
  "apellido": "ramirez",
  "edad": "",
  "email": "cvramirezespinoza@gmail.com",
  "nombre": "carlos",
  "sexo": "",
  "owner": "580424f6852f8c2c473856ec",
  "appId": "micupon",
  "cobjectId": "usuarios",
  "actions": {
    "comments": [],
    "ratings": {
      "users": [],
      "avg": 0,
      "total": 0
    },
    "votes": {
      "users_downvote": [],
      "users_upvote": [],
      "users": [],
      "total": 0
    }
  },
  "dt_update": "2016-11-09T00:55:10.779Z",
  "dt_create": "2016-10-17T01:11:18.798Z",
  "push_token": "e3bffa77b7b2ffe62dbb1f4a522d285d7c32abd7afd249857f388e8f69589310",
  "id": "580425362f32a04d67ba1cdf"
}

;*/
    AccountService.currentUser()
        .then(function(user) {
            if (user || $rootScope.user) {
                $rootScope.user = user ? user : $rootScope.user;
                Stamplay.Object("usuarios").get({
                        owner: $rootScope.user._id
                    })
                    .then(function(res) {
                        $rootScope.user.perfil = res.data[0];
                        Stamplay.Object("usuarios").patch($rootScope.user.perfil.id, {
                                push_token: $rootScope.push_token
                            })
                            .then(function(res) {
                                // success
                            }, function(err) {
                                // error
                            })
                    }, function(err) {
                        // Error
                    });
            } else {
                $state.go('app.mapa', {}, {
                        reload: true
                    });
                $rootScope.showLogin();
            }
        });


})

.controller('BusquedaCtrl', ['$scope', function(s) {
        s.listado = [{
            nombre: 'Pizzería',
            imagen: 'ico_comida1'
        }, {
            nombre: 'Comida rápida',
            imagen: 'ico_comida2'
        }, {
            nombre: 'Rotisería',
            imagen: 'ico_comida3'
        }, {
            nombre: 'Desayunos',
            imagen: 'ico_comida4'
        }, {
            nombre: 'Restaurante',
            imagen: 'ico_comida5'
        }, {
            nombre: 'Sushi',
            imagen: 'ico_comida6'
        }, {
            nombre: 'Casa de té',
            imagen: 'ico_comida7'
        }, {
            nombre: 'Cervecería',
            imagen: 'ico_comida8'
        }, {
            nombre: 'Bares',
            imagen: 'ico_comida9'
        }];
    }])
    .controller('CuponesCtrl', ['$scope', function(s) {
        s.listado = [{
            nombre: 'Pizzería',
            imagen: 'ico_comida1'
        }, {
            nombre: 'Comida rápida',
            imagen: 'ico_comida2'
        }, {
            nombre: 'Rotisería',
            imagen: 'ico_comida3'
        }, {
            nombre: 'Desayunos',
            imagen: 'ico_comida4'
        }, {
            nombre: 'Restaurante',
            imagen: 'ico_comida5'
        }, {
            nombre: 'Sushi',
            imagen: 'ico_comida6'
        }, {
            nombre: 'Casa de té',
            imagen: 'ico_comida7'
        }, {
            nombre: 'Cervecería',
            imagen: 'ico_comida8'
        }, {
            nombre: 'Bares',
            imagen: 'ico_comida9'
        }];
    }])
    .controller('MiscuponesCtrl', ['$scope', '$rootScope', '$ionicLoading', function(s, r, $ionicLoading) {
        s.listado = [];
        s.$on('$ionicView.afterEnter', function() {
            s.refresh();
        });
        s.refresh = function() {
            if (r.user) {
                $ionicLoading.show({
                    template: 'Buscando...'
                });
                Stamplay.Object("cupones_usuarios")
                    .get({
                        usuario: r.user._id,
                        populate: true
                    })
                    .then(function(res) {
                        s.resp = res.data[0].codigos;
                        s.listado = [];
                        for (var i = 0; i < s.resp.length; i++) {
                            s.listado.push({
                                titulo: s.resp[i].titulo,
                                imagen: s.resp[i].nombre_img,
                                promocion: s.resp[i].promocion
                            });
                        }
                        $ionicLoading.hide();
                        s.$broadcast('scroll.refreshComplete');
                    }, function(err) {
                        $ionicLoading.hide();
                    });
            }
        };
        s.refresh();
    }])
    .controller('MapaCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$ionicLoading', '$ionicPopup', '$http', function(s, r, $cordovaGeolocation, $ionicLoading, $ionicPopup, $http) {
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
                s.markerLocation = new CustomMarker(
                    latLong,
                    s.map, {});
                s.circulo(s.markerLocation);
                if (s.markerBusqueda) s.markerBusqueda.setMap(null);
                s.currPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                s.consultarLocales(500);
                $ionicLoading.hide();

            }, function(error) {
                console.log(error.message);
            })
        }

        s.localesCercanosMarker = [];
        s.nombreLocal = [];


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
                        console.log(i + " " + s.nombreLocal[i]);
                        s.localesCercanosMarker.push(new google.maps.Marker({
                            position: new google.maps.LatLng(coord[1], coord[0]),
                            map: s.map,
                            title: res.data[i].nombre,
                            array_pos: i
                        }));

                        s.localesCercanosMarker[i].addListener('click', function() {
                            s.localSeleccionado = s.localesCercanos[this.array_pos];
                            s.coord = s.localSeleccionado._geolocation.coordinates;
                            var contentString = '<div id="content">' +
                                '<div id="siteNotice">' +
                                '</div>' +
                                '<b>' + s.localSeleccionado.nombre + '</b>' +
                                '<p>' + 'Comercio asociado MiCupon' + '</p>' +
                                '<p>' + 'Cupones disponibles: ' + '<b> 1 </b>' + '</p>' +
                                '</div>';
                            var infowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            console.log(this.array_pos);
                            infowindow.open(s.map, s.localesCercanosMarker[this.array_pos]);
                        });

                    }
                    if (res.data.length > 0) {
                        $ionicPopup.alert({
                            title: 'Se encontraron ofertas cercanas!',
                            buttons: [{
                                text: 'Aceptar',
                                type: 'button-positive'
                            }]
                        });
                        $http.post('https://micupon.stamplayapp.com/api/codeblock/v1/run/pushcercanos', {
                            "token": r.push_token,
                            "mensaje": "Se encontraron ofertas cercanas!"
                        });
                    }

                    $ionicLoading.hide();
                });
        };
        s.sendPush = function() {
            console.log('enviando push');
            $http.post('https://micupon.stamplayapp.com/api/codeblock/v1/run/pushcercanos', {
                "token": r.push_token,
                "mensaje": "test push"
            });
        };

        s.removeLocalesMarkers = function() {
            for (var i = 0; i < s.localesCercanosMarker.length; i++) {
                s.localesCercanosMarker[i].setMap(null)
            }
            s.localesCercanosMarker = [];
        }
        s.checkDistance = function(lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = (lat2 - lat1) * (Math.PI / 180);
            var dLon = (lon2 - lon1) * (Math.PI / 180);
            var lat1 = lat1 * (Math.PI / 180);
            var lat2 = lat2 * (Math.PI / 180);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }
        s.coords = []
        document.addEventListener('deviceready', onDeviceReady, false);

        function onDeviceReady() {

            /**
             * This callback will be executed every time a geolocation is recorded in the background.
             */
            var callbackFn = function(location) {
                console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
                var latLong = new google.maps.LatLng(location.latitude, location.longitude);

                //s.sendPush();
                s.map.setCenter(latLong);
                if (s.markerLocation) {
                    s.markerLocation.setMap(null);
                }
                s.markerLocation = new CustomMarker(
                    latLong,
                    s.map, {});
                s.coords.push({
                    lat: location.latitude,
                    long: location.longitude
                })
                s.circulo(s.markerLocation);
                console.log('Chequea distancia 50 metros');
                if (s.checkDistance(s.coords[0].lat, s.coords[0].long, location.latitude, location.longitude) >= 0.05) {
                    console.log('Distancia verificada >0.05');
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

function CustomMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {

    var self = this;

    var div = this.div;

    if (!div) {
        var template = document.createElement('template');
        template.innerHTML = '<div class="ch-container"><div class="ch-item"></div><div class="ch-middle"></div></div>';
        div = this.div = template.content.firstChild;
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.width = '20px';
        div.style.height = '20px';
        if (typeof(self.args.marker_id) !== 'undefined') {
            div.dataset.marker_id = self.args.marker_id;
        }
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

    if (point) {
        div.style.left = (point.x - 10) + 'px';
        div.style.top = (point.y - 20) + 'px';
    }
};

CustomMarker.prototype.remove = function() {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }
};

CustomMarker.prototype.getPosition = function() {
    return this.latlng;
};