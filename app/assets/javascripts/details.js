/* Detailed view of selected found video. */
Coliseum.DetailsView = Em.View.extend({
  templateName: 'details-view',

  videoBinding: 'Coliseum.selectedVideo',
  titleBinding: 'video.title',

  viewTitle: function() {
    var t = this.get('title');
    return t ? t : 'Watch video'
  }.property('title'),

  videoUrl: function() {
    return "http://www.youtube.com/embed/" + this.getPath('.video.youtubeId');
  }.property('video.youtubeId')
});


/* Comments for the video. */
Coliseum.videoCommentsController = Em.ArrayController.create({
  // current comments list
  content: [],

  // id of the last comment (for polling)
  lastCommentId: null,

  // current video Youtube Id
  youtubeIdBinding: 'Coliseum*selectedVideo.youtubeId',

  // TRUE if is currently loading
  isLoading: false,

  cnt: 1,

  init: function() {
    var self = this;
    setInterval(function() { self.poll(); }, 5000);
  },

  // polls for new comments
  poll: function() {
    if (this.get('isLoading') || this.get('youtubeId') == null) return;

    // start loading
    this.set('isLoading', true);

//    var cnt = this.get('cnt');
//    this.pushObject(Coliseum.Comment.create({ body: "Test " + this.get('youtubeId') + cnt }));
//    this.set('cnt', cnt + 1);

    // stop loading
    this.set('isLoading', false);
  },

  createComment: function(body) {
    // temporarily push object here, but later just send a request to
    // the server with youtubeId and body. Initiate poll() afterwards.
    // We'll get the comment from the server not to mess things up
    // in the concurrent environment. There'll be a slight delay,
    // but that's ok. We call it "sending a comment".
    this.unshiftObject(Coliseum.Comment.create({ body: body }));

    this.poll();
  },

  // resets the comments and starts loading
  youtubeIdChanged: function() {
    this.set('content', []);
    this.set('lastCommentId', null);
    this.poll();
  }.observes('youtubeId')
});


/* Comment body field. */
Coliseum.CommentField = Em.TextField.extend({
  disabled: true,

  selectedVideoChanged: function() {
    this.set('disabled', Coliseum.get('selectedVideo') == null);
  }.observes('Coliseum.selectedVideo'),

  insertNewline: function() {
    Coliseum.videoCommentsController.createComment(this.get('value'));
    this.set('value', null);
  }
});

