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

  // current video Youtube Id
  youtubeIdBinding: 'Coliseum*selectedVideo.youtubeId',

  // TRUE if is currently loading
  isLoading: false,

  init: function() {
    Coliseum.websocket.setListener(this);
  },

  onWebsocketCommand: function(cmd, args) {
    if (cmd == "comments") {
      this.set('content', []);
      for (var i = 0; i < args.length; i++) {
        this.pushObject(Coliseum.Comment.create({ body: args[i] }));
      }
    } else if (cmd == "comment") {
      this.unshiftObject(Coliseum.Comment.create({ body: args[0] }));
    }

    console.log("command: ", cmd, args);
  },

  createComment: function(body) {
    Coliseum.websocket.addComment(body);
  },

  // resets the comments and starts loading
  youtubeIdChanged: function() {
    var yid = this.get('youtubeId');
    if (yid) Coliseum.websocket.join(yid);
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

