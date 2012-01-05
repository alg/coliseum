Coliseum.Player = Ember.Object.create({
  video: null,

  videoUrl: function() {
    return this.video && "http://www.youtube.com/embed/" + this.video.id;
  }.property('video'),

  isVideoSet: function() {
    return !!this.video;
  }.property('video')
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
