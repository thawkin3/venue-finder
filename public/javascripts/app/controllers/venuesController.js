(function() {

	var venuesController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// INITIALIZE THE VENUES ARRAY
		$scope.venues = [];

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotFindVenues = false;

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
			console.log(response.data);
			$scope.venues = response.data.businesses;
		}

		// ERROR
		function getVenuesError (response) {
			$scope.showErrorMessageCannotFindVenues = true;
		}

	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('venuesController', venuesController);

}());