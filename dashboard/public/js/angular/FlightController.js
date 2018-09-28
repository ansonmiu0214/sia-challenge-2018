const MOCK_DATE = '2018-07-20'

app.controller('FlightController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', ($scope, $http, $state, $stateParams, $rootScope) => {
  const { flightCode } = $stateParams
  $scope.currentFlight = flightCode
  
  console.log(`FlightController loaded for ${flightCode}!`)

  $scope.loaded = false
  $scope.hasError = false
  $scope.mealSelected = null
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

    const wastePromise = new Promise((resolve, reject) => {
      $http.get(`./api/waste/date/${MOCK_DATE}/flight/${flightCode}`, { responseType: 'json' })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })

    const mealPromise = new Promise((resolve, reject) => {
      $http.get(`./api/meal/date/${MOCK_DATE}/flight/${flightCode}`, { responseType: 'json' })
        .then(response => {
          const { mealUpliftPlan }= response.data

          // Only handle economy class for prototype
          const [ { containerUpliftInformation } ] = mealUpliftPlan.filter(plan => plan.bookingClass == 'Economy')

          $scope.meals = containerUpliftInformation
          $scope.wastage = {}

          for (let meal of $scope.meals) {
            $scope.wastage[meal.mealCode] = {}
          }

          wastePromise.then(data => {
            for (let entry of data) {
              const { mealCode, wastage } = entry

              for (let waste of wastage) {
                const { foodName, percentage } = waste

                if (!(foodName in $scope.wastage[mealCode])) {
                  $scope.wastage[mealCode][foodName] = percentage
                } else {
                  $scope.wastage[mealCode][foodName] += percentage
                }
              }
            }

            resolve(true)
          }).catch(error => reject(error))
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
        $scope.hasError = true
        $scope.loaded = true
        $scope.errors = errors
      })
    })
  }

  $scope.updateChart = function(mealCode) {
    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';
    
    const ctx = document.querySelector('#myPieChart')
    const wastageObject = $scope.wastage[mealCode]
    
    $scope.chartLabels = Object.keys(wastageObject)
    $scope.chartData = Object.values(wastageObject)

    if ($scope.chart === undefined) { 
      $scope.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: $scope.chartLabels, // classifiers
          datasets: [
            {
              data: $scope.chartData, // percentages
              backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'] //
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'What wasted the most?'
          }
        }
      })
    } else {
      $scope.chart.data.labels = $scope.chartLabels
      $scope.chart.data.datasets[0].data = $scope.chartData
      $scope.chart.update()
    }
  }

  $scope.selectMeal = function(meal) {
    $scope.mealSelected = meal
    setTimeout(() => $scope.updateChart(meal.mealCode), 500)
  }
}])