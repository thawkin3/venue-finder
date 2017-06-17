var app = angular.module('VenueFinder', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/venues',
			access: {restricted: false}
		})
		.when('/login', {
			controller: 'loginController',
			templateUrl:'javascripts/app/views/login.html',
			access: {restricted: false}
		})
		.when('/createAccount', {
			controller: 'createAccountController',
			templateUrl:'javascripts/app/views/createAccount.html',
			access: {restricted: false}
		})
		.when('/venues', {
			controller: 'venuesController',
			templateUrl:'javascripts/app/views/venues.html',
			access: {restricted: false}
		})
		.otherwise({ 
			redirectTo: '/venues',
			access: {restricted: false}
		});
});

app.run(function($rootScope, $location, $window, $route, AuthService) {

    // AUTHENTICATION
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    AuthService.getUserStatus()
	    .then(function () {
        	$rootScope.isLoggedIn = AuthService.isLoggedIn();
    		$rootScope.loggedInUser = AuthService.getUsername();
		    if (typeof next.access != 'undefined' && next.access.restricted && !AuthService.isLoggedIn()) {
    		// if (next.access.restricted && !AuthService.isLoggedIn()) {
    			$location.path('/login');
    			$route.reload();
    		}
    	});
    	
    });

    $rootScope.venues = [];
    $rootScope.search = {
    	location: "",
    	searchTerm: ""
    };

});