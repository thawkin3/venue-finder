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

		// FIND VENUES
		$scope.findVenues = function () {
			console.log("looking for venues!");
			var location = "Orem, UT";
			var term = "entertainment";
			$http.get('/search?location=' + location + "&searchTerm=" + term).then(getVenuesSuccess, getVenuesError);
		};

		// SUCCESS
		function getVenuesSuccess (response) {
			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			console.log(response.data);
			$scope.venues = response.data.businesses;
			if ($scope.venues.length == 0) {
				$scope.showErrorMessageNoVenuesMatch = true;
			} else {
				
				$scope.showVenues = true;

			}
		}

		// ERROR
		function getVenuesError (response) {
			$scope.showErrorMessageCannotFindVenues = true;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showVenues = false;
		}

	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('venuesController', venuesController);

}());