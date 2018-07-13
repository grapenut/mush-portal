
import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import './ansi.css';

class Client {

  constructor() {
    // Terminal UI elements
    this.output = null;
    this.quicklinks = null;
    this.prompt = null;
    this.input = null;
    
    // Tabs UI elements
    this.tabs = null;
    this.feed = null;
    
    // React Components
    this.react = {
      header: null,
      menubar: null,
      drawer: null,
      terminal: null,
      feed: null,
      input: null,
      statusbar: null,
    };
    
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

  // find and initialize terminal components
  initTerminal(ids) {
    // Output window
    var output_el = document.getElementById(ids.output);
    if (output_el !== null) {
      this.output = new Emulator(output_el);
      this.output.onCommand = (cmd) => { this.onCommand(cmd); };

      output_el.onunload = () => { this.sendText('QUIT'); this.close(); };
      output_el.onresize = () => { this.output && this.output.scrollDown(); };
    }
    
    // Quicklinks bar
    this.quicklinks = document.getElementById(ids.links);
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
    var prompt_el = document.getElementById(ids.prompt);
    if (prompt_el !== null) {
      this.prompt = new Emulator(prompt_el);
    }
    
    // Input window
    var input_el = document.getElementById(ids.input);
    if (input_el !== null) {
      this.input = new UserInput(input_el);

      // enter key passthrough from UserInput.pressKey
      this.input.onEnter = (cmd) => { this.sendCommand(cmd); this.prompt && this.prompt.clear(); };

      // escape key passthrough from UserInput.pressKey
      this.input.onEscape = () => { this.input.clear(); };
    }

  }
  
  // initialize feed elements
  initFeed(ids) {
  
    this.feed = document.getElementById(ids.feed);
    this.tabs = document.getElementById(ids.tabbar);
  
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
  
  focus() {
    this.input && this.input.focus();
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

    // handle incoming text
    this.conn.onText = function (text) {
      var re_fugueedit = /^FugueEdit > /;
      var scroll = false;
      if (client.output) {
        if (client.input) {
          if (text.match(re_fugueedit)) {
            var str = text.replace(re_fugueedit, "");
            client.input.root.value = str;
            return;
          }
        }

        if (client.output.nearBottom()) {
          scroll = true;
        }
        
        client.output.appendText(text);
        scroll && client.output.scrollDown();
      }
    };
    
    // handle incoming html
    this.conn.onHTML = function (fragment) {
      var scroll = false;
      if (client.output) {
        if (client.output.nearBottom()) {
          scroll = true;
        }
        
        client.output.appendHTML(fragment);
        scroll && client.output.scrollDown();
      }
    };
    
    // handle incoming pueblo
    this.conn.onPueblo = function (tag, attrs) {
      var scroll = false;
      if (client.output) {
        if (client.output.nearBottom()) {
          scroll = true;
        }
        
        client.output.appendPueblo(tag, attrs);
        scroll && client.output.scrollDown();
      }
    };
    
    // handle incoming command prompts
    this.conn.onPrompt = function (text) {
      if (client.prompt !== null) {
        client.prompt.clear();
        client.prompt.appendText(text + '\r\n');
      }
    };

    // handle incoming JSON objects. requires server specific implementation
    this.conn.onObject = function (obj) {
      console.log('JSON', obj);
      if (obj.hasOwnProperty('op')) {
        switch (obj.op) {
          case 'login':
            // open login dialog
            client.react.login && client.react.login.openLogin(obj.msg);
            break;
          case 'loginfail':
            // reopen login dialog with error notice
            client.react.login && client.react.login.openLogin(obj.msg);
            break;
          case 'createfail':
            client.react.login && client.react.login.openLogin(obj.msg);
            break;
          case 'addmenuitem':
            client.react.menubar && client.react.menubar.addMenuBarItem(obj.menuitem);
            break;
          case 'changetitle':
            client.react.header && client.react.header.setTitle(obj.msg);
            break;
          case '':
            break;
          default:
            console.log('Unknown opcode: ', obj);
            break;
        }
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

