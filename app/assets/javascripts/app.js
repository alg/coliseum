Coliseum = Ember.Application.create({
  // currently selected video
  selectedVideo: null
});

// Create REST adapter
Coliseum.adapter = DS.Adapter.create({
  create: function(store, type, model) {
    jQuery.ajax({
      url: type.url,
      data: { data: model.get('data') },
      dataType: 'json',
      type: 'POST',

      success: function(data) {
        store.didCreateModel(model, data);
      }
    })
  },

  findAll: function(store, type) {
    jQuery.getJSON(type.url, function(data) {
      store.loadMany(Coliseum.Video, data);
    });
  }
});

// Create data store
Coliseum.store = DS.Store.create({
  adapter: Coliseum.adapter
});


// Video that comes from Youtube -- not a DS object
Coliseum.FoundVideo = Em.Object.extend({
  youtube_id: null,
  title:      null,
  descr:      null,
  seconds:    null,

  length:  function() { return seconds_to_time(this.get('seconds')); }.property('seconds'),
  persist: function() { return Coliseum.store.create(Coliseum.Video, this.get('data')); }
});

Coliseum.FoundVideo.reopenClass({
  fromYoutube: function(data) {
    return Coliseum.FoundVideo.create({
      youtube_id: data.id.$t.split(':')[3],
      seconds:  parseInt(data.media$group.yt$duration.seconds),
      title: data.title.$t
    });
  }
});

// Video that we store in our database
Coliseum.Video = DS.Model.extend({
  id:         DS.attr("string"),
  youtube_id: DS.attr("string"),
  image_url:  DS.attr("string"),
  seconds:    DS.attr("integer"),
  title:      DS.attr("string"),
  descr:      DS.attr("string"),

  length: function() { return seconds_to_time(this.get('seconds')); }.property('seconds'),

  init: function() {
    this._super();
    console.log("Init: " + this.get('data'));
  }
});

Coliseum.Video.reopenClass({
  url: '/videos'
});
