Coliseum = Ember.Application.create();

Coliseum.Video = Ember.Object.extend({
  id: null,
  imageUrl: null,
  seconds: 0,
  title: null,

  length: function() {
    var hrs = Math.floor(this.seconds / 3600),
        rem = this.seconds - hrs * 3600,
        min = Math.floor(rem / 60),
        sec = rem % 60;

    return "" + (hrs > 0 ? hrs + ":" : "") +
                (min < 10 ? "0" : "") + min + ":" +
                (sec < 10 ? "0" : "") + sec;
  }.property()
});

Coliseum.Video.fromYoutube = function(data) {
  return Coliseum.Video.create({
    id: data.id.$t.split(':')[3],
    imageUrl: data.media$group.media$thumbnail[0].url,
    seconds:  parseInt(data.media$group.yt$duration.seconds),
    title: data.title.$t
  });
}

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
    $.getJSON('http://gdata.youtube.com/feeds/api/videos?max-results=10&alt=json&v=2',
      { q: this.get('value') }, function(data) {
        var entries = data.feed.entry;
        var results = [];
        for (var i = 0; i < entries.length; i++) results.push(Coliseum.Video.fromYoutube(entries[i]));
        Coliseum.resultsController.set('content', results);
      });
  }
});

Coliseum.Player = Ember.Object.create({
  video: null,

  videoUrl: function() {
    return this.video && "http://www.youtube.com/embed/" + this.video.id;
  }.property('video'),

  play: function(v) {
    this.video = v;
  }
});
