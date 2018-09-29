app.controller('OverviewController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', ($scope, $http, $state, $stateParams, $rootScope) => {
  console.log('OverviewController loaded!')

  $scope.init = function() {

    const byDayPromise = new Promise((resolve, reject) => {
      $http.get('./api/waste/days', { responseType: 'json' })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })

    const byDayHandler = function(data) {
      const { dates, values } = data

      const ctx = document.querySelector('#myAreaChart')

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: "Wastage",
            lineTension: 0.3,
            backgroundColor: "#551A8B",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: values,
          }],
        },
        options: {
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: 40000,
                maxTicksLimit: 5
              },
              gridLines: {
                color: "rgba(0, 0, 0, .125)",
              }
            }],
          },
          legend: {
            display: false
          }
        }
      })
    }

    const promises = [byDayPromise]
    const handlers = [byDayHandler]

    Promise.all(promises)
      .then(results => results.map((result, idx) => setTimeout(() => handlers[idx](result), 500)))
      .catch(errors => console.error(errors))

  }

}])