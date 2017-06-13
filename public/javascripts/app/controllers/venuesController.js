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

		// GET VENUES SUCCESS
		function getVenuesSuccess (response) {
			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = true;
			// console.log(response.data);
			$scope.venues = response.data.businesses;
			$scope.getRsvps();
			if (typeof response.data.error != "undefined" || $scope.venues.length == 0) {
				$scope.showLoadingGif = false;
				$scope.showErrorMessageNoVenuesMatch = true;
			} else {
				$scope.showLoadingGif = false;
				$scope.showVenues = true;
			}
		}

		// GET VENUES ERROR
		function getVenuesError (response) {
			$scope.showErrorMessageCannotFindVenues = true;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = false;
			$scope.showVenues = false;
		}


		// RSVP TO A VENUE
		$scope.rsvp = function (venueID) {
			console.log("rsvp'ing!");
			console.log(venueID);
			$http.post('/rsvp/' + venueID, 
				{
					venueID: venueID,
					user: $scope.username,
					timestamp: Date.now()
				}
			).then(rsvpSuccess, rsvpError);
		}

		// RSVP SUCCESS
		function rsvpSuccess (response) {
			console.log("rsvp success");
			console.log(response);
		}

		// RSVP ERROR
		function rsvpError (response) {
			console.log("rsvp error");
			console.log(response);
		}


		// GET ALL RSVPS
		$scope.getRsvps = function () {
			for (var i = 0; i < $scope.venues.length; i++) {
				$http.get('/rsvp/' + $scope.venues[i].id).then(getRsvpsSuccess(i), getRsvpsError);
			}
		}

		// GET RSVP SUCCESS
		function getRsvpsSuccess (venueNumber, response) {
			console.log("got rsvp success");
			console.log(venueNumber);
			console.log(response);
			// $scope.venues[venueNumber].rsvps = response.data;
		}

		// GET RSVP ERROR
		function getRsvpsError (response) {
			console.log("got rsvp error");
			console.log(response);
		}


	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('venuesController', venuesController);

}());