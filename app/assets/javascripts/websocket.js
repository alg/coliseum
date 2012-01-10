WS = function() {
  var self = this;

  self.ws = null;

  self.join = function(youtubeId) {
    sendCommand('join', youtubeId);
  }

  self.addComment = function(body) {
    sendCommand('comment', body);
  }

  self.setListener = function(l) {
    self.listener = l;
  }

  var connect = function () {
    self.ws = new WebSocket("ws://localhost:8080/service");

    self.ws.onopen = function() {
      console.log("Websocket is open");
    }

    self.ws.onmessage = function(msg) {
      var data = msg.data.split("~");
      var cmd = data.shift();

      console.log(cmd, data);
      self.listener.onWebsocketCommand(cmd, data);
    }

    self.ws.onclose = function() {
      self.ws = null;
      setTimeout(connect, 2000);
    }
  }

  var sendCommand = function(command, arg) {
    if (self.ws) self.ws.send(command + "~" + arg);
  }

  connect();
}
