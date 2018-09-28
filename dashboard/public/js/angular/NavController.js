
app.controller('NavController', ['$scope', '$http', '$state', '$rootScope', ($scope, $http, $state, $rootScope) => {
  console.log('NavController loaded!')

  $scope.flights = ['SQ336', 'SQ888']

  $scope.showFlight = function(flight) {
    if (flight === null) $state.go('overview')
    else $state.go('flight', { flightCode: flight })
  }

}])
