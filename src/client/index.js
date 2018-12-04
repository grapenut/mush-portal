/* eslint no-eval: 0 */
/* eslint no-unused-vars: 0 */

import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import saveAs from 'file-saver';

import Portal from '../modules/Portal';
import Mailbox from '../modules/Mailbox';
import Sendmail from '../modules/Sendmail';
import BBoard from '../modules/BBoard';
import Upload from '../modules/Upload';
import Backup from '../modules/Backup';
import Configure from '../modules/Configure';
import Spawn from '../modules/Spawn';

import Connection from './connection';
import Emulator from './emulator';
import UserInput from './userinput';
import JSONAPI from './jsonapi';
import Templates from './templates';

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

/**
 * List of standard server login failure messages.
 *
 * @const {string[]}
 */
const LOGINFAIL = [
  /There is no player with that name\./,
  /That is not the correct password\./,
  /Either that player does not exist, or has a different password\./,
  /You cannot connect to that player at this time\./,
  /Guest connections not allowed\./,
  /Connection to .* (Non-GUEST) not allowed from .* (.*)/,
  /Too many guests are connected now\./
];

/**
 * Maps Unicode characters to ASCII characters.
 *
 * @const {Object.<string, string>}
 */
const UnicodeMap = {
  "\u2013": '-',
  "\u2014": '-',
  "\u2018": '\'',
  "\u2019": '\'',
  "\u201B": '\'',
  "\u201C": '"',
  "\u201D": '"',
  "\u201F": '"',
  "\u2032": '\'',
  "\u2033": '"',
  "\u2035": '\'',
  "\u2036": '"',
}


class Client {


  /**
   * The main Client class controls and links together everything.
   * @constructor
   */
  constructor() {
    // Client colors and theme
    this.colors = Colors;
    this.theme = this.createTheme();
    this.mobile = !window.matchMedia(this.theme.breakpoints.up('md').substring(7)).matches;
    
    // client settings
    this.defaultSettings = {
      // font
      fontFamily: "Courier New",
      fontSize: 10,
      // default text colors
      ansiFG: 'ansi-37',
      ansiBG: 'ansi-40',
      invertHighlight: false,
      // terminal settings
      terminalWidth: 100,
      terminalAutoScroll: true,
      // upload editor
      decompileEditor: true,
      decompileKey: 'FugueEdit > ',
      // sidebar navigation
      sidebarOpen: true,
      sidebarAnchor: "right",
      sidebarDense: true,
      sidebarAlwaysShow: false,
      sidebarShowPlayers: true,
      sidebarShowThings: true,
      sidebarShowExits: true,
      sidebarShowCompass: true,
      sidebarLargeCompass: true,
      // debugging
      debugEvents: false,
      debugActions: false,
      // default connection settings, can override in public/local.js
      allowServerChange: true,
      serverAddress: "node.grapenut.org",
      serverSSL: window.location.protocol === "https:",
      serverPort: window.location.protocol === "https:" ? 2001 : 2000,
      // history settings
      historySize: 1000,
      historySpawnSize: 100,
      // command recall
      recallButtons: true,
      recallAnchor: "right",
      recallSize: 1000,
      // mobile settings
      mobileFontSize: 6,
      mobileHideTaskbar: true,
      mobileHideStatusbar: true,
      // user configured actions
      timersEnabled: false,
      timersAutoStart: false,
      activityEnabled: true,
      activityReposition: false,
    };
    this.settings = null;
    
    // map react components to strings
    this.components = {
      "Mailbox": Mailbox,
      "Sendmail": Sendmail,
      "BBoard": BBoard,
      "Upload": Upload,
      "Backup": Backup,
      "Configure": Configure,
      "Spawn": Spawn,
    };
    
    this.templates = new Templates();
    
    this.buttons = [];
    this.triggers = [];
    this.timers = [];
    this.macros = [];
    this.keys = [];
    this.scripts = [{ name: "onLoad.js", text: "" }];
    this.css = [{ name: "ansi.css", text: "" },
                { name: "inverse.css", text: "" }];
    
    this.loadButtons();
    this.loadTriggers();
    this.loadTimers();
    this.loadMacros();
    this.loadKeys();
    this.loadCSS();
    this.loadScripts();
    
    // must come after client .css definitions
    this.loadSettings();
    
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
      backup: null,
      configure: null,
      spawns: [],
    };
    
    // client variables
    this.conn = null;
    this.container = null;
    
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
    
    // start cron timer loop
    this.startTimers();
    
    // bind keys
    this.bindKeys();
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // rendering, themeing, and styling react components
  
  /** Render the main React component. */
  render() {
    ReactDOM.render(React.createElement(Portal, { theme: this.theme }, null), document.getElementById('root'));
  }
  
  /**
   * Load a script from the source URL by appending a <script> tag to the body.
   * @param {string} src - The URL of the script to load.
   */
  loadScript(src, onLoad, onError) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    tag.onload = onLoad;
    tag.onerror = onError;
    document.getElementsByTagName('body')[0].appendChild(tag);
  }
  
  /**
   * Find and execute a user-defined script by name.
   * @param {string} name - Name of the script to execute.
   */
  execUserScript(name) {
    // load user customization file
    const client = this;
    var script = null;
    for (let i=0; i < client.scripts.length; i++) {
      if (client.scripts[i].name === name) {
        script = client.scripts[i];
        break;
      }
    }
    
    if (script && script.text !== "") {
      this.execActionScript(script.text);
    }
  }
  
  /**
   * Evaluate a fragment of Javascript code.
   * @param {string} txt - The code to execute.
   * @param {Event} [event] - The event, if present.
   */
  execActionScript(txt, event) {
    const client = this;
    const Window = (w,c,e) => this.getSpawn(w,c,e);
    const SendAPI = (cmd) => this.sendAPI(cmd);
    const Send = (cmd) => this.sendCommand(cmd);
    const SendText = (cmd) => this.sendText(cmd);
    const Append = (text) => this.output.appendText(text);
    const Output = this.output;
    const Input = this.input;
    const UI = this.react;
    
    try {
      eval(txt);
    } catch (e) {
      client.settings.debugActions && console.log("Error executing action:", e);
    }
  }
  
  /**
   * Load custom CSS style sheet from the source URL by appending a <link> tag to the head.
   * @param {string} src - The URL of the CSS file to load.
   */
  loadStyle(src) {
    const file = src.split('/').slice(-1)[0];

    // see if we have a matching css override
    var css = null;
    for (let i=0; i < this.css.length; i++) {
      if (this.css[i].name === file) {
        css = this.css[i];
        break;
      }
    }
    
    var style;
    if (css) {
      // just update the <style> element
      style = this.updateCSS(css);
      if (css.text !== "") return;
    }
    
    // css is not overridden, try to load a <link>
    style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("type", "text/css");
    style.setAttribute("href", src);
    document.head.appendChild(style);
  }
  
  /**
   * Update the CSS definition object's rules on its <style> element.
   * @param {Object.<string, string>} css - The CSS definition object.
   * @param {boolean} [erase=false] - Erase the existing style first.
   * @return {HTMLElement} - The <style> tag with CSS added.
   */
  updateCSS(css, erase=false) {
    if (!css) return null;
    
    var style = document.getElementById("override_" + css.name);
    if (style) {
      // remove what's already there
      while (style.firstChild) {
        style.removeChild(style.firstChild);
      }
    } else {
      // create a new style element
      style = document.createElement('style');
      style.setAttribute('id', 'override_' + css.name);
      document.head.appendChild(style);
    }
    
    // update the CSS text on the <style> element
    if (!erase) style.appendChild(document.createTextNode(css.text));
    
    return style;
  }
  
  /**
   * Uunload custom CSS style sheet loading from source URL.
   * @param {string} src - The source URL of the CSS file to unload.
   */
  unloadStyle(src) {
    // remove the <link> if it exists
    var links = document.getElementsByTagName("link");
    for (var i = links.length; i >= 0; i--) {
      if (links[i] && links[i].getAttribute("href") !== null && links[i].getAttribute("href").indexOf(src) !== -1) {
        links[i].parentNode.removeChild(links[i]);
      }
    }
    
    // see if we have a css override to erase
    const file = src.split('/').slice(-1)[0];
    var css = null;
    for (let i=0; i < this.css.length; i++) {
      if (this.css[i].name === file) {
        css = this.css[i];
        break;
      }
    }
    
    // we found a css override, delete the contents
    if (css) {
      this.updateCSS(css, true);
    }
  }
  
  /**
   * Create a new Material-UI theme from a theme configuration object.
   * @param {Object.<string,*>} [theme] - The theme configuration object.
   * @return {MuiTheme} - The new theme object.
   */
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
  
  /**
   * Save a text string to a local file.
   * @param {string} filename - The name of the file to save.
   * @param {string} text - The text of the file to save.
   * @param {string} [type=text/plain] - The MIME type of the file Blob.
   * @return {boolean} - Whether the save was successful or not.
   */
  saveText(filename, text, type) {
    if (!type) {
      type = "text/plain";
    }
    
    if (text.length > 0) {
      var blob = new Blob([text], { type });
      saveAs(blob, filename);
      return true;
    } else {
      return false;
    }
  }
  
  /**
   * Convert localStorage to JSON object text.
   * @param {string} [indent=0] - If indent != 0 we use a pretty printer. If 0 or undefined we minify.
   * @return {string} - The JSON.stringified object text.
   */
  localStorageToText(indent) {
    const store = window.localStorage;
    var keys = { };
    Object.keys(store).forEach(key => { keys[key] = store[key]; });
    
    if (indent) {
      return JSON.stringify(keys, (key,value) => {
        switch (key) {
          case 'buttons':
          case 'triggers':
          case 'timers':
          case 'macros':
          case 'keys':
          case 'css':
          case 'scripts':
          case 'settings':
          case 'recall_history':
            return JSON.parse(value);
          default:
            return value;
        }
      }, indent);
    } else {
      return JSON.stringify(keys);
    }
  }
    
  /**
   * Restore localStorage from a string.
   * @param {string} text - The string from which to restore localStorage.
   * @return {boolean} - Whether the text was succesfully parsed and merged with localStorage.
   */
  restoreLocalStorage(text) {
    var store;
    try {
      store = JSON.parse(text, (key,value) => {
        switch (key) {
          case 'buttons':
          case 'triggers':
          case 'timers':
          case 'macros':
          case 'keys':
          case 'css':
          case 'scripts':
          case 'settings':
          case 'recall_history':
            return JSON.stringify(value);
          default:
            return value;
        }
      });
    } catch (e) {
      alert("Failed to parse local storage file!");
      return false;
    }
    
    if (store) {
      Object.keys(store).forEach(key => {
        window.localStorage[key] = store[key];
        
        if (key === "output_history") {
          this.output.loadHistory(key);
        } else if (key.startsWith("output_history_")) {
          let name = key.split('_').slice(2).join('_');
          let panel = this.findSpawn(name);
          panel && panel.react && panel.react.output.loadHistory(key);
        }
      });
      
      this.loadRecallHistory();
      this.loadButtons();
      this.loadTriggers();
      this.loadTimers();
      this.loadMacros();
      this.loadKeys();
      this.loadCSS();
      this.loadScripts();
      this.loadSettings();
      
      this.react.portal.forceUpdate();
    } else {
      alert("Failed to parse local storage file!");
      return false;
    }
    return true;
  }
  
  /**
   * Load a configuration object string from localStorage.
   * @param {Object.<string.*>} obj - The reference onto which to store the retrieved object.
   * @param {string} key - The key of the object on localStorage.
   */
  loadLocalStorage(obj, key) {
    if (window.localStorage.hasOwnProperty(key)) {
      obj = Object.assign(obj, JSON.parse(window.localStorage[key]));
    }
  }
  
  /**
   * Delete a configuration object from localStorage.
   * @param {string} key - The key of the object on localStorage.
   */
  clearLocalStorage(key) {
    delete window.localStorage[key];
  }
  
  /**
   * Save a configuration object to localStorage.
   * @param {Object.<string,*>} obj - The object to be stored.
   * @param {string} key - The key of the object on localStorage.
   */
  saveLocalStorage(obj, key) {
    window.localStorage[key] = JSON.stringify(obj);
  }
  
  /**
   * Load a history buffer string from localStorage.
   * @param {string} key - The key of the buffer on localStorage.
   * @return {string} - The buffer string.
   */
  loadHistoryBuffer(key) {
    if (window.localStorage.hasOwnProperty(key)) {
      return window.localStorage[key];
    }
    return "";
  }
  
  /**
   * Save a history buffer string to localStorage.
   * @param {string} key - The key of the buffer on localStorage.
   * @param {string} text - The value of the buffer.
   */
  saveHistoryBuffer(key, text) {
    window.localStorage[key] = text;
  }
  
  /**
   * Set a value on an object, converting the argument to the correct type.
   * @param {Object.<string,*>} obj - The object on which to store the value.
   * @param {string} key - The key of the value to store on the object.
   * @param {*} value - The value to be stored.
   */
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
  
  /**
   * Change a setting, updating the UI if necessary.
   * @param {string} key - The key of the setting to change.
   * @param {string} value - The new value of the setting.
   */
  changeSetting(key, value) {
    this.castString(this.settings, key, value);
    
    if (key === 'invertHighlight') {
      if (this.settings[key]) {
        this.loadStyle('./inverse.css');
      } else {
        this.unloadStyle('./inverse.css');
      }
    } else if (key === 'terminalWidth') {
      // send the screen dimensions
      this.output.calcDimensions();
      this.sendText("SCREENWIDTH " + this.settings.terminalWidth);
      this.sendText("SCREENHEIGHT " + Math.floor(this.output.root.parentNode.clientHeight / this.output.dims.height));
    } else if (key === 'timersEnabled') {
      if (this.settings[key]) {
        this.startTimers();
      } else {
        this.stopTimers();
      }
    }
  }
  
  /** Load user-defined taskbar buttons. */
  loadButtons() {
    this.loadLocalStorage(this.buttons, "buttons");
//    this.react.taskbar && this.react.taskbar.forceUpdate();
  }
  
  /** Load regex/wildcard pattern triggers. */
  loadTriggers() {
    this.loadLocalStorage(this.triggers, "triggers");
  }
  
  /** Load automatic timers. */
  loadTimers() {
    this.loadLocalStorage(this.timers, "timers");
  }
  
  /** Load slash command macros. */
  loadMacros() {
    this.loadLocalStorage(this.macros, "macros");
  }
  
  /** Load custom keybindings. */
  loadKeys() {
    this.loadLocalStorage(this.keys, "keys");
  }
  
  /** Load custom css overrides. */
  loadCSS() {
    this.loadLocalStorage(this.css, "css");
    
    for (let i=0; i < this.css.length; i++) {
      // override CSS, first check existing styles
      let css = this.css[i];
      
      // autoload CSS changes, except inverse.css
      if (css.name !== "inverse.css") {
        this.updateCSS(css);
      }
    }
  }
  
  /** Load custom scripts. */
  loadScripts() {
    this.loadLocalStorage(this.scripts, "scripts");
  }
  
  /** Load client settings. */
  loadSettings() {
    this.settings = Object.assign({}, this.defaultSettings);
    this.loadLocalStorage(this.settings, "settings");
    
    if (this.settings.invertHighlight) {
      this.loadStyle('./inverse.css');
    } else {
      this.unloadStyle('./inverse.css');
    }
    
    if (!this.settings.timersAutoStart) {
      this.settings.timersEnabled = false;
    }
  }
  
  /** Load command recall history. */
  loadRecallHistory() {
    this.loadLocalStorage(this.input.history, "recall_history");
  }
  
  /** Save command recall history. */
  saveRecallHistory() {
    const { recallSize } = this.settings;
    this.clearLocalStorage("recall_history");
    this.saveLocalStorage(this.input.history.slice(-recallSize), "recall_history");
  }
  
  /** Save user-defined taskbar buttons. */
  saveButtons() {
    this.clearLocalStorage("buttons");
    this.saveLocalStorage(this.buttons, "buttons");
    this.react.taskbar && this.react.taskbar.forceUpdate();
  }
  
  /** Save regex/wildcard pattern triggers. */
  saveTriggers() {
    this.clearLocalStorage("triggers");
    this.saveLocalStorage(this.triggers, "triggers");
  }
  
  /** Save automatic timers. */
  saveTimers() {
    this.clearLocalStorage("timers");
    this.saveLocalStorage(this.timers, "timers");
  }
  
  /** Save command macros. */
  saveMacros() {
    this.clearLocalStorage("macros");
    this.saveLocalStorage(this.macros, "macros");
  }
  
  /** Save custom keybindings. */
  saveKeys() {
    this.clearLocalStorage("keys");
    this.saveLocalStorage(this.keys, "keys");
  }
  
  /** Save custom css overrides. */
  saveCSS() {
    this.clearLocalStorage("css");
    this.saveLocalStorage(this.css, "css");
    
    for (let i=0; i < this.css.length; i++) {
      // update rules in css <style> element
      let css = this.css[i];
      
      if (css.name === "inverse.css") {
        // only load inverse.css if we need it
        if (this.settings.invertHighlight) {
          // unload inverse.css if it is linked
          let links = document.getElementsByTagName("link");
          for (let j = links.length; j >= 0; j--) {
            if (links[j] && links[j].getAttribute("href") !== null) {
              let name = links[j].getAttribute("href").split("/").slice(-1)[0];
              if (name === css.name) {
                links[j].parentNode.removeChild(links[j]);
              }
            }
          }
          
          if (css.text === "") {
            // there is no override, so relink inverse.css
            this.loadStyle('./inverse.css');
          } else {
            // there is an override, update it
            this.updateCSS(css);
          }
        }
      } else {
        // autoload all files that aren't inverse.css
        this.updateCSS(css);
      }
    }
  }
  
  /** Save custom css overrides. */
  saveScripts() {
    this.clearLocalStorage("scripts");
    this.saveLocalStorage(this.css, "scripts");
  }
  
  /** Save client settings. */
  saveSettings() {
    this.clearLocalStorage("settings");
    this.saveLocalStorage(this.settings, "settings");
  }
  

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // miscellaneous logging and command links

  /**
   * Detect if more user input is required for a pueblo command.
   * @param {string} command - The command string to parse for '??' tokens.
   * @return {string} - The command string with '??' tokens replace by user input.
   */
  parseCommand(command) {
    var cmd = command;
    var regex = new RegExp('\\?\\?');
    
    // check for the search token '??'
    if (cmd.search(regex) !== -1) {
      var val = prompt(command);
      
      if (val === null) {
        // user cancelled the prompt, don't send any command
        cmd = '';
      } else {
        // replace the ?? token with the prompt value
        cmd = cmd.replace(regex, val);
      }
    }
    
    return cmd;
  }
  
  /**
   * Execute a Pueblo command link, checking if it requires user input.
   * @param {string} cmd - The command string.
   */
  onCommand(cmd) {
    this.sendCommand && this.sendCommand(this.parseCommand(cmd));
  }

  /**
   * Log messages to the output terminal.
   * @param {string} classid - The CSS class id of the log message.
   * @param {string} msg - The message to append to the terminal.
   */
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
  
  /**
   * Create a new RegExp pattern, creating one from a glob wildcard pattern if necessary.
   * @param {boolean} regex - Is the pattern already a regex? If not we will make one.
   * @param {string} pattern - The pattern string.
   * @return {RegExp} - The compiled regular expression.
   */
  createPattern(regex, pattern) {
    if (regex) {
      return new RegExp('^' + pattern + '$');
    } else {
      return new RegExp('^' + pattern.split(/\*+/).map(s => s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')).join('(.*)') + '$');
    }
  }
  
  /**
   * Replace %-tokens in a text string with match argument strings.
   * @param {array[string]} args - The arguments array, element 0 is the full string.
   * @param {string} text - The text to be scanned for %number tokens which are replaced by args[number].
   * @return {string} - The new text with arguments replaced if they are present.
   */
  replaceArgs(args, text) {
    let newText = text.slice();
    for (let i = args.length-1; i > -1; i--) {
      let tmp = args[i] || "";
      
      try {
        let re = new RegExp('(^|[^\\%])%'+i, 'g');
        let escre = new RegExp('["\'`]', 'g');
        let esc = tmp.replace(escre, '\\$&');
        newText = newText.replace(re, '$1'+esc);
      } catch (e) {
        this.settings.debugActions && console.log("Unable to compile regular expression:", e);
      }
    }
    return newText;
  }
  

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // initialize terminal elements (input, output, prompt) and clear them
  
  /** Clear the terminal. */
  clear() {
    this.output && this.output.clear();
    this.prompt && this.prompt.clear();
    this.input && this.input.clear();
  }

  /**
   * Initialize the terminal input window.
   * @param {HTMLElement} input - The HTML element to which the Input object is attached.
   */
  initInput(input) {
    // Input window
    if (input !== null) {
      this.input = new UserInput(input);
      this.loadRecallHistory();

      // enter key passthrough from UserInput.pressKey
      this.input.onEnter = (cmd) => {
        this.sendCommand(cmd);
        this.prompt && this.prompt.clear();
        this.settings.terminalAutoScroll && this.output.scrollDown();
      };

      // escape key passthrough from UserInput.pressKey
      this.input.onEscape = () => { this.input.clear(); };
      
      // pageup key passthrough from UserInput.pressKey
      this.input.onPageUp = () => { this.output && this.output.scrollPageUp(); };

      // pagedown key passthrough from UserInput.pressKey
      this.input.onPageDown = () => { this.output && this.output.scrollPageDown(); };
    }
  }

  /**
   * Initialize the terminal output window.
   * @param {HTMLElement} output - The HTML element to which the Emulator object is attached.
   * @param {HTMLElement} [container=null] - The output elements container.
   */
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
  
  /**
   * Initialize the command prompt.
   * @param {HTMLElement} prompt - The HTML element to which the Emulator object is attached.
   */
  initPrompt(prompt) {
    // Prompt window
    if (prompt !== null) {
      this.prompt = new Emulator(prompt);
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // handle input window focus and output window scrolling
  
  //////////////////////////////////////////////////////
  /**
   * Scroll the terminal output window down the very bottom of the current view.
   * @param {HTMLElement} root - The HTML element to be scrolled down.
   */
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
  
  /**
   * Passthrough for focusing the Input root.
   * @param {boolean} force - Whether to force the Input element to focus even if the normal rules determine it shouldn't.
   */
  focus(force) {
    if (this.mobile) return;
    this.input && this.input.focus(force);
  }
  
  /**
   * @callback appendCallback
   */
   
  /**
   * Wrapper for appending text that scrolls the output afterwards if needed.
   * @param {appendCallback} fun - The wrapper function that appends text. 
   */
  scrollIfNeeded(fun) {
    var scroll = false;
    
    if (this.output) {
      if (this.output.nearBottom(this.scrollThreshold)) {
        scroll = true;
      }
      
      fun();
      
      scroll && this.output.scrollDown();
      
      this.react.terminal && this.react.terminal.onChange();
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Add a window panel with the given id and configuration, using a particular React component if provided.
   * @param {string} id - The window id.
   * @param {Object.<string.*>} cfg - The panel configuration.
   * @param {React.Component} [component=Spawn] - The React component that serves as a base.
   * @return {Object} - A reference to the panel if it already exists, or undefined if not.
   */
  addPanel(id, cfg, component) {
    var spawn = this.findSpawn(id);
    
    if (spawn) {
      this.focusPanel(id);
      return spawn;
    }
    
    var comp = component || id;
    var el = this.components[comp];
    
    if (!el) {
      el = Spawn;
    }
    
    var config = cfg || {};
    
    if (!config.id) {
      config.id = id.toLowerCase();
    }
    
    if (!config.headerTitle) {
      config.headerTitle = id;
    }
    
    if (!config.icon) {
      config.icon = "tab";
    }
    
    if (!config.headerLogo) {
      var gameicon = config.icon.startsWith('icon-');
      
      if (gameicon) {
        config.headerLogo = "<i class='" + config.icon + "' style='margin-left: "+this.theme.spacing.unit+"px'></i>";
      } else {
        config.headerLogo = "<i class='material-icons' style='margin-left: "+this.theme.spacing.unit+"px'>" + config.icon + "</i>";
      }
    }
    
    if (!config.panelSize) {
      const margin = this.panels.defaults.maximizedMargin;
      let wstr = 'calc(50% - ' + 1.5*margin + 'px)';

      if (this.mobile) {
        wstr = 'calc(100% - ' + 2*margin + 'px)';
      }
    
      config.panelSize = {
        width: wstr,
        height: 'calc(100% - ' + 2*margin + 'px)',
      };
    }
    
    let ref = React.createRef();
    config.callback = (container) => {
      container.content.style.backgroundColor = this.theme.palette.background.paper;
      config.react = React.createElement(el, { innerRef: ref, id: id.toLowerCase(), panel: container, ...config.props }, null);
      ReactDOM.render(React.createElement(MuiThemeProvider, { theme: this.theme }, config.react), container.content, () => {
        // add the helpText() controlbar icon
        let obj = ref.current;
        if (obj && obj.helpText) {
          let helpButton = document.createElement('div');
          helpButton.classList.add("jsPanel-btn","jsPanel-btn-help");
          helpButton.innerHTML = `<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><circle fill="currentColor" cx="255.984" cy="492" r="20"/><path fill="currentColor" d="M412.979,155.775C412.321,69.765,342.147,0,255.984,0c-86.57,0-157,70.43-157,157c0,11.046,8.954,20,20,20 s20-8.954,20-20c0-64.514,52.486-117,117-117s117,52.486,117,117c0,0.356,0.009,0.71,0.028,1.062 c-0.405,46.562-28.227,88.348-71.12,106.661c-40.038,17.094-65.908,56.675-65.908,100.839V412c0,11.046,8.954,20,20,20 c11.046,0,20-8.954,20-20v-46.438c0-28.117,16.334-53.258,41.614-64.051c57.979-24.754,95.433-81.479,95.418-144.516 C413.016,156.585,413.003,156.179,412.979,155.775z"/></svg>`;
          helpButton.style.color = this.panels.calcColors(this.panels.defaults.theme)[3];
          container.controlbar.insertBefore(helpButton, container.controlbar.firstChild);
          
          jsPanel.pointerup.forEach((which) => {
            helpButton.addEventListener(which, (evt) => {
              obj.helpText(evt.currentTarget);
            });
          });
        }
        
        window.client.react.spawns.push(obj);
      });
      
    };
    
    config.container = this.container;
    
    this.panels.create(config);
    return ref.current;
  }
  
  /** 
   * Create a new window with addPanel if one is not found with findSpawn.
   * @param {string} id - The window id.
   * @param {Object.<string,*>} cfg - The panel configuration object.
   * @param {HTMLElemet} el - The element to create inside the window.
   * @return {jsPanel} - The window panel that was found, or the new one created.
   */
  getSpawn(id, cfg, el) {
    let spawn = this.findSpawn(id);
    if (spawn) return spawn;
    
    return this.addPanel(id, cfg, el);
  }
  
  /**
   * Delete spawn window from internal list.
   * @param {string} id - The window id.
   */
  delSpawn(id) {
    const spawns = this.react.spawns;
    const lower = id.toLowerCase();
    for (let i=0; i < spawns.length; i++) {
      if (spawns[i] && spawns[i].props.id === lower) {
        spawns.splice(i, 1);
      }
    }
  }
  
  /**
   * Find spawn window in internal list.
   * @param {string} id - The window id.
   * @return {jsPanel} - The window panel if found, or null.
   */
  findSpawn(id) {
    const spawns = this.react.spawns;
    const lower = id.toLowerCase();
    for (let i=0; i < spawns.length; i++) {
      if (spawns[i] && spawns[i].props.id.toLowerCase() === lower) {
        return spawns[i];
      }
    }
    return null;
  }
  
  /**
   * Find and close a window panel.
   * @param {string} id - The window id.
   */
  closePanel(id) {
    var panels = this.panels.getPanels(function() {
      return (this.id === id || this.headertitle.innerText === id);
    });
    
    if (panels.length > 0) {
      if (panels[0].status === 'minimized') {
        this.react.taskbar.popTask(panels[0]);
      }
      panels[0].close();
    }
  }
  
  /**
   * Bring a window panel into focus.
   * @param {string} id - The window id.
   */
  focusPanel(id) {
    var panels = this.panels.getPanels(function() {
      return (this.id === id || this.headertitle.innerText === id);
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

  /**
   * Connect to the game server and setup message handlers.
   */
  connect() {
    var client = this;

    let serverProto = this.settings.serverSSL ? "wss://" : "ws://";

    // The connection URL is ws://host:port/wsclient (or wss:// for SSL connections)
    let serverUrl = serverProto + this.settings.serverAddress + ":" + this.settings.serverPort + '/wsclient'
    
    this.close();
    this.conn = new Connection(serverUrl);

    // just log a standard message on these socket status events
    this.conn.onOpen = function (evt) {
      client.appendMessage('logMessage', '%% Connected.');
      client.conn.hasData = false;
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
    
    /** onMessage callback before data handler */
    this.conn.onUpdate = function(channel, data) {
      if (!client.conn.hasData) {
        // this is the first update, show the login screen
        client.react.login && client.react.login.openLogin();
        
        // send the screen dimensions
        client.sendText("SCREENWIDTH " + client.settings.terminalWidth);
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
    
    /** handle incoming text */
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
    
      // implement @dec/tf
      var re_fugueedit = new RegExp('^'+client.settings.decompileKey);
      if (text.match(re_fugueedit)) {
        var str = text.replace(re_fugueedit, "");
        client.eatNewline = true;
        
        // send @dec/tf to the upload editor, or the command window
        if (client.settings.decompileEditor) {
          client.addPanel("Upload", { icon: 'cloud_upload' });
          client.react.upload.editor.current.editor.insert(str+"\n");
        } else {
          client.input.root.value = str;
        }
        return;
      }
      
      // handle text triggers
      let suppress = false;
      client.triggers.forEach((trigger, i) => {
        if (trigger.disabled) return;
        
        let re = client.createPattern(trigger.regex, trigger.pattern);
        let args = text.match(re);
        
        if (args) {
          let txt = client.replaceArgs(args, trigger.text);
          if (trigger.javascript) {
            client.execActionScript(txt);
          } else {
            client.sendText(txt);
          }
        
          if (trigger.suppress) {
            client.eatNewline = true;
            suppress = true;
          }
        }
      });
      
      if (suppress) return;
      
      if (client.eatNewline && (text === "\n" || text === "\r\n")) {
        client.eatNewline = false;
        return;
      }
      
      client.eatNewline = false;
      
      client.scrollIfNeeded(() => client.output.appendText(text));
    };
    
    /** handle incoming html */
    this.conn.onHTML = function (fragment) {
      if (client.output) {
        client.scrollIfNeeded(() => client.output.appendHTML(fragment));
      }
    };
    
    /** handle incoming pueblo */
    this.conn.onPueblo = function (tag, attrs) {
      if (client.output) {
        client.scrollIfNeeded(() => client.output.appendPueblo(tag, attrs));
      }
    };
    
    /** handle incoming command prompts */
    this.conn.onPrompt = function (text) {
      if (client.prompt !== null) {
        client.prompt.clear();
        client.prompt.appendText(text + '\r\n');
      }
    };

    /** handle incoming JSON objects */
    /** use the Events handler collection */
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

  reconnect(force=false) {
    if (!force && this.isConnected()) {
      return;
    }
    
    if (force || this.reconnectCount < this.reconnectMaxCount) {
      // The connection URL is ws://host:port/wsclient (or wss:// for SSL connections)
      let serverProto = window.location.protocol === "https:" || this.settings.serverSSL ? "wss://" : "ws://";
      let serverUrl = serverProto + this.settings.serverAddress + ":" + this.settings.serverPort + '/wsclient';
      
      this.reconnectCount++;
      this.conn && this.conn.reconnect(serverUrl);
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
  
  filterUnicode(text) {
    if (!text) return "";
    try {
      let re = new RegExp("[\u2013\u2014\u2018\u2019\u201B\u201C\u201D\u201F\u2032\u2033\u2035\u2036]","g");
      return text.replace(re, code => UnicodeMap[code]);
    } catch (e) {
      this.settings.debugActions && console.log("Unable to filter Unicode:", e);
    }
    return text;
  }

  sendText(data) {
    this.conn && this.conn.sendText(data);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Send a command string to the server, check macros for a match and append a local echo.
   * @param {string} cmd - The command string to send.
   */
  sendCommand(cmd) {
  
    if (!this.isConnected()) {
      // connection was broken, let's force a reconnect
      this.conn && this.conn.reconnect();
      this.scrollIfNeeded(() => this.appendMessage('logMessage', '%% Reconnecting to server...'));
      return;
    }
    
    if (cmd === '') return;

    cmd = this.filterUnicode(cmd);
    this.sendMacro(cmd);
    this.scrollIfNeeded(() => this.appendMessage('localEcho', cmd));
    this.saveRecallHistory();
  }
  
  /**
   * Check a string for multiple commands and match them against the list of macros.
   * @param {string} cmds - A string of one or more commands separated by newlines.
   */
  sendMacro(cmds) {
    let matched = false;
    this.macros.forEach((m) => {
      if (m.disabled) return;
      
      let re = this.createPattern(m.regex, m.pattern);
      
      cmds.split('\n').forEach((cmd) => {
        let args = cmd.match(re);
      
        if (args) {
          matched = true;
          let text = this.replaceArgs(args, m.text);
          if (m.javascript) {
            this.execActionScript(text);
          } else {
            this.sendMacro(text);
          }
        }
      });
    });
    
    if (!matched) {
      this.sendText(cmds);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Send an API command, falling back to player-executed softcode if the server doesn't support it.
   * @param {string} cmd - The API command name.
   * @param {string[]} args - An array of string arguments to pass to the API command.
   */
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
  
  /**
   * @callback execCallback
   * @param {string} result
   */
  
  /**
   * Execute a MUSH softcode string and return the result as a string in a JSON object.
   * @param {string} code - The code string to execute.
   * @param {execCallback} callback - The callback function to execute when we receive the return value.
   */
  execString(code, callback) {
    var id = "exec_"+shortid.generate();
    var cmd = "th null(oob(%#,"+id+",json(object,result,json(string,"+code+"))))";
    
    this.events.on(id, (obj) => {
      callback(obj.result);
      this.events.removeAllListeners([id]);
    });
    
    this.sendText(cmd);
  }

  /**
   * Execute a MUSH softcode string that creates a JSON object and return it.
   * @param {string} code - The code string to execute.
   * @param {execCallback} callback - The callback function to execute when we receive the return object.
   */
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
  
  /**
   * Save the current display to a log file.
   * @param {string} filename - The name of the log file to save.
   */
  saveLog(filename) {
    if (!this.output) return;
    var node = this.output.root;
    var text = (node.innerText || node.textContent);
    if (!this.saveText(filename, text, "text/html;charset=utf-8")) {
      alert("File not saved! The current output is empty.");
    }
  }
  
  /**
   * Save the entire localStorage to a backup file.
   * @param {string} filename - The name of the backup file to save.
   */
  saveBackup(filename) {
    var text = this.localStorageToText(2);
    if (!this.saveText(filename, text)) {
      alert("File not saved! Local storage is empty.");
    }
  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  /** Set the activity count when the browser tab is out of view. */
  setBubble = () => {
    if (this.hidden) {
      this.tinycon.setBubble(this.updateCounter);
    } else {
      this.tinycon.setBubble(0);
    }
  };
  
  /** Initialize the browser activity notification events. */
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

  /** Set window panel default parameters and event handlers. */
  initPanels() {
    this.panels.defaults.minimizeTo = false;
    this.panels.defaults.onminimized = function(container) {
      window.client.react.taskbar.pushTask(this);
      window.client.focus();
    };
    
    this.panels.defaults.onclosed = function(container) {
      ReactDOM.unmountComponentAtNode(container.content);
      window.client.delSpawn(this.id);
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
  
  
  /////////////////////////////////////////////////////////
  
  /** Enable timers, only if not already enabled. */
  timersEnabled = () => {
    if (this.settings.timersEnabled) return;
    
    this.changeSetting("timersEnabled", true);
  };
  
  /** Disable timers, only if already enabled. */
  disableTimers = () => {
    if (!this.settings.timersEnabled) return;
    
    this.changeSetting("timersEnabled", false);
  };
  
  /** Start the master timer loop, if timers are enabled. */
  startTimers = () => {
    if (this.settings.timersEnabled) {
      clearTimeout(this.runTimers);
      setTimeout(this.runTimers,  1000);
    }
  };
  
  /** Stop the master timer loop. */
  stopTimers = () => {
    clearTimeout(this.runTimers);
  };
  
  /** The master timer loop. */
  runTimers = () => {
    if (!this.settings.timersEnabled) return;
    
    for (let i = 0; i < this.timers.length; i++) {
      const timer = this.timers[i];
      if (timer.disabled) {
        if (timer.timeleft) {
          delete timer.timeleft;
        }
        
        continue;
      }
      
      if (typeof(timer.timeleft) === "undefined") {
        // set initial time
        timer.timeleft = Math.max(1, timer.delay);
      }
      
      if (timer.timeleft > 0) {
        // subtract time
        timer.timeleft--;
      } else {
        // execute timer
        if (timer.javascript) {
          this.execActionScript(timer.text);
        } else {
          this.sendText(timer.text);
        }
        
        if (timer.repeat && timer.times !== 0) {
          // repeat timer, reset time left
          if (timer.times > 0) {
            timer.times--;
          }
          timer.timeleft = timer.delay;
        } else {
          // don't repeat, disable timer
          delete timer.timeleft;
          timer.disabled = true;
        }
      }
    }
  
    setTimeout(this.runTimers, 1000);
  };

  /////////////////////////////////////////////////////////

  /** Bind key press and key release event handlers. */
  bindKeys() {
    document.addEventListener("keydown", this.keyPress);
    document.addEventListener("keyup", this.keyRelease);
  }
  
  /** Unbind key press and key release event handlers. */
  unbindKeys() {
    document.removeEventListener("keydown", this.keyPress);
    document.removeEventListener("keyup", this.keyRelease);
  }

  /**
   * Handle key press events.
   * @param {Event} event - The key press event object.
   */
  keyPress = (event) => {
    var key = { code: (event.keyCode ? event.keyCode : event.which),
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey };

    var prevent = false;
    
    for (let i=0; i < this.keys.length; i++) {
      let k = this.keys[i];
      if (k.disabled || k.release) continue;
      
      if ((k.code === key.code) && (k.ctrl === key.ctrl) &&
          (k.alt === key.alt) && (k.shift === key.shift)) {
        if (k.javascript) {
          this.execActionScript(k.text);
        } else {
          this.sendText(k.text);
        }
        
        if (k.prevent) {
          prevent = true;
        }
        
        break;
      }
    }
    
    if (prevent) {
      event.preventDefault();
    }
  };
  
  /**
   * Handle key release events.
   * @param {Event} event - The key release event object.
   */
  keyRelease = (event) => {
    var key = { code: (event.keyCode ? event.keyCode : event.which),
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey };
    
    var prevent = false;

    for (let i=0; i < this.keys.length; i++) {
      let k = this.keys[i];
      if (k.disabled || !k.release) continue;
      
      if ((k.code === key.code) && (k.ctrl === key.ctrl) &&
          (k.alt === key.alt) && (k.shift === key.shift)) {
        if (k.javascript) {
          this.execActionScript(k.text, event);
        } else {
          this.sendText(k.text);
        }
        
        if (k.prevent) {
          prevent = true;
        }
        
        break;
      }
    }
    
    if (prevent) {
      event.preventDefault();
    }
  };




}



export default Client;
export { Connection, Emulator, UserInput };

