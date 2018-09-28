const MOCK_DATE = '2018-07-20'

app.controller('FlightController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', ($scope, $http, $state, $stateParams, $rootScope) => {
  const { flightCode } = $stateParams
  $scope.currentFlight = flightCode
  
  console.log(`FlightController loaded for ${flightCode}!`)

  $scope.loaded = false
  $scope.hasError = false
  $scope.init = function() {

    const flightDataPromise = new Promise((resolve, reject) => {
      $http.get(`./api/flight/${flightCode}`, { responseType: 'json' })
        .then(response => {
          const { from, to } = response.data

          $scope.from = from
          $scope.to = to

          resolve(true)
        })
        .catch(error => reject(error))
    })

    const mealPromise = new Promise((resolve, reject) => {
      $http.get(`./api/meal/date/${MOCK_DATE}/flight/${flightCode}`, { responseType: 'json' })
        .then(response => {
          const { mealUpliftPlan }= response.data

          // Only handle economy class for prototype
          const [ { containerUpliftInformation } ] = mealUpliftPlan.filter(plan => plan.bookingClass == 'Economy')

          $scope.meals = containerUpliftInformation
          resolve(true)
        })
        .catch(error => reject(error))
    })

  
    const updatePromises = [flightDataPromise, mealPromise]

    Promise.all(updatePromises).then(_ => {
      $scope.$apply(() => {
        $scope.loaded = true
      })
    }).catch(errors => {
      $scope.$apply(() => {
        $scope.loaded = true
        $scope.hasError = true
        $scope.errors = errors
      })
    })
  }
}])