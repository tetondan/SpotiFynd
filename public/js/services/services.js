// these services can be loaded into any controller by including 'app.services' in the
// angular dependencies
angular.module('app.services',[])

// Include ActivitiesData in controller paramters to access these factory
// functions
.factory('ActivitiesData', function($http, $location){
  // data stores all of the service functions
  var data = {};
  data.searchedCity = {};
  data.cityCache = {};

  // <h4>data.getActivities</h4>
  // Function that sends a get request to /activities/`cityname`
  // and retrieves 30 foursquare top rated activities for the city
  // returns a promise
  data.updateUser = function(id, trips){
    return $http.put('/api/user/' + id, trips)
      .then(function(){
        console.log('updated trips')
      })
  }

  data.getActivities = function(city){
    //checks if the city has been searched before
    // if(data.searchedCity[city]){
    //   //sends a callback with the cache data
    //   return data.cityCache[city]
    // }
    //call get request to our server, with the city
    return $http.get('/api/activities/' + city)
    .then(function(results){
      //our server calls a get request to the foursquare api
      //posts it to our database
      //gets data back out of our database and returns it
      console.log('getActivities success data: ', results)
      data.searchedCity[city] = true;
      data.cityCache[city] = results;
      return results;
    })
    .catch(function(err){
      console.log("Error Getting Activity Data: ", err)
    })
  };

  // <h4>data.getTrips</h4>
  // Function that sends a get request to /trips and retrieves
  // all trips from the db
  data.getTrips = function(){
    return $http.get('/api/trips')
    .then(function(results){
      return results;
    })
    .catch(function(err){
      console.log("Error Getting User Trip Data: ", err)
    })
  };

  data.getUsersTrips = function(userId, callback){
    $http.get('/api/trips/' + userId)
    .then(function(results){
      //our server calls a get request to the foursquare api
      //posts it to our database
      //gets data back out of our database and returns it
      console.log('Trip Results for ' +userId +': ' + results)
      return results;
    })
    .catch(function(err){
      console.log("Error Getting User Trip Data: ", err)
    })
  };

  // <h4>data.getIndividualTrip</h4>
  // pulls an trip from the db with the tripId
  // sends get request to /trips/`tripId`
  data.getIndividualTrip = function(tripId){
    $http.get('/api/trips/' + tripId)
    .then(function(results){
      // server calls a get request to the foursquare api
      // posts it to our database
      // gets data back out of our database and returns it
      console.log('Trip Result for ' + tripId +': ' + results)
      callback(results);
    })
    .catch(function(err){
      console.log("Error Getting Individual Trip Data: ", err)
    })
  };

  // <h4>data.createTrip</h4>
  // creates a trip and stores it to the db
  data.createTrip = function(tripData){
    //tripData is a JSON object
    $http.post('/api/trips', tripData)
    .then(function(){
      console.log("Trip Created");
      $location.path('/myTrips');
    })
    .catch(function(err){
      console.log("Error Creating Trip: ", err);
    })
  };

  // <h4>data.getTripActivities</h4>
  // retrieves an object containing all activities and data related
  // to the trip id
  data.getTripActivities = function(id, cb){
    console.log(id, cb)
    return $http.get('/api/trips/' + id)
    .then(function(results){
      console.log('trip data: ', results)
     //our server calls a get request to the foursquare api
     //posts it to our database
     //gets data back out of our database and returns it
      cb(results);
    })
    .catch(function(err){
      console.log("Error Getting User Trip Data: ", err)
    })
  };

  data.getUser = function(id, callback){
    return $http.get('/api/user/' + id)
    .then(function(user){
      return user.data
    })
  }

  return data;
})



// this factory is for authentication which is not impemented in the app yet.
.factory('Auth', function($http, $location){
    var signUp = function (data) {
      return $http({
        method: 'POST',
        url: '/api/signup',
        data: data
      })
      .then(function (data) {
        window.localStorage.setItem('EQUIP_TOKEN', data.data._id);
        return data;
      })
    }

    var signIn = function (username, password) {
      var user = {
        username: username,
        password: password
      }
      return $http({
        method: 'POST',
        url: '/api/login',
        data: user
      })
      .then(function (data) {
        return data;
      })
      .catch(function (error) {
        console.log('problem', error);
      })
    }

    var logout = function () {
      window.localStorage.removeItem("EQUIP_TOKEN");
    }
  
    var isAuthorized = function () {
      if (localStorage.EQUIP_TOKEN) {
        return true;
      }
      return false;
    }

    return {
      logout: logout,
      signIn: signIn,
      signUp: signUp,
      isAuthorized: isAuthorized
    }


  // var auth = {};
  // auth.user = { password : '' };
  // auth.pass = '';

  // auth.clearPassword = function() {
  //   auth.user.password = '';
  //   auth.pass = '';
  // };

  // auth.login = function(user) {
  //   return $http.post('/api/login', user)
  //     .then(function(result){
  //       console.log("Auth Login Hit")
  //       if(result.data){
  //         console.log("login results", result)
  //         console.log("Username", user.username)
  //         auth.getUser(user.username)
  //         .then(function() {
  //           auth.clearPassword();
  //           $location.path("/myTrips");
  //         });
  //       } else {
  //         //stay on login
  //         var loginError = "Please Try Again"
  //         return loginError;
  //       }
  //     })
  // };

  // auth.signup = function(userData) {
  //   auth.pass = userData.password;
  //   return $http.post('/api/signup', userData)
  //   .then(function(result){
  //     if(Array.isArray(result.data)){
  //       var signUpError = "Username Taken";
  //       return signUpError;
  //     } else {
  //       auth.user = result.data;
  //       auth.user.password = auth.pass;
  //       auth.login(auth.user);
  //     }
  //     //redirect
  //   })
  // };

  // auth.getUser = function(username) {
  //   return $http.get('/api/user/'+ username)
  //   .then(function(result){
  //     console.log("Result of getUser", result.data)
  //     auth.user = result.data;
  //   })
  // };

  // return auth;
})

.factory('Fire', [
  '$http',
  '$firebaseArray',
  '$firebase',
  'FIREBASE_URI',
  function ($http, $firebaseArray, $firebase, FIREBASE_URI) {

    var ref = new Firebase(FIREBASE_URI);

    var getTripData = function (city) {
      var ref = new Firebase(FIREBASE_URI + 'tripData');

      $http({
        method: 'GET',
        url: "http://127.0.0.1:8080/api/activities " + 'hook it up Dan!'
      })
      .then(function (data) {
        ref.set(data)
      })
      return ref;
    }

    var addRoom = function () {
      var newRoom = ref.push({
        messages: [{user:'Spotifynd', message: 'Welcome!'}],
        itinirary: [],
        settings: {user: 'yywe', location: null}
      })
      return newRoom;
    }

    var addMessage = function (id) {
      // create a reference to the database where we will store our data
      //when we add a message we need to find the cu
      var ref = new Firebase(FIREBASE_URI + id + '/messages');

      return $firebaseArray(ref);
      
    }

    var addToPlaylist = function (id) {
      //
      var ref = new Firebase(FIREBASE_URI + id + '/playlist');

      return $firebaseArray(ref);
    }

    var getRoom = function (id) {
      var ref = new Firebase(FIREBASE_URI + id)
      return ref;
    }

    return {
      getRoom: getRoom,
      addRoom: addRoom,
      addMessage: addMessage,
      addToPlaylist: addToPlaylist,
      getTripData: getTripData
    }
}])