class UserInput {

  //////////////////////////////////////////////////////////////
  // clear the history for a given UserInput object
  static clearhistory(that) {
    that.clearHistory && that.clearHistory();
  }
  
  //////////////////////////////////////////////////////////////
  // passthrough to the local onKeyDown callback
  static onkeydown(that, evt) {
    that.onKeyDown && that.onKeyDown(evt);
  }

  //////////////////////////////////////////////////////////////
  // passthrough to the local onKeyUp callback
  static onkeyup(that, evt) {
    that.onKeyUp && that.onKeyUp(evt);
  }
  
  //////////////////////////////////////////////////////////////
  static isKeyCycleForward(that, key) {
    if (that && that.keyCycleForward) {
      return that.keyCycleForward(key);
    } else {
      // default key is ctrl+n
      return (key.code === 78 && key.ctrl);
    }
  }
  
  //////////////////////////////////////////////////////////////
  static isKeyCycleBackward(that, key) {
    if (that && that.keyCycleBackward) {
      return that.keyCycleBackward(key);
    } else {
      // default key is ctrl+p
      return (key.code === 80 && key.ctrl);
    }
  }
  
  //////////////////////////////////////////////////////////////////
  // default handler for key press events
  static pressKey(that, e) {
    var key = { code: (e.keyCode ? e.keyCode : e.which),
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey };

    var prevent = true;
    
    if (UserInput.isKeyCycleBackward(that, key)) {

      // cycle history backward
      that.cycleBackward();

    } else if (UserInput.isKeyCycleForward(that, key)) {

      // cycle history forward
      that.cycleForward();

    } else if (key.code === 13) {
      // enter key
      
      // save the command string and clear the input box
      var cmd = that.root.value;
      that.saveCommand();

      // pass through to the local callback for sending data
      that.onEnter && that.onEnter(cmd);
        
    } else if (key.code === 27) {

      // pass through to the local callback for the escape key
      that.onEscape && that.onEscape();
    
    } else if (key.code === 33) {
    
      // pass through to the local callback for the pageup key
      that.onPageUp && that.onPageUp();

    } else if (key.code === 34) {

      // pass through to the local callback for the pagedown key
      that.onPageUp && that.onPageDown();

    } else { 
      // didn't capture anything, pass it through
      prevent = false;

    }
    
    if (prevent) {
      e.preventDefault();
    }

    // make sure input retains focus
    that.focus();
  }

  //////////////////////////////////////////////////////////////////
  // default handler for key release events
  static releaseKey(that, e) {
    var key = { code: (e.keyCode ? e.keyCode : e.which),
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey };

    if (UserInput.isKeyCycleBackward(that, key) ||
        UserInput.isKeyCycleForward(that, key)) {

      // move the cursor to end of the input text after a history change
      that.moveCursor();
    }
  }
  //////////////////////////////////////////////////////////////
  // User input handler (command history, callback events)
  constructor(root) {
    var that = this;
    
    this.root = root;
    
    this.selectionStart = 0;
    this.selectionStop = 0;
    
    // user-defined handlers for main actions
    this.onEnter = null;
    this.onEscape = null;
    this.onPageUp = null;
    this.onPageDown = null;

    // user-defined keys for command history
    this.keyCycleForward = null;
    this.keyCycleBackward = null;
    
    this.clearHistory();
    
    this.root.onkeydown = function(evt) {
      UserInput.onkeydown(that, evt);
    };
    
    this.root.onkeyup = function(evt) {
      UserInput.onkeyup(that, evt);
    };
  }
  
  //////////////////////////////////////////////////////////////
  // set the default onKeyDown handler
  onKeyDown(e) {
    UserInput.pressKey(this, e);
  }
  
  //////////////////////////////////////////////////////////////
  // set the default onKeyUp handler
  onKeyUp(e) {
    UserInput.releaseKey(this, e);
  }
  
  //////////////////////////////////////////////////////////////
  // clear the command history
  clearHistory() {
    this.history = [];
    this.ncommand = 0;
    this.save_current = '';
    this.current = -1;
  }
  
  //////////////////////////////////////////////////////////////
  // push a command onto the history list and clear the input box
  saveCommand() {
    if (this.root.value !== '') {
      this.history[this.ncommand] = this.root.value;
      this.ncommand++;
      this.save_current = '';
      this.current = -1;
      this.root.value = '';
    }
  }
  
  //////////////////////////////////////////////////////////////
  // cycle the history backward
  cycleBackward() {
    // save the current entry in case we come back
    if (this.current < 0) {
      this.save_current = this.root.value;
    }
    
    // cycle command history backward
    if (this.current < this.ncommand - 1) {
      this.current++;
      this.root.value = this.history[this.ncommand - this.current - 1];
    }
  }
  
  //////////////////////////////////////////////////////////////
  // cycle the history forward
  cycleForward() {
    // cycle command history forward
    if (this.current > 0) {
      this.current--;
      this.root.value = this.history[this.ncommand - this.current - 1];
    } else if (this.current === 0) {
      // recall the current entry if they had typed something already
      this.current = -1;
      this.root.value = this.save_current;
    }
  }
  
  //////////////////////////////////////////////////////////////
  // move the input cursor to the end of the input elements current text
  moveCursor() {
    if (typeof this.root.selectionStart === "number") {
        this.root.selectionStart = this.root.selectionEnd = this.root.value.length;
    } else if (typeof this.root.createTextRange !== "undefined") {
        this.focus();
        var range = this.root.createTextRange();
        range.collapse(false);
        range.select();
    }
  }
  
  // save the cursor position
  saveCursor() {
    this.selectionStart = this.root.selectionStart;
    this.selectionStop = this.root.selectionStop;
  }
  
  // reset cursor position
  resetCursor() {
    this.root.selectionStart = this.selectionStart;
    this.root.selectionStop = this.selectionStop;
  }
  
  //////////////////////////////////////////////////////////////
  // clear the current input text
  clear() {
    this.root.value = '';
  }
  
  //////////////////////////////////////////////////////////////
  // get the current text in the input box
  value() {
    return this.root.value;
  }
  
  //////////////////////////////////////////////////////////////
  // refocus the input box
  focus() {
  
    // see if we are selecting some text
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      text = document.selection.createRange().text;
    }
    
    // or if we are in an input element
    var element = document.activeElement;
    var tagName = element.tagName.toLowerCase();
    if (tagName === 'textarea') return;
    
    if (tagName === 'input') {
      var type = element.getAttribute('type').toLowerCase();
      // if any of these input types is not supported by a browser, it will behave as input type text.
      var inputTypes = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week'];
      if (inputTypes.indexOf(type) >= 0) {
        return;
      }
    }
    
    // if we are selecting or inputting, don't focus
    if (text === "") {
      this.root.focus();
    }
  } 

}

export default UserInput;

