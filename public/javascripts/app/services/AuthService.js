angular.module('VenueFinder').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var loggedInUser = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUsername: getUsername,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn () {
      if (user) {
        return true;
      } else {
        return false;
      }
    }

    function getUsername () {
      return loggedInUser;
    }

    function getUserStatus () {
      return $http.get('/api/v1/users/status')
      // handle success
      .success(function (data) {
        if (data.status) {
          user = true;
        } else {
          user = false;
        }
        loggedInUser = data.username;
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login (username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/v1/users/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if (status === 200 && data.status) {
            user = true;
            loggedInUser = data.username;
            deferred.resolve();
          } else {
            user = false;
            loggedInUser = null;

            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          loggedInUser = null;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout () {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/v1/users/logout')
        // handle success
        .success(function (data) {
          user = false;
          loggedInUser = null;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          loggedInUser = null;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register (username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/v1/users/register',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if (status === 200 && data.status) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);