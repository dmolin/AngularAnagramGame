/*global AG:true, angular:true */
AG = angular.module('AnagramGame', []);

AG.directive('hideon', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.hideon, function(value, oldValue) {
            if(value) {
                element.hide();
            } else {
                element.show();
            }
        }, true);
    };
});

/**
 * Main Controller
 */
AG.AnagramController = function AnagramGame($scope, $http) {

    $scope.input = { masterword:'' };
    $scope.masterword = "";
    $scope.error = "";

    var errorEl = $(".error-message");

    //let's get the actual status of the game (if any)
    $http.get("/anagram/config").success( function(data) {
        $scope.masterword = data.item.masterword;
        $scope.highscores = data.item.highscores;
        $('#app').fadeIn();
    });

    $scope.initMasterword = function() {
        $http.post('/anagram/init/' + $scope.input.masterword).success(function(){
            $scope.masterword = $scope.input.masterword;
            $scope.input.masterword = "";
            $scope.highscores = [];
            apply();
        });
    };

    $scope.toggleInitializer = function() {
        $('#initializer').slideToggle();
    };

    $scope.refreshHighscores = function() {
        $http.get("/anagram/highscores").success( function(data) {
            $scope.highscores = data.items;
            apply();
        });
    };

    $scope.submitWord = function() {
        if(!$scope.input.word || !$scope.input.word.length) {
            setErrorMessage("You must provide a word at least 1 character long");
            return;
        }
        clearErrorMessage();
        $http.post('/anagram/check/' + $scope.input.word).success(function(data) {
            $scope.input.word = "";
            if(data.result === "failure") {
                setErrorMessage(data.error);
            } else {
                //update scores
                $scope.refreshHighscores();
            }
        });
    };

    function apply() {
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function setErrorMessage(msg) {
        $scope.error = msg;
        errorEl.timer = setTimeout(function(){
            clearErrorMessage();
        }, 2000);
        apply();
    }
    function clearErrorMessage() {
        if(errorEl.timer) {
            clearTimeout(errorEl.timer);
            errorEl.timer = null;
        }
        $scope.error = "";
        apply();
    }
};