Coliseum = Ember.Application.create({
  // currently selected video
  selectedVideo: null
});

// Video that comes from Youtube -- not a DS object
Coliseum.FoundVideo = Em.Object.extend({
  youtubeId: null,
  title:     null,
  descr:     null,
  seconds:   null,

  length: function() {
    return seconds_to_time(this.get('seconds'));
  }.property('seconds'),

  youtubeIdChange: function() {
    console.log(this.get('title') + ' -> ' + this.get('youtubeId'));
  }.observes('youtubeId')
});

Coliseum.FoundVideo.reopenClass({
  fromYoutube: function(data) {
    return Coliseum.FoundVideo.create({
      youtubeId: data.id.$t.split(':')[3],
      seconds:  parseInt(data.media$group.yt$duration.seconds),
      title: data.title.$t
    });
  }
});

// Comment object
Coliseum.Comment = Em.Object.extend({
  body: null
});
