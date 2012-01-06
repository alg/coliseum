Coliseum = Ember.Application.create();

Coliseum.Video = Ember.Object.extend({
  youtube_id: null,
  image_url: null,
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
  }.property("seconds")
});

Coliseum.Video.fromYoutube = function(data) {
  return Coliseum.Video.create({
    youtube_id: data.id.$t.split(':')[3],
    image_url: data.media$group.media$thumbnail[0].url,
    seconds:  parseInt(data.media$group.yt$duration.seconds),
    title: data.title.$t
  });
}

Coliseum.Comment = Ember.Object.extend({
  body: null
});

