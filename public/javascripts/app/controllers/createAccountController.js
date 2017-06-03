(function() {

	var createAccountController = function ($scope, $routeParams, $rootScope, $http, $location, AuthService) {

		// HIDE ALL ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageMissingUsername = false;
		$scope.showErrorMessageUsernameTaken = false;
		$scope.showErrorMessageMissingPassword = false;
		$scope.showErrorMessageNonMatchingPasswords = false;

		// SUCCESS CALLBACK
		function userCreationSuccess () {
			console.log("user created!");
    		$scope.error = false;
            $scope.errorMessage = "";
	        $scope.disabled = false;
        	$scope.username = "";
        	$scope.password = "";
	        $scope.passwordSecond = "";
			$location.path("/login");
		}

		// ERROR CALLBACK
		function userCreationError () {
			console.log("username taken");
			$scope.error = true;
	        $scope.errorMessage = "Something went wrong!";
	        $scope.disabled = false;
	        $scope.username = "";
	        $scope.password = "";
	        $scope.passwordSecond = "";
			$scope.showErrorMessageUsernameTaken = true;
		}

		// VALIDATE IF A USER CAN BE CREATED WHEN THE FORM IS SUBMITTED
		// CREATE A USER IF YOU CAN
		$scope.createAccount = function () {
			$scope.showErrorMessageMissingUsername = false;
			$scope.showErrorMessageUsernameTaken = false;
			$scope.showErrorMessageMissingPassword = false;
			$scope.showErrorMessageNonMatchingPasswords = false;

			if ($scope.username == "" || $scope.username == undefined) {
				console.log("please enter a username");
				$scope.showErrorMessageMissingUsername = true;
			} else if ($scope.password == "" || $scope.password == undefined) {
				console.log("please enter a password");
				$scope.showErrorMessageMissingPassword = true;
			} else if ($scope.password != $scope.passwordSecond) {
				console.log("passwords do not match");
				$scope.showErrorMessageNonMatchingPasswords = true;
			} else {
				// initial values
			    $scope.error = false;
			    $scope.disabled = true;

			    // call register from service
			    AuthService.register($scope.username, $scope.password)
			    .then(userCreationSuccess, userCreationError);


				// $http.post('/api/v1/users/register',
				// 	{
				// 		username: $scope.username,
				// 		password: $scope.password
				// 	}
				// ).then(userCreationSuccess, userCreationError);
			}
		}

	};

	createAccountController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location', 'AuthService'];

	angular.module('VenueFinder')
	    .controller('createAccountController', createAccountController);

}());