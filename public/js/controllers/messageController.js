angular.module('app.message', ['app.services'])
  .controller('messageController', function($scope, ActivitiesData){
    $scope.messages = [
      {
        text: 'looks like a cool place',
        from: 'Dan'
      },
      {
        text: 'will it be too cold?',
        from: 'Marlon'
      },
      {
        text: 'Nah just bring a coat',
        from: 'Zach'
      },
      {
        text: 'Should I bring an umbrella',
        from: 'Devin'
      }
    ]

    $scope.addMessage = function(message){
      $scope.messages.push(message);
    }

  })