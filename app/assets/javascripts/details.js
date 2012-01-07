Coliseum.DetailsView = Em.View.extend({
  templateName: 'details-view',

  videoBinding: 'Coliseum.selectedVideo',
  titleBinding: 'video.title',

  viewTitle: function() {
    var t = this.get('title');
    return t ? t : 'Watch video'
  }.property('title'),

  videoUrl: function() {
    return "http://www.youtube.com/embed/" + this.getPath('.video.youtube_id');
  }.property('video.youtube_id')
});

