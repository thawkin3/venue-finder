(function() {

	var loginController = function ($scope, $routeParams, $rootScope, $location, AuthService) {

		$scope.goToCreateAccount = function () {
			$location.path("/createAccount");
		}

		$scope.login = function () {

		    // initial values
		    $scope.error = false;

		    // call login from service
		    AuthService.login($scope.username, $scope.password)
	        // handle success
	        .then(function () {
	        	$scope.error = false;
	        	$scope.errorMessage = "";
	        	$scope.username = "";
	        	$scope.password = "";
	        	// console.log(AuthService.isLoggedIn());
	        	// console.log(AuthService.getUsername());
	        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
	        	$rootScope.loggedInUser = AuthService.getUsername();
	        	$location.path("/venues");
	        })
	        // handle error
	        .catch(function () {
	        	$scope.error = true;
	        	$scope.errorMessage = "Invalid username and/or password";
	        	$scope.username = "";
	        	$scope.password = "";
	        });

		};

	};

	loginController.$inject = ['$scope', '$routeParams', '$rootScope', '$location', 'AuthService'];

	angular.module('VenueFinder')
	    .controller('loginController', loginController);

}());