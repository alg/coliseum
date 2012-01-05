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

  isVideoSet: function() {
    return !!this.video;
  }.property('video')
});

Coliseum.Comment = Ember.Object.extend({
  body: null
});

Coliseum.commentsList = Ember.ArrayController.create({
  content: [],
  current_vid: null,
  tempStorage: {},
  comment: null,

  refresh: function() {
    var vid = Coliseum.Player.video.id;

    if (this.current_vid) {
      this.tempStorage[this.current_vid] = this.get('content').map(function(i) {
        return i.get('body'); });
    }

    var c = (this.tempStorage[vid] || []).map(function(body) {
      return Coliseum.Comment.create({ body: body }); });

    this.set('content', c);

    this.current_vid = vid;
    this.set('comment', '');

    setTimeout(function() {
      $("#player").show();
      $("#player-note").hide();
    }, 500);
  }.observes('Coliseum.Player.video'),

  addComment: function() {
    this.pushObject(Coliseum.Comment.create({ body: this.comment }));
    this.set('comment', '');
  }
});

Coliseum.NewCommentView = Ember.TextField.extend({
  insertNewline: function() {
    Coliseum.commentsList.addComment();
  }
});
