angular.module('london', [])

//   .factory('socket', function (socketFactory) {
//        var socket = socketFactory();
//	socket.forward('update');
//       return socket;
//    })

.controller('MainCtrl',[
	'$scope',
        '$http',
        function($scope, $http){

            //const socket = io('http://localhost:3008');
	//	var socket = io.connect();
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
                    console.log('emitting idea posted');
                   // socket.emit('update', idea);
                });
            };

         //   socket.on('update', function(data) {
         //       console.log('got a message', data);
         //       $scope.getAll();
         //   });


            $scope.upvote = function(idea) {
                return $http.put('/ideas/' + idea._id + '/upvote')
                    .success(function(data){
                        console.log("upvote worked");
                        idea.upvotes += 1;
                       // socket.emit('update', idea);
                    });
            };

            $scope.addIdea = function() {
                if($scope.name === '' || $scope.idea === '') { return; }
                var newobject = {name:$scope.name, idea:$scope.idea ,upvotes:0};
                $scope.create(newobject);
                        $scope.name='';
                $scope.idea='';
                console.log(newobject);
            };

            $scope.incrementUpvotes = function(idea) {
                $scope.upvote(idea);
            };

        }
    ]);
