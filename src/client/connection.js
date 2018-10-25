// MU* protocol carried over the WebSocket API.
class Connection {

  static get CHANNEL_TEXT() { return 't'; }
  static get CHANNEL_JSON() { return 'j'; }
  static get CHANNEL_HTML() { return 'h'; }
  static get CHANNEL_PUEBLO() { return 'p'; }
  static get CHANNEL_PROMPT() { return '>'; }

  constructor(url) {
    var that = this;
    
    this.url = url;
    this.socket = null;
    this.isOpen = false;
    
    this.onOpen = null;
    this.onError = null;
    this.onClose = null;

    this.onUpdate = null;
    this.onText = null;
    this.onObject = null;
    this.onHTML = null;
    this.onPueblo = null;
    this.onPrompt = null;

    this.reconnect(that);
  }
  
  static reconnect(that) {
    that.reconnect();
  }
  
  static onopen(that, evt) {
    that.isOpen = true;
    that.onOpen && that.onOpen(evt);
  }

  static onerror(that, evt) {
    that.isOpen = false;
    that.onError && that.onError(evt);
  }

  static onclose(that, evt) {
    that.isOpen = false;
    that.onClose && that.onClose(evt);
  }

  static onmessage(that, evt) {
    that.onMessage && that.onMessage(evt.data[0], evt.data.substring(1));
  }

  reconnect() {
    var that = this;
    
    // quit the old connection, if we have one
    if (this.isConnected()) {
      var old = this.socket;
      this.sendText('QUIT');
      this.isOpen && setTimeout(old.close, 1000);
    }

    this.socket = new window.WebSocket(this.url);
    this.isOpen = false;

    this.socket.onopen = function (evt) {
      Connection.onopen(that, evt);
    };

    this.socket.onerror = function (evt) {
      Connection.onerror(that, evt);
    };

    this.socket.onclose = function (evt) {
      Connection.onclose(that, evt);
    };

    this.socket.onmessage = function (evt) {
      Connection.onmessage(that, evt);
    };
  }
  
  isConnected() {
    return (this.socket && this.isOpen && (this.socket.readyState === 1));
  }

  close() {
    this.socket && this.socket.close();
  }

  sendText(data) {
    this.isConnected() && this.socket.send(Connection.CHANNEL_TEXT + data + '\r\n');
  }

  sendObject(data) {
    this.isConnected() && this.socket.send(Connection.CHANNEL_JSON + window.JSON.stringify(data));
  }

  onMessage(channel, data) {
    this.onUpdate && this.onUpdate(channel, data);
    
    switch (channel) {
    case Connection.CHANNEL_TEXT:
      this.onText && this.onText(data);
      break;

    case Connection.CHANNEL_JSON:
      try {
        this.onObject && this.onObject(window.JSON.parse(data));
      }
      catch (e) {
        console.log("JSON ERROR ", e, data);
      }
      break;

    case Connection.CHANNEL_HTML:
      this.onHTML && this.onHTML(data);
      break;

    case Connection.CHANNEL_PUEBLO:
      this.onPueblo && this.onPueblo(data);
      break;
    
    case Connection.CHANNEL_PROMPT:
      this.onPrompt && this.onPrompt(data);
      break;

    default:
      window.console && window.console.log('unhandled message', channel, data);
      return false;
    }

    return true;
  }


}

export default Connection;

