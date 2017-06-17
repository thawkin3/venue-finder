(function() {

	var venuesController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// HIDE ERROR MESSAGES BY DEFAULT
		$scope.showErrorMessageCannotFindVenues = false;
		$scope.showErrorMessageNoVenuesMatch = false;
		$scope.showVenues = $rootScope.venues.length > 0 ? true : false;
		$scope.showLoadingGif = false;

		// FIND VENUES
		$scope.findVenues = function () {
			console.log("looking for venues!");
			if (typeof $rootScope.search.location == "undefined") {
				$rootScope.search.location = "";
			}
			if (typeof $rootScope.search.searchTerm == "undefined") {
				$rootScope.search.searchTerm = "";
			}

			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = true;
			$scope.showVenues = false;
			
			$http.get('/search?location=' + $rootScope.search.location + "&searchTerm=" + $rootScope.search.searchTerm).then(getVenuesSuccess, getVenuesError);
		};

		// GET VENUES SUCCESS
		function getVenuesSuccess (response) {
			$scope.showErrorMessageCannotFindVenues = false;
			$scope.showErrorMessageNoVenuesMatch = false;
			$scope.showLoadingGif = true;
			// console.log(response.data);
			$rootScope.venues = response.data.businesses;
			$scope.getRsvps();
			if (typeof response.data.error != "undefined" || $rootScope.venues.length == 0) {
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
				for (var i = 0; i < $rootScope.venues.length; i++) {
					if ($rootScope.venues[i].id == response.data.venueID) {
						$rootScope.venues[i].rsvps.push(response.data.user);
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
			angular.forEach($rootScope.venues, function(venue, index) {
			    $http.get('/rsvp/' + venue.id)
			    .then(function(response) {
			        console.log(index);
			        console.log(response);
			        $rootScope.venues[index].rsvps = response.data;
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
					for (var i = 0; i < $rootScope.venues.length; i++) {
						if ($rootScope.venues[i].id == venueID) {
							$rootScope.venues[i].rsvps.splice($rootScope.venues[i].rsvps.indexOf($scope.username), 1);
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