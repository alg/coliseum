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

  /* Refresh the contents by searching for the 'query'. */
  search: function() {
    console.log('Search for: ' + this.get('query'));
    this.pushObject(Coliseum.FoundVideo.create({ title: 'Test', youtube_id: 'VIs00QjiJZQ', seconds: 120 }));
  }

});

/* Search view */
Coliseum.SearchView = Em.View.extend({
  templateName: 'search-view',
  resultsBinding: 'Coliseum.searchResultsController.content'
});

/* Single result item view. */
Coliseum.ResultView = Em.View.extend({
  // this view video file
  video: null,

  click: function(evt) {
    console.log('Clicked on: ', this.get('video'));
    Coliseum.set('selectedVideo', this.get('video'));
  }
});

