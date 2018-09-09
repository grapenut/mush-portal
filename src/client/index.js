
import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import './ansi.css';

const EventEmitter = require('events');

class Client {

  constructor() {
    // Terminal UI elements
    this.output = null;
    this.quicklinks = null;
    this.prompt = null;
    this.input = null;
    
    // App Components
    this.phaser = null;
    this.layout = null;
    this.events = new EventEmitter();
    
    // React Components
    this.react = {
      portal: null,
      header: null,
      menubar: null,
      drawer: null,
      terminal: null,
      input: null,
      statusbar: null,
      mailbox: null,
    };
    
    // Server connection info
    this.serverAddress = null;
    this.serverPort = null;
    this.serverSSL = null;
    this.serverProto = null;
    this.serverUrl = null;
    this.conn = null;
    
    this.lastCommand = null;
    
    // number of lines of scroll within which the output scroll down when new items are received
    this.scrollThreshold = 5;
    
    // handle auto-reconnects
    this.reconnectTimer = 2000;
    this.reconnectCount = 0;
    this.reconnectMaxCount = 10;
    
    var client = this;
    
  }
  
  // load additional scripts for custom events
  loadScript(src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    document.getElementsByTagName('body')[0].appendChild(tag);
  }
  
  // pueblo command links, prompt for user input and replace ?? token if present
  onCommand(cmd) {
    this.sendCommand && this.sendCommand(Utils.parseCommand(cmd));
  }

  // log messages to the output terminal
  appendMessage(classid, msg) {
    var scroll = false;
    if (this.output) {
      if (this.output.nearBottom(this.scrollThreshold)) {
        scroll = true;
      }
      
      this.output.appendMessage(classid, msg);
      
      scroll && this.output.scrollDown();
      
      this.react.terminal && this.react.terminal.onChange();
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  initInput(input) {
    // Input window
    if (input !== null) {
      this.input = new UserInput(input);

      // enter key passthrough from UserInput.pressKey
      this.input.onEnter = (cmd) => { this.sendCommand(cmd); this.prompt && this.prompt.clear(); };

      // escape key passthrough from UserInput.pressKey
      this.input.onEscape = () => { this.input.clear(); };
      
      // pageup key passthrough from UserInput.pressKey
      this.input.onPageUp = () => { this.output && this.output.scrollPageUp(); };

      // pagedown key passthrough from UserInput.pressKey
      this.input.onPageDown = () => { this.output && this.output.scrollPageDown(); };
    }
  }

  // find and initialize terminal components
  initOutput(output, quicklinks, prompt) {
    // Output window
    if (output !== null) {
      this.output = new Emulator(output);
      this.output.onCommand = (cmd) => { this.onCommand(cmd); };

      output.onunload = () => { this.sendText('QUIT'); this.close(); };
      output.onresize = () => { this.output && this.output.scrollDown(); };
    }
    
    // Quicklinks bar
    if (this.quicklinks !== null) {
      this.addQuickLink('WHO', 'who');
      this.addQuickLink('LOOK', 'look');
      this.addQuickLink('INVENTORY', 'inventory');
      this.addQuickLink('@MAIL', '@mail');
      this.addQuickLink('+BB', '+bb');
      this.addQuickLink('CLEAR', () => {
        this.output && this.output.clear();
        this.prompt && this.prompt.clear();
        this.input && this.input.clear();
      });
    }
    
    // Prompt window
    if (prompt !== null) {
      this.prompt = new Emulator(prompt);
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // add a command link to the quicklinks bar
  // cmd can be a string to send, or a function to run
  addQuickLink(label, cmd) {
    var client = this;
    var link = document.createElement('a');
    var text = document.createTextNode(label);
    
    if (client.quicklinks === null) {
      return null;
    }
    
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

  //////////////////////////////////////////////////////
  // animate scrolling the terminal window to the bottom
  scrollDown(root) {
    if (!root) {
      return;
    }

    root.scrollTop = this.root.scrollHeight;
    return;
/*    
    // animated scrolling alternative
    var scrollCount = 0;
    var scrollDuration = 500.0;
    var oldTimestamp = performance.now();
    
    var step = (newTimestamp) => {
      var bottom = root.scrollHeight - root.clientHeight;
      var delta = (bottom - root.scrollTop) / 2.0;

      scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
      if (scrollCount >= Math.PI) root.scrollTo(0, bottom);
      if (root.scrollTop === bottom) { return; }
      root.scrollTo(0, Math.round(root.scrollTop + delta));
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    };
    
    window.requestAnimationFrame(step);
*/
  }
  
  // input focus passthrough
  focus() {
    this.input && this.input.focus();
  }
  
  // wrapper that scrolls the output if needed
  scrollIfNeeded(fun) {
    var scroll = false;
    
    if (this.output) {
      if (this.output.nearBottom(this.scrollThreshold)) {
        scroll = true;
      }
      
      fun()
      
      scroll && this.output.scrollDown();
      
      this.react.terminal && this.react.terminal.onChange();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  addWindow(name, cfg) {
    var config = cfg;
    
    if (!config.id) {
      config.id = name;
    }
    
    if (!config.title) {
      config.title = name;
    }
    
    config.type = 'react-component';
    
    this.layout.root.contentItems[0].addChild(config);
  }
  
  focusWindow(name) {
    var window = this.layout.root.getItemsById(name);
    if (window.length !== 0) {
      window[0].element.focus()
    }
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
    this.conn.onOpen = function (evt) {
      client.appendMessage('logMessage', '%% Connected.');
      client.reconnectCount = 0;
    };
    
    this.conn.onError = function (evt) {
      client.appendMessage('logMessage', '%% Connection error!');
      console.log(evt);
    };
    
    this.conn.onClose = function (evt) {
      client.appendMessage('logMessage', '%% Connection closed.');
      setTimeout(() => { client.reconnect() }, (client.serverSSL ? 2.0 : 1.0) * client.reconnectTimer);
    };

    // handle incoming text
    this.conn.onText = function (text) {
      var re_fugueedit = /^FugueEdit > /;
      if (client.output) {
        if (client.input) {
          if (text.match(re_fugueedit)) {
            var str = text.replace(re_fugueedit, "");
            client.input.root.value = str;
            return;
          }
        }

        client.scrollIfNeeded(() => client.output.appendText(text));
      }
    };
    
    // handle incoming html
    this.conn.onHTML = function (fragment) {
      if (client.output) {
        client.scrollIfNeeded(() => client.output.appendHTML(fragment));
      }
    };
    
    // handle incoming pueblo
    this.conn.onPueblo = function (tag, attrs) {
      if (client.output) {
        client.scrollIfNeeded(() => client.output.appendPueblo(tag, attrs));
      }
    };
    
    // handle incoming command prompts
    this.conn.onPrompt = function (text) {
      if (client.prompt !== null) {
        client.prompt.clear();
        client.prompt.appendText(text + '\r\n');
      }
    };

    // handle incoming JSON objects
    // use the Events handler collection
    this.conn.onObject = function (obj) {
      var op = null;
      if (obj.hasOwnProperty('gmcp')) {
        op = obj.gmcp;
      } else if (obj.hasOwnProperty('op')) {
        op = obj.op;
      }
      op && client.events.emit(op, obj);
    };
  }

  reconnect() {
    if (this.isConnected()) {
      return;
    }
    
    if (this.reconnectCount < this.reconnectMaxCount) {
      this.reconnectCount++;
      this.conn && this.conn.reconnect();
    } else {
      this.appendMessage('logMessage', '%% Auto-reconnect aborted.');
    }
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
        this.scrollIfNeeded(() => this.appendMessage('localEcho', cmd));
      }
    } else {
      // connection was broken, let's force a reconnect
      this.conn && this.conn.reconnect();
      this.scrollIfNeeded(() => this.appendMessage('logMessage', '%% Reconnecting to server...'));
    }
  }

}

export default Client;
export { Connection, Emulator, UserInput, Utils };

