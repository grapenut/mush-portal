// MU* terminal emulator.
class Emulator {

  static get PARSE_PLAIN() { return 0; }
  static get PARSE_CR() { return 1; }
  static get PARSE_ESC1() { return 2; }
  static get PARSE_ESC2() { return 3; }

  static get ANSI_NORMAL() { return 0; }
  static get ANSI_BRIGHT() { return 1; }
  static get ANSI_UNDERLINE() { return 4; }
  static get ANSI_BLINK() { return 5; }
  static get ANSI_INVERSE() { return 7; }
  static get ANSI_XTERM_FG() { return 38; }
  static get ANSI_XTERM_BG() { return 48; }

  static get DEFAULT_FG() { return 37; }
  static get DEFAULT_BG() { return 30; }
  
  static get UNCLOSED_TAGS() { return ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
          'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']; }

  //////////////////////////////////////////////////////////////////
  // Link scanner function search line for links and returns an array
  static extractLinks(line) {
    var links = [], result;
    var regex = /(^|[^a-zA-Z0-9]+)(?:((?:http|https):\/\/[-a-zA-Z0-9_.~:/?#[\]@!$&'()*+,;=%]+[-a-zA-Z0-9_~:/?#@!$&*+;=%])|([-.+a-zA-Z0-9_]+@[-a-zA-Z0-9]+(?:\.[-a-zA-Z0-9]+)+)|(@[a-zA-Z]\w*))/g;


    regex.lastIndex = 0;
    while ((result = regex.exec(line))) {
      var info = {};

      info.start = result.index + result[1].length;
      info.xch_cmd = '';
      if (result[2]) {
        result = result[2];
        info.url = result;
      } else if (result[3]) {
        result = result[3];
        info.url = 'mailto:' + result;
      } else if (result[4]) {
        result = result[4];
        info.url = '';
        info.xch_cmd = 'help ' + result;
        info.className = "ansi-37-1";
      }

      info.end = info.start + result.length;

      links[links.length] = info;
    }

    return links;
  }

  //////////////////////////////////////////////////////////////////
  // some string helper functions for replacing links and user input tokens
  // Example onLine() handler that linkifies URLs in text.
  static parseLinks(that, lineBuf) {
    // Merge text so we can scan it.
    if (!lineBuf.length) {
      return;
    }
    
    var ii, ilen;
    var line = '';

    for (ii = 0, ilen = lineBuf.length; ii < ilen; ++ii) {
      line += lineBuf[ii].nodeValue;
    }

    // Scan the merged text for links.
    var links = Emulator.extractLinks(line);
    if (!links.length) {
      return;
    }

    // Find the start and end text nodes.
    var nodeIdx = 0, nodeStart = 0, nodeEnd = lineBuf[0].nodeValue.length;
    for (ii = 0, ilen = links.length; ii < ilen; ++ii) {
      var info = links[ii], startOff, startNode, endOff, endNode;

      while (nodeEnd <= info.start) {
        nodeStart = nodeEnd;
        nodeEnd += lineBuf[++nodeIdx].nodeValue.length;
      }

      startOff = info.start - nodeStart;
      startNode = lineBuf[nodeIdx];

      while (nodeEnd < info.end) {
        nodeStart = nodeEnd;
        nodeEnd += lineBuf[++nodeIdx].nodeValue.length;
      }

      endOff = info.end - nodeStart;
      endNode = lineBuf[nodeIdx];

      // Wrap the link text.
      // TODO: In this version, we won't try to cross text nodes.
      // TODO: Discard any text nodes that are already part of links?
      if (startNode !== endNode) {
        window.console && window.console.warn('link', info);
        continue;
      }

      lineBuf[nodeIdx] = endNode.splitText(endOff);
      nodeStart += endOff;

      var middleNode = startNode.splitText(startOff);
      var anchor = document.createElement('a');
      middleNode.parentNode.replaceChild(anchor, middleNode);

      anchor.target = '_blank';
      if (info.url === '' && info.xch_cmd !== '') {
        anchor.setAttribute('onClick', 'this.onCommand("'+info.xch_cmd+'");');
        anchor.onCommand = that.onCommand;
      } else {
        anchor.setAttribute('rel','noreferrer noopener');
        anchor.href = info.url;
      }
      anchor.appendChild(middleNode);
    }
  }
  constructor(root) {
    this.root = root;
    this.container = null;
    
    this.dims = { };
    
    this.calcDimensions();
    
    // setup the pueblo xch_cmd callback
    this.onCommand = null;

    this.clear();
  }



  /////////////////////////////////////////////////////
  // ansi parsing routines
  
  static encodeState(state) {
    if (!state) {
      return '';
    }

    var classes = [];

    if (state[Emulator.ANSI_INVERSE]) {
      var value = state.fg;
      state.fg = state.bg;
      state.bg = value;
      
      value = state.fg256;
      state.fg256 = state.bg256;
      state.bg256 = value;
    }
    
    var fg = state.fg;
    var bg = state.bg;
    
    if (state[Emulator.ANSI_UNDERLINE]) {
      classes[classes.length] = 'ansi-' + Emulator.ANSI_UNDERLINE;
    }

    // make sure to avoid conflict with XTERM256 color's usage of blink (code 5)
    if (state.fg256) {
      classes[classes.length] = 'ansi-38-5-' + state.fg;
    } else {  
      if (state[Emulator.ANSI_BRIGHT]) {
        if (state[Emulator.ANSI_INVERSE]) {
          if (fg !== Emulator.DEFAULT_FG) {
            classes[classes.length] = 'ansi-' + fg;
          }
        } else {
          classes[classes.length] = 'ansi-' + fg + '-1';
        }
      } else if (fg !== Emulator.DEFAULT_FG) {
        classes[classes.length] = 'ansi-' + fg;
      }
    }
    
    if (state.bg256) {
      classes[classes.length] = 'ansi-48-5-' + state.bg;
    } else {
      if (state[Emulator.ANSI_BRIGHT]) {
        if (state[Emulator.ANSI_INVERSE]) {
          classes[classes.length] = 'ansi-' + (bg + 10) + '-1';
        } else {
          if (bg !== Emulator.DEFAULT_BG) {
            classes[classes.length] = 'ansi-' + (bg + 10);
          }
        }
      } else if (bg !== Emulator.DEFAULT_BG) {
        classes[classes.length] = 'ansi-' + (bg + 10);
      }
    }

    if (state[Emulator.ANSI_BLINK] && !(state.fg256 || state.bg256)) {
      classes[classes.length] = 'ansi-' + Emulator.ANSI_BLINK;
    }
    
    return classes.join(' ');
  };

  /////////////////////////////////////////////////////
  // get the current ansi state, or a default if there is none
  getANSI() {
    if (!this.ansiState) {
      this.ansiState = {
        fg: Emulator.DEFAULT_FG,
        bg: Emulator.DEFAULT_BG,
        fg256: false,
        bg256: false
      };
    }

    return this.ansiState;
  }

  /////////////////////////////////////////////////////
  // apply ansi to the current state
  applyANSI(ansi) {
    switch (ansi.charCodeAt(ansi.length - 1)) {
    case 109: // m (SGR)
      var codes = ansi.substring(0, ansi.length - 1).split(';');

      var value, state;
      for (var ii = 0; (value = codes[ii]) !== undefined; ++ii) {
        if (value.length === 0) {
          // Empty is treated as the equivalent of 0.
          value = Emulator.ANSI_NORMAL;
        } else {
          value = parseInt(value, 10);
        }
        
        state = this.getANSI();
        
        // check for xterm256 fg/bg first, fallback to standard codes otherwise
        if (state[Emulator.ANSI_XTERM_FG] && state[Emulator.ANSI_BLINK]) {
          if (value >= 0 && value <= 255) {
            state.fg = value;
            state.fg256 = true;
            state[Emulator.ANSI_XTERM_FG] = false;
            state[Emulator.ANSI_BLINK] = false;
          } else {
            // invalid xterm256, let's reset the ansi state due to bad codes
            this.ansiState = null;
          }
        } else if (state[Emulator.ANSI_XTERM_BG] && state[Emulator.ANSI_BLINK]) {
          if (value >= 0 && value <= 255) {
            state.bg = value;
            state.bg256 = true;
            state[Emulator.ANSI_XTERM_BG] = false;
            state[Emulator.ANSI_BLINK] = false;
          } else {
            // invalid xterm256, let's reset the ansi state due to bad codes
            this.ansiState = null;
          }
        } else {
          // detect regular ansi codes
          switch (value) {
          case Emulator.ANSI_NORMAL: // reset
            this.ansiState = null;
            break;

          case Emulator.ANSI_BRIGHT:
          case Emulator.ANSI_UNDERLINE:
          case Emulator.ANSI_BLINK:
          case Emulator.ANSI_INVERSE:
          case Emulator.ANSI_XTERM_FG:
          case Emulator.ANSI_XTERM_BG:
            state[value] = true;
            break;

          default:
            if (30 <= value && value <= 37) {
              state.fg = value;
            } else if (40 <= value && value <= 47) {
              state.bg = value - 10;
            }
           break;
          }
        }

        this.ansiDirty = true;
      }
      break;
    default:
      break;
    }
  }

  /////////////////////////////////////////////////////
  // write a string to be emulated
  write(value, start, end) {
    if (start === end) {
      return;
    }

    if (this.ansiDirty) {
      var next = Emulator.encodeState(this.ansiState);

      if (this.ansiClass !== next) {
        this.ansiClass = next;
        this.span = null;
      }

      this.ansiDirty = false;
    }

    if (this.ansiClass && !this.span) {
      this.span = document.createElement('span');
      this.span.className = this.ansiClass;
      this.stack[this.stack.length - 1].appendChild(this.span);
    }

    var text = document.createTextNode(value.substring(start, end));
    this.lineBuf[this.lineBuf.length] = text;

    this.appendChild(text);
  }
  
  onLine(that, lineBuf) {
    Emulator.parseLinks(that, lineBuf);
  }

  /////////////////////////////////////////////////////
  // end of line
  endLine() {
    var that = this;
    this.onLine && this.onLine(that, this.lineBuf);

    this.write('\n', 0, 1);
    this.lineBuf.length = 0;
  }

  /////////////////////////////////////////////////////
  // handle end of escape code
  abortParse(value, start, end) {
    switch (this.state) {
    case Emulator.PARSE_PLAIN:
      this.write(value, start, end);
      break;

    case Emulator.PARSE_ESC1:
      this.write('\u001B', 0, 1);
      break;

    case Emulator.PARSE_ESC2:
      this.write('\u001B[', 0, 2);
      this.write(this.parseBuf, 0, this.parseBuf.length);
      this.parseBuf = '';
      break;
    default:
      break;
    }
  }

  /////////////////////////////////////////////////////
  // appends a text string to the terminal, parsing ansi escape codes into html/css
  appendText(data) {
    if (!data) return;
    
    var start = 0;

    // Scan for sequence start characters.
    // TODO: Could scan with RegExp; not convinced sufficiently simpler/faster.
    for (var ii = 0, ilen = data.length; ii < ilen; ++ii) {
      var ch = data.charCodeAt(ii);

      // Resynchronize at special characters.
      switch (ch) {
      case 10: // newline
        if (this.state !== Emulator.PARSE_CR) {
          this.abortParse(data, start, ii);
          this.endLine();
        }

        start = ii + 1;
        this.state = Emulator.PARSE_PLAIN;
        continue;

      case 13: // carriage return
        this.abortParse(data, start, ii);
        this.endLine();
        start = ii + 1;
        this.state = Emulator.PARSE_CR;
        continue;

      case 27: // escape
        this.abortParse(data, start, ii);
        start = ii + 1;
        this.state = Emulator.PARSE_ESC1;
        continue;
      
      default:
        break;
      }

      // Parse other characters.
      switch (this.state) {
      case Emulator.PARSE_CR:
        this.state = Emulator.PARSE_PLAIN;
        break;

      case Emulator.PARSE_ESC1:
        if (ch === 91) {
          // Start of escape sequence (\e[).
          start = ii + 1;
          this.state = Emulator.PARSE_ESC2;
        } else {
          // Not an escape sequence.
          this.abortParse(data, start, ii);
          start = ii;
          this.state = Emulator.PARSE_PLAIN;
        }
        break;

      case Emulator.PARSE_ESC2:
        if (64 <= ch && ch <= 126) {
          // End of escape sequence.
          this.parseBuf += data.substring(start, (start = ii + 1));
          this.applyANSI(this.parseBuf);
          this.parseBuf = '';
          this.state = Emulator.PARSE_PLAIN;
        }
        break;
        
      default:
        break;
      }
    }

    // Handle tail.
    switch (this.state) {
    case Emulator.PARSE_PLAIN:
      this.write(data, start, data.length);
      break;

    case Emulator.PARSE_ESC2:
      this.parseBuf += data.substring(start);
      break;
      
    default:
      break;
    }
  }

  /////////////////////////////////////////////////////
  // append HTML code fragment
  appendHTML(html) {
    var div = document.createElement('div');
    var fragment = document.createDocumentFragment();

    div.innerHTML = html;

    // append child elements
    for (var child = div.firstChild; child; child = child.nextSibling) {
      // check for xch_cmd and replace with click handler
      var cmd = child.getAttribute('xch_cmd');
      if (cmd !== null && cmd !== '') {
        child.setAttribute('onclick', 'this.onCommand("' + cmd + '");');
        child.onCommand = this.onCommand;
        child.removeAttribute('xch_cmd');
      }
      fragment.appendChild(child);
    }

    this.appendChild(fragment);
  }

  /////////////////////////////////////////////////////
  // append DOM element
  appendChild(child) {
    var last = (this.span || this.stack[this.stack.length - 1]);
    last.appendChild(child);
  }
  
  /////////////////////////////////////////////////////
  // append a log message to the terminal
  appendMessage(classid, message) {
    var div = document.createElement('div');
    div.className = classid;
    
    // create a text node to safely append the string without rendering code
    var text = document.createTextNode(message);
    div.appendChild(text);
    
    this.appendChild(div);
  }
  
  /////////////////////////////////////////////////////
  // push a new html element onto the stack
  pushElement(element) {
    this.span = null;
    this.stack[this.stack.length - 1].appendChild(element);
    this.stack[this.stack.length] = element;
  }

  /////////////////////////////////////////////////////
  // remove 1 level from the stack, check consistency 
  popElement() {
    this.span = null;

    if (this.stack.length > 1) {
      --this.stack.length;
    } else {
      window.console && window.console.warn('element stack underflow');
    }
  }

  /////////////////////////////////////////////////////
  // append a pueblo tag to the terminal stack (or pop if an end tag)
  appendPueblo(data) {
    var tag, attrs;

    var idx = data.indexOf(' ');
    if (idx !== -1) {
      tag = data.substring(0, idx);
      attrs = data.substring(idx + 1);
    } else {
      tag = data;
      attrs = '';
    }
    
    var html = '<' + tag + (attrs ? ' ' : '') + attrs + '>';

    var start;
    if (tag[0] !== '/') {
      start = true;
    } else {
      start = false;
      tag = tag.substring(1);
    }
    
    // detect a self closed tag
    var selfClosing = false;
    if ((tag.substring(-1) === '/') || (attrs.substring(-1) === '/')) {
      selfClosing = true;
    }
    
    if (Emulator.UNCLOSED_TAGS.indexOf(tag.toLowerCase()) > -1) {
      selfClosing = true;
    }

    if ((tag === 'XCH_PAGE') || 
        ((tag === 'IMG') && (attrs.search(/xch_graph=(("[^"]*")|('[^']*')|([^\s]*))/i) !== -1))) {
      //console.log("unhandled pueblo", html);
      return;
    }

    // we have a starting <tag> (not </tag>)
    if (start) {
      var div = document.createElement('div');

      html = html.replace(
        /xch_graph=(("[^"]*")|('[^']*')|([^\s]*))/i,
        ''
      );

      html = html.replace(
        /xch_mode=(("[^"]*")|('[^']*')|([^\s]*))/i,
        ''
      );

      html = html.replace(
        /xch_hint="([^"]*)"/i,
        'title="$1"'
      );

      div.innerHTML = html.replace(
        /xch_cmd="([^"]*)"/i,
        "onclick='this.onCommand(&quot;$1&quot;)'"
      );
      
      div.firstChild.onCommand = this.onCommand;

      div.setAttribute('target', '_blank');
      
      // add this tag to the stack to keep track of nested elements
      this.pushElement(div.firstChild);

      // automatically pop the tag if it is self closing
      if (selfClosing) {
        this.popElement();
      }

    } else {
      // we have an ending </tag> so remove the closed tag from the stack
      // don't bother for self closing tags with an explicit end tag, we already popped them
      if (!selfClosing) {
        this.popElement();
      }
    }
  }
  
  /////////////////////////////////////////////////////
  // clear the output and current ansi state
  clear() {
    if (this.root === null) {
      return null;
    }

    this.root.innerHTML = '';

    this.stack = [this.root];

    this.state = Emulator.PARSE_PLAIN;
    this.line = null;
    this.lineBuf = [];
    this.span = null;
    this.parseBuf = '';

    this.ansiClass = '';
    this.ansiState = null;
    this.ansiDirty = false;
  }
  
  // are we already scrolled down to the bottom?
  nearBottom(threshold) {
    var root = this.root;
    
    if (!root) {
      return false;
    }
    
    if (this.linesOfScroll() <= threshold) {
      return true;
    }
    
    return false;
  }
  
  // calculate the width and height in characters
  calcDimensions() {
    var element = this.root;
    if (!element) {
      return 0.0;
    }
    
    //var txt = "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
    var txt = "0123456789";
    
    var temp = document.createElement("span");
    var css = window.getComputedStyle(element, null);
    var fontFamily = css.getPropertyValue("font-family");
    var fontSize = css.getPropertyValue("font-size");
    temp.setAttribute("style","margin:0px;padding:0px;font-family:"+fontFamily+";font-size:"+fontSize);
    temp.innerText = txt;
    temp = element.appendChild(temp);
    this.dims.width = temp.offsetWidth / 10.0;
    this.dims.height = temp.offsetHeight;
    temp.parentNode.removeChild(temp);
    
    return this.dims;
  }
  
  // return the number of lines of text below the current viewport
  linesOfScroll() {
    var root = this.container || this.root;
    if (!root) {
      return 0.0;
    }
    
    if (this.dims.height <= 0.0) {
      return 0.0;
    }
    
    return Math.round(Math.abs((root.scrollHeight - root.offsetHeight - root.scrollTop) / this.dims.height));
  }

  //////////////////////////////////////////////////////
  // scroll one page up
  scrollPageUp() {
    var root = this.container || this.root;
    root.scrollTop -= root.clientHeight - this.dims.height*5;
  }

  //////////////////////////////////////////////////////
  // scroll one page down
  scrollPageDown() {
    var root = this.container || this.root;
    root.scrollTop += root.clientHeight - this.dims.height*4;
  }  

  //////////////////////////////////////////////////////
  // animate scrolling the terminal window to the bottom
  scrollDown() {
    var root = this.container || this.root;

    if (!root) {
      return;
    }

    root.scrollTop = root.scrollHeight;
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
  
  /////////////////////////////////////////////////////////
  // save and load history buffers
  
  loadHistory = (key) => {
    if (window.localStorage.hasOwnProperty(key)) {
      const html = window.localStorage[key];
      if (html !== "") {
        try {
          this.root.innerHTML = html + this.root.innerHTML;
        } catch (e) {
          console.log("Unable to insert history: ", e);
        }
      }
    }
  };

  saveHistory = (key, size) => {
    const store = window.localStorage;
    
    if (size > 0) {
      const nodes = this.root.childNodes;
      var start = nodes.length - 1;
      
      if (start < 0) return;
      
      var found = 0;
      
      for (let i = start; i > -1 && found < size; i--) {
        let count = nodes[i].textContent.split("\n").length;
        
        if (nodes[i].textContent.endsWith('\n')) {
          count = count - 1;
        }
        
        if (count > 0) {
          found = found + count;
          start = i;
        }
      }
      
      //var buff = "";
      //for (let i = start; i < nodes.length; i++) {
      //  buff = buff + nodes[i].outerHTML;
      //}
      
      var range = document.createRange();
      range.setStartBefore(nodes[start]);
      range.setEndAfter(nodes[nodes.length-1]);
      var fragment = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(fragment);
      
      store[key] = div.innerHTML;
    } else {
      delete store[key];
    }
  };
  
  
}

export default Emulator;

