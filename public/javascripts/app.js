angular.module('london', [])
    .controller('MainCtrl', [
        '$scope',
        '$http',
        function($scope, $http){
            $scope.ideas = [
                {idea:'Comment 1', name: 'Best', upvotes:5},
                {idea:'Comment 2', name: 'Cody', upvotes:6},
                {idea:'Comment 3', name: 'Russell', upvotes:1},
                {idea:'Comment 4', name: 'Jake', upvotes:4},
                {idea:'Comment 5', name: 'Mary Poppins', upvotes:3}
            ];

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
                $scope.ideas.push({name:$scope.name, idea:$scope.idea ,upvotes:0});
                $scope.formContent='';
            };

            $scope.incrementUpvotes = function(idea) {
                idea.upvotes += 1;
            };
        }
    ]);