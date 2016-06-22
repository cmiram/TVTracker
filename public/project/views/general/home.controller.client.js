(function() {
    angular
        .module("TVTracker")
        .controller("HomeController", HomeController);

    function HomeController($location, $sce, UserService) {
        var vm = this;
        vm.getBackdropUrl = getBackdropUrl;
        vm.getFirstUrl = getFirstUrl;

        var apiKey = "77c6e46c7c8297c719b1cd52b441fcb8"; //process.env.API_KEY;
        
        function init() {
            UserService
                .getPopShows()
                .then(function(res) {
                    vm.popShows = res.data.results;
                    vm.popShows.splice(0,5);
                })
                .then(function() {
                    CarouselInit();
                });
        }
        init();

        function getFirstUrl() {
            var show = vm.popShows[0];
            return getBackdropUrl(show);
        }

        function getBackdropUrl(show) {
            var baseUrl = "http://image.tmdb.org/t/p/w500";
            return $sce.trustAsResourceUrl(baseUrl + show.backdrop_path);
        }

        $('.multi-item-carousel').carousel({
            interval: false
        });

        // for every slide in carousel, copy the next slide's item in the slide.
        // Do the same for the next, next item.
        $('.multi-item-carousel .item').each(function () {
            var next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));

            if (next.next().length > 0) {
                next.next().children(':first-child').clone().appendTo($(this));
            } else {
                $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
            }
        });

        function CarouselInit() {
            vm.carouselInterval = 7000;

            var i, first = [],
                second, third;
            var many = 3;

            for (i = 0; i < vm.popShows.length; i += many) {
                second = {
                    show1: vm.popShows[i]
                };
                if (many == 1) {}
                if (vm.popShows[i + 1] && (many == 2 || many == 3)) {
                    second.show2 = vm.popShows[i + 1];

                }
                if (vm.popShows[i + (many - 1)] && many == 3) {
                    second.show3 = vm.popShows[i + 2];
                }
                first.push(second);
            }
            vm.groupedSlides = first;
        }
    }
})();


