const app = angular.module('dashboard', ['ui.router'])

// Components
app.component('overview', {
  templateUrl: 'views/overview.html',
  controller: 'OverviewController'
})

app.component('flight', {
  templateUrl: 'views/flight.html',
  controller: 'FlightController'
})

// States
app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

  const components = [
    {
      name: 'overview',
      params: null
    },
    {
      name: 'flight',
      params: {
        flightCode: null
      }
    }
  ]
  components.forEach(component => {
    const { name, params } = component
    const stateOptions = {
      name: name,
      url: '/',
      component: name 
    }

    if (params) stateOptions.params = params

    $stateProvider.state(stateOptions)
  })

  $urlRouterProvider.otherwise('/')

}])

// Datepicker defefault
$(function() {
  const defaultDate = new Date(2018, 7-1, 20)
  $("#datepicker").datepicker({ dateFormat: 'dd-M-yy', minDate: defaultDate, maxDate: defaultDate });
  $("#datepicker").datepicker('setDate', defaultDate);
})