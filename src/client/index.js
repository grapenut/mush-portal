
import React from 'react';
import ReactDOM from 'react-dom';

import Chargen from '../modules/Chargen';
import Mailbox from '../modules/Mailbox';

import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import './ansi.css';

import { jsPanel } from 'jspanel4/es6module/jspanel.js';
import 'jspanel4/es6module/jspanel.css';
//import 'jspanel4/es6module/extensions/hint/jspanel.hint.js';
//import 'jspanel4/es6module/extensions/modal/jspanel.modal.js';
//import 'jspanel4/es6module/extensions/contextmenu/jspanel.contextmenu.js';
//import 'jspanel4/es6module/extensions/tooltip/jspanel.tooltip.js';
//import 'jspanel4/es6module/extensions/layout/jspanel.layout.js';
//import 'jspanel4/es6module/extensions/dock/jspanel.dock.js';

const EventEmitter = require('events');

class Client {

  constructor() {
    // Terminal UI elements
    this.output = null;
    this.quicklinks = null;
    this.prompt = null;
    this.input = null;
    
    // App Components
    this.events = new EventEmitter();
    this.panels = jsPanel;
    
    // React Components
    this.react = {
      taskbar: null,
      terminal: null,
      input: null,
      statusbar: null,
      login: null,
      mailbox: null
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

  // initialize terminal input window
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

  // initialize terminal output window
  initOutput(output) {
    // Output window
    if (output !== null) {
      this.output = new Emulator(output);
      this.output.onCommand = (cmd) => { this.onCommand(cmd); };

      output.onunload = () => { this.sendText('QUIT'); this.close(); };
      output.onresize = () => { this.output && this.output.scrollDown(); };
    }
  }
  
  // initialize quicklink bar
  initQuicklinks(quicklinks) {
    // Quicklinks bar
    if (quicklinks !== null) {
      this.quicklinks = quicklinks;
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
  }
  
  // initialize command prompt
  initPrompt(prompt) {
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
  focus(force = false) {
    this.input && this.input.focus(force);
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
  
  addReactPanel(name, cfg) {
    var config = cfg || {};
    
    var el = null;
    switch (name) {
      case 'Chargen':
        el = Chargen;
        break;
      case 'Mailbox':
        el = Mailbox;
        break;
      default:
        break;
    }
    
    if (!el) {
      return;
    }
    
    if (!config.id) {
      config.id = name;
    }
    
    if (!config.headerTitle) {
      config.headerTitle = config.id;
    }
    
    config.callback = function(container) {
      ReactDOM.render(React.createElement(el, null, null), container.content);
    };
    
    config.onclosed = function(container) {
      ReactDOM.unmountComponentAtNode(container.content)
    };
    
    this.panels.create(config);
  }
  
  focusPanel(name) {
    var panels = this.panels.getPanels(function() {
      return (this.id === name);
    });
    
    if (panels.length > 0) {
      if (panels[0].status === 'minimized') {
        this.react.taskbar.popTask(panels[0]);
      } else {
        panels[0].unsmallify();
        panels[0].front();
        panels[0].reposition();
      }
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

