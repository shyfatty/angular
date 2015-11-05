var app = angular.module('myApp',[]);

app.run(function($rootScope){
    $rootScope.name = 'Ari Lener111';
});

app.controller('MyController',function($scope){
    $scope.person = {
        name:$scope.name
    }
});

app.controller("PlayerController",['$scope',function($scope){
    $scope.playing = false;
    $scope.audio = document.createElement('audio');
    $scope.audio.src = '../media/npr.mp3';

    $scope.play = function(){
        $scope.audio.play();
        $scope.playing = true;
    };
    $scope.stop = function(){
        $scope.audio.pause();
        $scope.playing = false;
    };
    $scope.audio.addEventListener('ended',function(){
        $scope.$apply(function(){
            $scope.stop();
        });
    })
}]);

app.controller("RelatedController",['$scope',function($scope){

}]);
$http({
        method: 'JSONP',
        url: 'http://api.openbeerdatabase.com/v1/beers.json?callback=JSON_CALLBACK'
    })
    .success(function(data, status, headers, config){})
    .error(function(data, status, headers, config) {});