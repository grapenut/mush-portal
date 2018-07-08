
import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import './ansi.css';

class Client {

  constructor(root) {
    this.root = root;
    
    // Terminal UI elements
    this.terminal = null;
    this.output = null;
    this.quicklinks = null;
    this.prompt = null;
    this.input = null;
    
    // Tabs UI elements
    this.tabs = null;
    this.feed = null;
    
    // Server connection info
    this.serverAddress = null;
    this.serverPort = null;
    this.serverSSL = null;
    this.serverProto = null;
    this.serverUrl = null;
    this.conn = null;
  }
  
  // pueblo command links, prompt for user input and replace ?? token if present
  onCommand(cmd) {
    this.sendCommand && this.sendCommand(Utils.parseCommand(cmd));
  }

  // log messages to the output terminal
  appendMessage(classid, msg) {
    this.output && this.output.appendMessage(classid, msg);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // construct a terminal inside the given root element
  initTerminal() {
    var root = document.createElement('div');
    root.className = "terminal";
    this.root.append(root);
    
    var client = this;
    client.terminal = root;
    
    // Build the terminal window in a document fragment
    var fragment = document.createDocumentFragment();
    
    // Output window
    client.output = new Emulator(document.createElement('div'));
    client.output.root.className = "output ansi-37 ansi-40";
    client.output.onCommand = function(cmd) { client.onCommand(cmd); };
    fragment.appendChild(client.output.root);
    
    // Quicklinks bar
    client.quicklinks = document.createElement('div');
    client.quicklinks.className = "quicklinks ansi-37 ansi-40";
    fragment.appendChild(client.quicklinks);
    
    client.addQuickLink('WHO', 'who');
    client.addQuickLink('LOOK', 'look');
    client.addQuickLink('INVENTORY', 'inventory');
    client.addQuickLink('@MAIL', '@mail');
    client.addQuickLink('+BB', '+bb');
    client.addQuickLink('CLEAR', function() { client.output.clear(); client.prompt.clear(); client.input.clear(); });
    
    // Prompt window
    client.prompt = new Emulator(document.createElement('div'));
    client.prompt.root.className = "prompt ansi-37 ansi-40";
    fragment.appendChild(client.prompt.root);
    
    // Input window
    client.input = new UserInput(document.createElement('textarea'));
    client.input.root.className = "input";
    client.input.root.setAttribute('autocomplete', 'off');
    client.input.root.setAttribute('autofocus', '');
    fragment.appendChild(client.input.root);
    
    // Add our terminal components to the container
    client.terminal.append(fragment);
    
    // make sure focus goes back to the input
    client.terminal.onclick = function() { client.input.focus(); };
    
    // enter key passthrough from UserInput.pressKey
    client.input.onEnter = function(cmd) { client.sendCommand(cmd); };

    // escape key passthrough from UserInput.pressKey
    client.input.onEscape = function () { client.input.clear(); };

    root.onresize = function() { client.output.scrollDown(); };
    root.onunload = function() { client.sendText('QUIT'); client.close(); };
    
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // add a command link to the quicklinks bar
  // cmd can be a string to send, or a function to run
  addQuickLink(label, cmd) {
    var client = this;
    var link = document.createElement('a');
    var text = document.createTextNode(label);
    link.appendChild(text);
    
    if (typeof(cmd) === "function") {
      link.title = "Command: " + label;
      link.onclick = function () { cmd && cmd(); };
    } else {
      link.title = "Command: " + cmd;
      link.onclick = function () { client.onCommand && client.onCommand(cmd); };
    }
    
    if (client.quicklinks.childElementCount > 0) {
      client.quicklinks.appendChild(document.createTextNode(' | '));
    }
    
    client.quicklinks.appendChild(link);
    return link;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  // animate scrolling the terminal window to the bottom
  scrollFeed() {
    // TODO: May want to animate this, to make it less abrupt.
    //this.root.scrollTop = this.root.scrollHeight;
    //return;
    
    var root = this.feed;   
    var scrollCount = 0;
    var scrollDuration = 500.0;
    var oldTimestamp = performance.now();

    function step (newTimestamp) {
      var bottom = root.scrollHeight - root.clientHeight;
      var delta = (bottom - root.scrollTop) / 2.0;

      scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
      if (scrollCount >= Math.PI) root.scrollTo(0, bottom);
      if (root.scrollTop === bottom) { return; }
      root.scrollTo(0, Math.round(root.scrollTop + delta));
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // connect to the game server and setup message handlers
  connect(host, port, ssl) {
    var client = this;
    this.serverAddress = host;
    this.serverPort = port;
    this.serverSSL = ssl;

    this.serverProto = this.serverSSL ? "wss://" : "ws://";

    // The connection URL is ws://host:port/wsclient (or wss:// for SSL connections)
    this.serverUrl = this.serverProto + this.serverAddress + ":" + this.serverPort + '/wsclient'
    
    this.close();
    this.conn = new Connection(this.serverUrl);

    // just log a standard message on these socket status events
    this.conn.onOpen = function (evt) { client.appendMessage('logMessage', '%% Connected.'); };
    this.conn.onError = function (evt) { client.appendMessage('logMessage', '%% Connection error!'); console.log(evt); };
    this.conn.onClose = function (evt) { client.appendMessage('logMessage', '%% Connection closed.'); };

    // handle incoming text, html, pueblo, or command prompts
    this.conn.onText = function (text) {
      var re_fugueedit = /^FugueEdit > /;
      if (text.match(re_fugueedit)) {
        var str = text.replace(re_fugueedit, "");
        client.input.root.value = str;
      } else {
        client.output.appendText(text);
      }
    };
    
    this.conn.onHTML = function (fragment) { client.output.appendHTML(fragment); };
    this.conn.onPueblo = function (tag, attrs) { client.output.appendPueblo(tag, attrs); };
    this.conn.onPrompt = function (text) { client.prompt.clear(); client.prompt.appendText(text + '\r\n'); };

    // handle incoming JSON objects. requires server specific implementation
    this.conn.onObject = function (obj) {
      console.log('JSON', obj);
      if (obj.hasOwnProperty('script')) {
      }
    };
  }

  reconnect() {
    this.conn && this.conn.reconnect();
  }
  
  isConnected() {
    return (this.conn && this.conn.isConnected());
  }
  
  close() {
    this.conn && this.conn.close();
  }
  
  sendText(data) {
    this.conn && this.conn.sendText(data);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // function to send a user input command string to the server
  sendCommand(cmd) {
    if (this.isConnected()) {
      if (cmd !== '') {
        this.sendText(cmd);
        this.appendMessage('localEcho', cmd);
      }
    } else { // connection was broken, let's reconnect
      this.reconnect();
      this.appendMessage('logMessage', '%% Reconnecting to server...');
    }
  }

}

export default Client;
export { Connection, Emulator, UserInput, Utils };

