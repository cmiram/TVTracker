(function() {
    angular
        .module("TVTracker")
        .factory("EpguidesService", EpguidesService);

    function EpguidesService($http) {
        
        var api = {
            showMetadata: showMetadata,
            allEpisodes: allEpisodes,
            specificEpisode: specificEpisode,
            nextEpisode: nextEpisode,
            lastEpisode: lastEpisode
        };
        return api;
        
        function showMetadata(show) {
            show = fixForShowName(show);
            var url = '/api/epguides/metadata/' + show;
            return $http.get(url);
        }
        
        function allEpisodes(show) {
            show = fixForShowName(show);
            var url = '/api/epguides/allepisodes/' + show;
            return $http.get(url);
        }
        
        function specificEpisode(show, season, episode) {
            show = fixForShowName(show);
            var url = '/api/epguides/' + show + '/' + season + '/' + episode;
            return $http.get(url);
        }
        
        function nextEpisode(show) {
            show = fixForShowName(show);
            var url = '/api/epguides/' + show + '/next';
            return $http.get(url);
        }
        
        function lastEpisode(show) {
            show = fixForShowName(show);
            var url =  '/api/epguides/' + show + '/last';
            return $http.get(url);
        }

        function fixForShowName(show) {
            if(show.toLowerCase() === 'empire') {
                return 'empire_2015';
            }
            else if(show.toLowerCase() === 'tosh') {
                return 'tosh0'
            }
            return show;
        }
    }
})();