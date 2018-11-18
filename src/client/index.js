/* eslint no-eval: 0 */

import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import saveAs from 'file-saver';

import Portal from '../modules/Portal';
import Chargen from '../modules/Chargen';
import Mailbox from '../modules/Mailbox';
import Sendmail from '../modules/Sendmail';
import BBoard from '../modules/BBoard';
import Upload from '../modules/Upload';
import Triggers from '../modules/Triggers';

import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import Utils from './utils';
import JSONAPI from './jsonapi';

import 'jspanel4/dist/jspanel.min.css';

import { jsPanel } from 'jspanel4';

import shortid from 'shortid';

//import 'jspanel4/es6module/extensions/hint/jspanel.hint.js';
//import 'jspanel4/es6module/extensions/modal/jspanel.modal.js';
//import 'jspanel4/es6module/extensions/contextmenu/jspanel.contextmenu.js';
//import 'jspanel4/es6module/extensions/tooltip/jspanel.tooltip.js';
//import 'jspanel4/es6module/extensions/layout/jspanel.layout.js';
//import 'jspanel4/es6module/extensions/dock/jspanel.dock.js';

const EventEmitter = require('events');
const TinyCon = require('tinycon');
const Colors = require('@material-ui/core/colors');

const LOGINFAIL = [
  /There is no player with that name\./,
  /That is not the correct password\./,
  /Either that player does not exist, or has a different password\./,
  /You cannot connect to that player at this time\./,
  /Guest connections not allowed\./,
  /Connection to .* (Non-GUEST) not allowed from .* (.*)/,
  /Too many guests are connected now\./
];

class Client {

  constructor() {
    // client settings
    this.settings = {
      // default emulator fg/bg
      ansiFG: 'ansi-37',
      ansiBG: 'ansi-40',
      wrapWidth: 100,
      invertHighlight: false,
      // upload editor
      decompileEditor: true,
      decompileKey: 'FugueEdit > ',
      // sidebar navigation
      sidebarOpen: true,
      sidebarAnchor: "left",
      sidebarWidth: "192px",
      sidebarAlwaysShow: true,
      sidebarShowPlayers: true,
      sidebarShowThings: true,
      sidebarShowExits: true,
      sidebarShowCompass: true,
      // debugging
      debugEvents: false,
    };
    this.defaultSettings = Object.assign({}, this.settings);
    this.loadSettings();
    
    // triggers, timers, macros, and keybindings
    this.triggers = [];
    this.timers = [];
    this.macros = [];
    this.keys = [];
    this.loadTriggers();
    this.loadTimers();
    this.loadMacros();
    this.loadKeys();
    
    // Client colors and theme
    this.colors = Colors;
    this.theme = this.createTheme();
    
    // Terminal UI elements
    this.output = null;
    this.prompt = null;
    this.input = null;
    
    // External Components
    this.events = new EventEmitter();
    this.panels = jsPanel;
    this.tinycon = TinyCon;
    
    // React Components
    this.react = {
      portal: null,
      taskbar: null,
      terminal: null,
      input: null,
      statusbar: null,
      login: null,
      mailbox: null,
      sendmail: null,
      bboard: null,
      upload: null,
      triggers: null,
    };
    
    // client variables
    this.conn = null;
    this.container = null;
    
    // default connection settings, can override in public/local.js
    this.serverAddress = "node.grapenut.org";
    this.serverPort = 2001;
    this.serverSSL = true;

    // app instance toggles
    this.loggedIn = false;
    this.jsonapi = false;
    this.hidden = false;
    this.updateCounter = 0;
    this.updateLines = 0;
    this.eatNewline = false;
    
    // delay time for auto-contents
    this.delayContents = 500;
    
    // number of lines of scroll within which the output scroll down when new items are received
    this.scrollThreshold = 5;
    
    // handle auto-reconnects
    this.reconnectTimer = 2000;
    this.reconnectCount = 0;
    this.reconnectMaxCount = 10;
    
    // init other libraries
    window.client = this;
    this.initPanels();
    this.initNotifications();
    
    // render the app
    this.render();
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // rendering, themeing, and styling react components
  
  // render the main react component
  render() {
    ReactDOM.render(React.createElement(Portal, { theme: this.theme }, null), document.getElementById('root'));
  }
  
  // load additional scripts for custom events
  loadScript(src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    document.getElementsByTagName('body')[0].appendChild(tag);
  }
  
  // load custom CSS style sheet
  loadStyle(src) {
    var style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("type", "text/css");
    style.setAttribute("href", src);
    document.getElementsByTagName("head")[0].appendChild(style);
  }
  
  // unload custom CSS style sheet
  unloadStyle(src) {
    var links = document.getElementsByTagName("link");
    for (var i = links.length; i >= 0; i--) {
      if (links[i] && links[i].getAttribute("href") !== null && links[i].getAttribute("href").indexOf(src) !== -1) {
        links[i].parentNode.removeChild(links[i]);
      }
    }
  }
  
  // create a theme
  createTheme(theme) {
    const defaultTheme = {
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: this.colors.indigo,
        secondary: this.colors.blueGrey,
        type: 'dark',
      },
    };
    
    return createMuiTheme(Object.assign(defaultTheme, theme));
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // save and load objects from localStorage
  
  // load object from localstorage
  loadLocalStorage(obj, key) {
    if (window.localStorage.hasOwnProperty(key)) {
      obj = Object.assign(obj, JSON.parse(window.localStorage[key]));
    }
  }
  
  // clear localStorage keys starting with prefix
  clearLocalStorage(key) {
    delete window.localStorage[key];
  }
  
  // save object to localstorage
  saveLocalStorage(obj, key) {
    window.localStorage[key] = JSON.stringify(obj);
  }
  
  // casting a string argument to the correct type
  castString(obj, key, value) {
    if (!obj.hasOwnProperty(key)) return;
    
    var type = typeof obj[key];
    
    if (typeof value === type) {
      obj[key] = value;
    } else {
      switch (type) {
        case "string":
          obj[key] = String.bind(null, value)();
          break;
        case "number":
          obj[key] = Number.bind(null, value)();
          break;
        case "boolean":
          obj[key] = (value === "true" ? true : false);
          break;
        default:
          obj[key] = value;
          break;
      }
    }
  }
  
  // change a setting, performing a secondary action if necessary
  changeSetting(key, value) {
    this.castString(this.settings, key, value);
    
    if (key === 'invertHighlight') {
      if (this.settings[key]) {
        this.loadStyle('./inverse.css');
      } else {
        this.unloadStyle('./inverse.css');
      }
    }
  }
  
  // load regex/wildcard pattern triggers
  loadTriggers() {
    this.loadLocalStorage(this.triggers, "triggers");
  }
  
  // load automatic timers
  loadTimers() {
    this.loadLocalStorage(this.timers, "timers");
  }
  
  // load slash command macros
  loadMacros() {
    this.loadLocalStorage(this.macros, "macros");
  }
  
  // load custom keybindings
  loadKeys() {
    this.loadLocalStorage(this.keys, "keys");
  }
  
  // load client settings
  loadSettings() {
    this.loadLocalStorage(this.settings, "settings");
    
    if (this.settings['invertHighlight']) {
      this.loadStyle('./inverse.css');
    } else {
      this.unloadStyle('./inverse.css');
    }
  }
  
  // save regex/wildcard pattern triggers
  saveTriggers() {
    this.clearLocalStorage("triggers");
    this.saveLocalStorage(this.triggers, "triggers");
  }
  
  // save automatic timers
  saveTimers() {
    this.clearLocalStorage("timers");
    this.saveLocalStorage(this.timers, "timers");
  }
  
  // save slash command macros
  saveMacros() {
    this.clearLocalStorage("macros");
    this.saveLocalStorage(this.macros, "macros");
  }
  
  // save custom keybindings
  saveKeys() {
    this.clearLocalStorage("keys");
    this.saveLocalStorage(this.keys, "keys");
  }
  
  // save client settings
  saveSettings() {
    this.clearLocalStorage("settings");
    this.saveLocalStorage(this.settings, "settings");
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // miscellaneous logging and command links
  
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
  // manage triggers, timers, macros, and keys
  
  addTrigger(name, pattern, regex, action) {
    this.triggers.push({ name, pattern, regex, action });
  }
  
  delTrigger(which) {
    this.triggers.splice(which, 1);
  }
  
  addTimer(name, delay, repeat, times, action) {
    this.timers.push({ name, delay, repeat, times, action });
  }
  
  delTimer(which) {
    this.timers.splice(which, 1);
  }
  
  addMacro(name, javascript, action) {
    this.macros.push({ name, javascript, action });
  }
  
  delMacro(which) {
    this.macros.splice(which, 1);
  }
  
  addKey(name, key, ctrl, alt, shift, action) {
    this.keys.push({ name, key, ctrl, alt, shift, action });
  }
  
  delKey(which) {
    this.keys.splice(which, 1);
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // initialize terminal elements (input, output, prompt) and clear them
  
  // clear terminal
  clear() {
    this.output && this.output.clear();
    this.prompt && this.prompt.clear();
    this.input && this.input.clear();
  }

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
  initOutput(output, container=null) {
    // Output window
    if (output !== null) {
      this.output = new Emulator(output);
      this.output.container = container;
      this.output.onCommand = (cmd) => { this.onCommand(cmd); };

      output.onunload = () => { this.sendText('QUIT'); this.close(); };
      output.onresize = () => { this.output && this.output.scrollDown(); };
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
  // handle input window focus and output window scrolling
  
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
  focus(force) {
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
  // spawn, focus and close window panels
  
  // spawn a window using a react components
  addReactPanel(name, cfg) {
    var el = null;
    var obj = null;
    switch (name) {
      case 'Chargen':
        el = Chargen;
        break;
      case 'Mailbox':
        el = Mailbox;
        obj = this.react.mailbox;
        break;
      case 'Upload':
        el = Upload;
        obj = this.react.upload;
        break;
      case 'Sendmail':
        el = Sendmail;
        obj = this.react.sendmail;
        break;
      case 'BBoard':
        el = BBoard;
        obj = this.react.bboard;
        break;
      case 'Triggers':
        el = Triggers;
        obj = this.react.triggers;
        break;
      default:
        break;
    }
    
    if (!el) {
      return;
    }
    
    if (obj) {
      this.focusPanel(name);
      return;
    }
    
    var config = cfg || {};
    
    if (!config.headerTitle) {
      config.headerTitle = name;
    }
    
    if (!config.headerLogo) {
      var icon = config.icon || "tab";
      config.headerLogo = "<i class='material-icons' style='margin-left: "+this.theme.spacing.unit+"px'>"+icon+"</i>";
    }
    
    config.callback = (container) => {
      container.content.style.backgroundColor = this.theme.palette.background.paper;
      var child = React.createElement(el, { panel: container }, null);
      ReactDOM.render(React.createElement(MuiThemeProvider, { theme: this.theme }, child), container.content);
    };
    
    config.container = this.container;
    
    this.panels.create(config);
  }
  
  closePanel(name) {
    var panels = this.panels.getPanels(function() {
      return (this.id === name || this.headertitle.innerText === name);
    });
    
    if (panels.length > 0) {
      if (panels[0].status === 'minimized') {
        this.react.taskbar.popTask(panels[0]);
      }
      panels[0].close();
    }
  }
  
  focusPanel(name) {
    var panels = this.panels.getPanels(function() {
      return (this.id === name || this.headertitle.innerText === name);
    });
    
    if (panels.length > 0) {
      if (panels[0].status === 'minimized') {
        this.react.taskbar.popTask(panels[0]);
      } else {
        panels[0].unsmallify();
        panels[0].front();
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  // connect to the game server and setup message handlers
  connect() {
    var client = this;

    let serverProto = this.serverSSL ? "wss://" : "ws://";

    // The connection URL is ws://host:port/wsclient (or wss:// for SSL connections)
    let serverUrl = serverProto + this.serverAddress + ":" + this.serverPort + '/wsclient'
    
    this.close();
    this.conn = new Connection(serverUrl);

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
    
    // onMessage callback before data handler
    this.conn.onUpdate = function(channel, data) {
      if (!client.conn.hasData) {
        // this is the first update, show the login screen
        client.react.login && client.react.login.openLogin();
        
        // send the screen dimensions
        client.sendText("SCREENWIDTH " + client.settings.wrapWidth);
        client.sendText("SCREENHEIGHT " + Math.floor(client.output.root.parentNode.clientHeight / client.output.dims.height));
      }
      
      if (client.hidden && data.endsWith('\n')) {
        client.updateCounter++;
        // eventually set client.updateLines to the number of new lines
        // and show that instead

        /* use a timer to prevent update spamming */
        clearTimeout(client.setBubble);
        setTimeout(client.setBubble, 1000);
      }
    }

    // handle incoming text
    this.conn.onText = function (text) {
      if (!client.loggedIn) {
        // match some login error conditions
        for (let i = 0; i < LOGINFAIL.length; i++) {
          if (text.match(LOGINFAIL[i])) {
            client.react.login && client.react.login.openLogin(text);
            break;
          }
        }
        
        // we logged in
        if (text.match(/Last( FAILED)? connect was from/)) {
          client.loggedIn = true;
          setTimeout(() => {
            if (!client.jsonapi) {
              client.sendAPI("listcontents");
            }
          }, client.delayContents);
        }
      }
    
      var re_fugueedit = new RegExp('^'+client.settings.decompileKey);
      if (text.match(re_fugueedit)) {
        var str = text.replace(re_fugueedit, "");
        client.eatNewline = true;
        
        // send @dec/tf to the upload editor, or the command window
        if (client.settings.decompileEditor) {
          client.addReactPanel("Upload", { icon: 'cloud_upload' });
          client.react.upload.editor.current.editor.insert(str+"\n");
        } else {
          client.input.root.value = str;
        }
        return;
      } else if (client.eatNewline && (text === "\n" || text === "\r\n")) {
        client.eatNewline = false;
        return;
      }
      
      client.eatNewline = false;
      client.scrollIfNeeded(() => client.output.appendText(text));
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
      var op = "";
      if (obj.hasOwnProperty('gmcp')) {
        op = obj.gmcp;
      } else if (obj.hasOwnProperty('op')) {
        op = obj.op;
      }
      
      if (op && op !== "") {
        client.settings.debugEvents && console.log("JSON "+op+":", obj);
        client.events.emit(op, obj);
      } else {
        client.settings.debugEvents && console.log("JSON (unknown):", obj);
      }
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
    if (!this.isConnected()) {
      // connection was broken, let's force a reconnect
      this.conn && this.conn.reconnect();
      this.scrollIfNeeded(() => this.appendMessage('logMessage', '%% Reconnecting to server...'));
      return;
    }
    
    if (cmd === '') return;
    
    let matched = false;
    
    if (cmd.startsWith('/')) {
      let macro = cmd.split(' ')[0].slice(1);
      if (macro !== '') {
        this.macros.forEach((m) => {
          if (macro === m.name) {
            matched = true;
            if (m.javascript) {
              eval(m.action);
            } else {
              this.sendText(m.action);
            }
          }
        });
        if (matched) {
          this.scrollIfNeeded(() => this.appendMessage('localEcho', cmd));
          return;
        }
      }
    }
    
    this.sendText(cmd);
    this.scrollIfNeeded(() => this.appendMessage('localEcho', cmd));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // send an API command, falling back to the raw softcode if the server doesn't support it
  sendAPI(cmd, args) {
    if (this.jsonapi) {
      var str = String(cmd);
      
      if (args) {
        var astr = String(args);
        if (astr.length > 0) {
          str += " "+astr;
        }
      }
      
      this.sendText("jsonapi/"+str);
    } else {
      if (JSONAPI.hasOwnProperty(cmd)) {
        JSONAPI[cmd](this, args);
      }
    }
  }
  
  execString(code, callback) {
    var id = "exec_"+shortid.generate();
    var cmd = "th null(oob(%#,"+id+",json(object,result,json(string,"+code+"))))";
    
    this.events.on(id, (obj) => {
      callback(obj.result);
      this.events.removeAllListeners([id]);
    });
    
    this.sendText(cmd);
  }

  execJSON(code, callback) {
    var id = "exec_"+shortid.generate();
    var cmd = "th null(oob(%#,"+id+","+code+"))";
    
    this.events.on(id, (obj) => {
      callback(obj);
      this.events.removeAllListeners([id]);
    });
    
    this.sendText(cmd);
  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // save the current display to a log file
  saveLog(filename) {
    if (!this.output) return;
    var node = this.output.root;
    var text = (node.innerText || node.textContent);
    if (text.length > 0) {
      var blob = new Blob([text], {type: "text/html;charset=utf-8"});
      saveAs(blob, filename);
    } else {
      alert("File not saved! The current output is empty.");
    }
  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  setBubble = () => {
    if (this.hidden) {
      this.tinycon.setBubble(this.updateCounter);
    } else {
      this.tinycon.setBubble(0);
    }
  };
  
  initNotifications() {
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange; 
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === undefined) {
      console.log("This browser does not support background notifications.");
    } else {
      // Handle page visibility change   
      document.addEventListener(visibilityChange, () => {
        this.updateCounter = 0;
        this.updateLines = 0;
        if (document[hidden]) {
          this.hidden = true;
        } else {
          this.hidden = false;
        }
        this.setBubble();
      }, false);
    }
    
    // set tinycon options
    this.tinycon.setOptions({
      fallback: true,
      abbreviate: true,
    });
  }

  // set panel default parameters and event handlers
  initPanels() {
    this.panels.defaults.minimizeTo = false;
    this.panels.defaults.onminimized = function(container) {
      window.client.react.taskbar.pushTask(this);
      window.client.focus();
    };
    
    this.panels.defaults.onclosed = function(container) {
      ReactDOM.unmountComponentAtNode(container.content)
      window.client.focus();
    };
    
    this.panels.defaults.dragit.start = function() {
      window.client.input.saveCursor();
    };
    
    this.panels.defaults.resizeit.start = function() {
      window.client.input.saveCursor();
    };
    
    this.panels.defaults.dragit.stop = function() {
      window.client.focus();
      window.client.input.resetCursor();
    };
    
    this.panels.defaults.resizeit.stop = function() {
      window.client.focus();
      window.client.input.resetCursor();
    };
  }
}



export default Client;
export { Connection, Emulator, UserInput, Utils };

