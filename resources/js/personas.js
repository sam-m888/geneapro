app.
config(function($stateProvider) {
   $stateProvider.
   state('personas', {
      url: '/personas',
      templateUrl: 'geneaprove/personas.html',
      controller: 'personasCtrl'
   });
}).

controller('personasCtrl', function($scope, $rootScope, $http, $state, $filter) {
   $scope.rows = [{rows: 10, label: '10'},
                  {rows: 20, label: '20'},
                  {rows: 30, label: '30'},
                  {rows: 40, label: '40'},
                  {rows: 50, label: '50'},
                  {rows: 60, label: '60'},
                  {rows: 70, label: '70'},
                  {rows: 80, label: '80'},
                  {rows: 100, label: '100'},
                  {rows: 200, label: '200'},
                  {rows: undefined, label: 'All'}]

   $scope.page = 1;
   $scope.filteredPersons = $scope.persons = [];
   $scope.setPage = function(page) {
      var len = $scope.filteredPersons.length;
      if (len == 0) {
         $scope.offset = 0;
         $scope.offsetMax = 0;  // last on page
         $scope.maxPage = 1;
         return;
      }
      var s = $rootScope.settings.personas.rows || len; // page size
      $scope.maxPage = Math.ceil(len / s);
      page = Math.min($scope.maxPage, Math.max(1, page));
      $scope.page = page;
      $scope.offset = (page - 1) * s;
      $scope.offsetMax = Math.min($scope.offset + s, len - 1);
      $scope.pageRange = [];
      var min = Math.max(1, $scope.page - 3);
      var max = Math.min($scope.maxPage, min + 7);
      for (var r2 = min; r2 <= max; r2++) {
         $scope.pageRange.push(r2);
      }
   }

   $scope.filter = {value: ''};
   $scope.$watch('filter.value', function(val) {
      $scope.filteredPersons = $filter('filter')($scope.persons, val);
      $scope.setPage($scope.page);
   });
   $rootScope.$watch('settings.personas.rows', function() {
      $scope.setPage($scope.page);
   });

   $http.get('/data/personas').then(function(resp) {
      $scope.persons = resp.data.persons;
      $scope.filteredPersons = $scope.persons;
      $scope.setPage(1);
   });
   $scope.select = function(person) {
      $rootScope.decujus = person.id;
   };
});
