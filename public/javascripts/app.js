angular.module('london', [])
    .controller('MainCtrl', [
        '$scope',
        '$http',
        function($scope, $http){
            $scope.ideas = [];

            $scope.getAll = function() {
                return $http.get('/ideas').success(function(data){
                    angular.copy(data, $scope.ideas);
                });
            };
            $scope.getAll();

            $scope.create = function(idea) {
                return $http.post('/ideas', idea).success(function(data){
                    $scope.ideas.push(data);
                });
            };

            $scope.upvote = function(idea) {
                return $http.put('/ideas/' + idea._id + '/upvote')
                    .success(function(data){
                        console.log("upvote worked");
                        idea.upvotes += 1;
                    });
            };

            $scope.addIdea = function() {
                if($scope.name === '' || $scope.idea === '') { return; }
                $scope.create({name:$scope.name, idea:$scope.idea ,upvotes:0});
                $scope.formContent='';
            };

            $scope.incrementUpvotes = function(idea) {
                $scope.upvote(idea);
            };
        }
    ]);