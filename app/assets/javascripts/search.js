Coliseum.resultsController = Ember.ArrayController.create();

Coliseum.WatchButton = Em.Button.extend({
  video: null,
  triggerAction: function() {
    Coliseum.Player.set('video', this.video);
    this._super();
  }
});

Coliseum.SearchView = Ember.TextField.extend({
  insertNewline: function() {
    $.getJSON('http://gdata.youtube.com/feeds/api/videos?max-results=20&alt=json&v=2',
      { q: this.get('value') }, function(data) {
        var entries = data.feed.entry;
        var results = [];
        for (var i = 0; i < entries.length; i++) results.push(Coliseum.Video.fromYoutube(entries[i]));
        Coliseum.resultsController.set('content', results);
      });
  }
});

Coliseum.VideoResultView = Ember.View.extend({
  video: null,
  click: function(evt) {
    Coliseum.Player.set('video', this.get('video'));
    return false;
  }
});
