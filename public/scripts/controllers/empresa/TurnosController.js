/**
 * Created by tav0 on 12/01/16.
 */
app.controller('TurnosController', TurnosController);

function TurnosController($scope, turnosService){

    $scope.conductores = [];

    $scope.models = {
        selected: null,
        lists: {"conductores": [], "B": []}
    };

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    cargarConductores();
    function cargarConductores() {
        turnosService.getAllConductores().then(success, error);
        function success(p) {
            $scope.conductores = p.data;
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }
}
