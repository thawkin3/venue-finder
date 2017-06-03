(function() {

	var venuesController = function ($scope, $routeParams, $rootScope, $http, $location) {

		// GET THE CURRENT USER'S USERNAME
		$scope.username = $rootScope.loggedInUser;

		// DEFAULT SORT VALUES
		$scope.sortVenuesBy = "distance";
		$scope.sortReverse = false;
		$scope.searchText = "";

		// VENUES TABLE SORTING
		$scope.changeSort = function (sortName) {
			if ($scope.sortVenuesBy == sortName) {
				$scope.sortReverse = !$scope.sortReverse;
			} else {
				$scope.sortVenuesBy = sortName;
				$scope.sortReverse = false;
			}
		}

		// VENUES TABLE FILTERING
		$scope.tableFilter = function (item, index) {
			if ($scope.searchText != "") {
				var searchString = $scope.searchText.toLowerCase();
				if (item.question.toLowerCase().indexOf(searchString) != -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
	};

	venuesController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location'];

	angular.module('VenueFinder')
	    .controller('allPollsController', allPollsController);

}());