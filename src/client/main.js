
import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import './ansi.css';

class Client {

  constructor() {
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
    
    this.initTerminal();
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

  // find and initialize terminal components
  initTerminal() {
    // The terminal container, pass focus to the input box when clicked
    this.terminal = document.getElementById('Terminal');
    this.terminal.onclick = () => { this.input.focus(); };
    
    // Output window
    this.output = new Emulator(document.getElementById('Terminal-output'));
    this.output.onCommand = (cmd) => { this.onCommand(cmd); };
    
    // Quicklinks bar
    this.quicklinks = document.getElementById('Terminal-links');
    
    //this.addQuickLink('WHO', 'who');
    //this.addQuickLink('LOOK', 'look');
    //this.addQuickLink('INVENTORY', 'inventory');
    //this.addQuickLink('@MAIL', '@mail');
    //this.addQuickLink('+BB', '+bb');
    //this.addQuickLink('CLEAR', function() { client.output.clear(); client.prompt.clear(); client.input.clear(); });
    
    // Prompt window
    this.prompt = new Emulator(document.getElementById('Terminal-prompt'));
    
    // Input window
    this.input = new UserInput(document.getElementById('Terminal-input'));
    
    // enter key passthrough from UserInput.pressKey
    this.input.onEnter = (cmd) => { this.sendCommand(cmd); };

    // escape key passthrough from UserInput.pressKey
    this.input.onEscape = () => { this.input.clear(); };

    this.terminal.onresize = () => { this.output.scrollDown(); };
    this.terminal.onunload = () => { this.sendText('QUIT'); this.close(); };
    
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

