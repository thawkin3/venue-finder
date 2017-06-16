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
			if ($rootScope.isLoggedIn) {
				console.log("rsvp'ing!");
				console.log(venueID);
				$http.post('/rsvp/' + venueID, 
					{
						venueID: venueID,
						user: $scope.username,
						timestamp: Date.now()
					}
				).then(rsvpSuccess, rsvpError);
			} else {
				$location.path("/login");
			}
		}

		// RSVP SUCCESS
		function rsvpSuccess (response) {
			if (response.data.status != "already rsvp'd") {
				for (var i = 0; i < $scope.venues.length; i++) {
					if ($scope.venues[i].id == response.data.venueID) {
						$scope.venues[i].rsvps.push(response.data.user);
						break;					
					}
				}
			}
		}

		// RSVP ERROR
		function rsvpError (response) {
			console.log("rsvp error");
			console.log(response);
		}


		// GET ALL RSVPS
		$scope.getRsvps = function () {
			angular.forEach($scope.venues, function(venue, index) {
			    $http.get('/rsvp/' + venue.id)
			    .then(function(response) {
			        console.log(index);
			        console.log(response);
			        $scope.venues[index].rsvps = response.data;
			    }, function(response) {
			        console.log(response);
			    });
			});
		}


		// REMOVE YOUR RSVP FOR A VENUE
		$scope.removeRsvp = function (venueID) {
			if ($rootScope.isLoggedIn) {
				console.log("removing your rsvp");
				console.log(venueID);
				$http.delete('/rsvp/' + venueID + "/" + $scope.username)
				.then(function (response) {
					console.log(response);
					for (var i = 0; i < $scope.venues.length; i++) {
						if ($scope.venues[i].id == venueID) {
							$scope.venues[i].rsvps.splice($scope.venues[i].rsvps.indexOf($scope.username), 1);
							break;					
						}
					}
				}, function (response) {
					console.log("remove rsvp error");
					console.log(response);
				});
			} else {
				$location.path("/login");
			}
		}

	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('venuesController', venuesController);

}());