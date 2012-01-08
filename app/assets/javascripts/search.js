/* Search bar component. */
Coliseum.SearchBar = Em.TextField.extend({
  valueBinding: 'Coliseum.searchResultsController.query',
  insertNewline: function() {
    Coliseum.searchResultsController.search();
  }
});

/* Search results. */
Coliseum.searchResultsController = Em.ArrayController.create({
  // list of found videos
  content: [],

  // current query
  query: null,

  // current page
  page: 1,

  // items per search page
  perPage: 15,

  // TRUE when search is in progress
  isSearching: false,

  /* Refresh the contents by searching for the 'query'. */
  search: function() {
    var self = this, query = this.get('query');

    // hide results
    this.set('content', []);

    if (query != null && query.length > 0) {
      // set the searching status
      this.set('isSearching', true);

      var c = $.getJSON('http://gdata.youtube.com/feeds/api/videos?alt=json',
        { q: query, 'max-results': this.get('perPage'), v: 2 });

      // populate results
      c.success(function(data) {
        var entries = data.feed.entry, results = [];
        for (var i = 0; i < entries.length; i++) {
          var v = Coliseum.FoundVideo.fromYoutube(entries[i]);
          console.log(v.get('youtubeId'));
          results.push(v);
        }
        self.set('content', results);
      });

      // reset the searching status
      c.complete(function() {
        self.set('isSearching', false);
      });
    }
  }

});

/* Search view */
Coliseum.SearchView = Em.View.extend({
  templateName: 'search-view',
  resultsBinding: 'Coliseum.searchResultsController.content',
  isSearchingBinding: 'Coliseum.searchResultsController.isSearching'
});

/* Single result item view. */
Coliseum.ResultView = Em.View.extend({
  // this view video file
  video: null,

  click: function(evt) {
    console.log('Clicked on: ', this.get('video').get('youtubeId'));
    Coliseum.set('selectedVideo', this.get('video'));
  },

  videoChanged: function() {
    console.log('yid: ' + this.get('video').get('youtubeId'));
  }.observes('video')
});

