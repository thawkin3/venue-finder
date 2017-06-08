(function() {

	var venuesController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// INITIALIZE THE VENUES ARRAY
		$scope.venues = [];

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotFindVenues = false;
		$scope.showErrorMessageNoVenuesMatch = false;
		$scope.showVenues = false;
		$scope.showLoadingGif = false;

		// FIND VENUES
		$scope.findVenues = function () {
			console.log("looking for venues!");
			if (typeof $scope.location == "undefined") {
				$scope.location = "";
			}
			if (typeof $scope.searchTerm == "undefined") {
				$scope.searchTerm = "";
			}

			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = true;
			$scope.showVenues = false;
			
			$http.get('/search?location=' + $scope.location + "&searchTerm=" + $scope.searchTerm).then(getVenuesSuccess, getVenuesError);
		};

		// SUCCESS
		function getVenuesSuccess (response) {
			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = true;
			// console.log(response.data);
			$scope.venues = response.data.businesses;
			if (typeof response.data.error != "undefined" || $scope.venues.length == 0) {
				$scope.showLoadingGif = false;
				$scope.showErrorMessageNoVenuesMatch = true;
			} else {
				$scope.showLoadingGif = false;
				$scope.showVenues = true;
			}
		}

		// ERROR
		function getVenuesError (response) {
			$scope.showErrorMessageCannotFindVenues = true;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = false;
			$scope.showVenues = false;
		}

	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('venuesController', venuesController);

}());