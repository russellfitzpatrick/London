angular.module('london', [])
    .controller('MainCtrl', [
        '$scope',
        function($scope){
            $scope.comments = [
                {comment:'Comment 1', name: 'Best', upvotes:5},
                {comment:'Comment 2', name: 'Cody', upvotes:6},
                {comment:'Comment 3', name: 'Russell', upvotes:1},
                {comment:'Comment 4', name: 'Jake', upvotes:4},
                {comment:'Comment 5', name: 'Mary Poppins', upvotes:3}
            ];
        }
    ]);