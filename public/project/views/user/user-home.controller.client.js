(function() {
    angular
        .module("TVTracker")
        .controller("UserHomeController", UserHomeController);

    function UserHomeController($location, $routeParams, $rootScope, EpguidesService) {
        var vm = this;
        vm.route = $routeParams;
        vm.searchShows = searchShows;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.showsToView = findFollowedShowsByDay((new Date).getDate());
        }
        init();

        function searchShows(searchText) {
            if(searchText) {
                searchText = searchText.split(' ').join('');
                $location.url('/shows/search/' + searchText);
            }
        }

        function findFollowedShowsByDay(day) {
            EpguidesService
                .nextEpisode('bigbangtheory')
                .then(function(res) {
                    console.log(res.data);
                });
        }
    }
})();