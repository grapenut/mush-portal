## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd><p>Client</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#LOGINFAIL">LOGINFAIL</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>List of standard server login failure messages.</p>
</dd>
<dt><a href="#UnicodeMap">UnicodeMap</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Maps Unicode characters to ASCII characters.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#appendCallback">appendCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#execCallback">execCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="Client"></a>

## Client
Client

**Kind**: global class  

* [Client](#Client)
    * [new Client()](#new_Client_new)
    * [.setBubble](#Client+setBubble)
    * [.timersEnabled](#Client+timersEnabled)
    * [.disableTimers](#Client+disableTimers)
    * [.startTimers](#Client+startTimers)
    * [.stopTimers](#Client+stopTimers)
    * [.runTimers](#Client+runTimers)
    * [.keyPress](#Client+keyPress)
    * [.keyRelease](#Client+keyRelease)
    * [.render()](#Client+render)
    * [.loadScript(src, [onLoad], [onError])](#Client+loadScript)
    * [.execUserScript(name)](#Client+execUserScript)
    * [.execActionScript(txt, [event])](#Client+execActionScript)
    * [.loadStyle(src)](#Client+loadStyle)
    * [.updateCSS(css, [erase])](#Client+updateCSS) ⇒ <code>HTMLElement</code>
    * [.unloadStyle(src)](#Client+unloadStyle)
    * [.createTheme([theme])](#Client+createTheme) ⇒ <code>MuiTheme</code>
    * [.saveText(filename, text, [type])](#Client+saveText) ⇒ <code>boolean</code>
    * [.localStorageToText([indent])](#Client+localStorageToText) ⇒ <code>string</code>
    * [.restoreLocalStorage(text)](#Client+restoreLocalStorage) ⇒ <code>boolean</code>
    * [.loadLocalStorage(obj, key)](#Client+loadLocalStorage)
    * [.clearLocalStorage(key)](#Client+clearLocalStorage)
    * [.saveLocalStorage(obj, key)](#Client+saveLocalStorage)
    * [.loadHistoryBuffer(key)](#Client+loadHistoryBuffer) ⇒ <code>string</code>
    * [.saveHistoryBuffer(key, text)](#Client+saveHistoryBuffer)
    * [.castString(obj, key, value)](#Client+castString)
    * [.changeSetting(key, value)](#Client+changeSetting)
    * [.loadButtons()](#Client+loadButtons)
    * [.loadTriggers()](#Client+loadTriggers)
    * [.loadTimers()](#Client+loadTimers)
    * [.loadMacros()](#Client+loadMacros)
    * [.loadKeys()](#Client+loadKeys)
    * [.loadCSS()](#Client+loadCSS)
    * [.loadScripts()](#Client+loadScripts)
    * [.loadSettings()](#Client+loadSettings)
    * [.loadRecallHistory()](#Client+loadRecallHistory)
    * [.saveRecallHistory()](#Client+saveRecallHistory)
    * [.saveButtons()](#Client+saveButtons)
    * [.saveTriggers()](#Client+saveTriggers)
    * [.saveTimers()](#Client+saveTimers)
    * [.saveMacros()](#Client+saveMacros)
    * [.saveKeys()](#Client+saveKeys)
    * [.saveCSS()](#Client+saveCSS)
    * [.saveScripts()](#Client+saveScripts)
    * [.saveSettings()](#Client+saveSettings)
    * [.parseCommand(command)](#Client+parseCommand) ⇒ <code>string</code>
    * [.onCommand(cmd)](#Client+onCommand)
    * [.appendMessage(classid, msg)](#Client+appendMessage)
    * [.createPattern(regex, pattern)](#Client+createPattern) ⇒ <code>RegExp</code>
    * [.replaceArgs(args, text)](#Client+replaceArgs) ⇒ <code>string</code>
    * [.clear()](#Client+clear)
    * [.initInput(input)](#Client+initInput)
    * [.initOutput(output, [container])](#Client+initOutput)
    * [.initPrompt(prompt)](#Client+initPrompt)
    * [.scrollDown(root)](#Client+scrollDown)
    * [.focus(force)](#Client+focus)
    * [.scrollIfNeeded(fun)](#Client+scrollIfNeeded)
    * [.addPanel(id, cfg, [component])](#Client+addPanel) ⇒ <code>Object</code>
    * [.getSpawn(id, cfg, el)](#Client+getSpawn) ⇒ <code>jsPanel</code>
    * [.delSpawn(id)](#Client+delSpawn)
    * [.findSpawn(id)](#Client+findSpawn) ⇒ <code>jsPanel</code>
    * [.closePanel(id)](#Client+closePanel)
    * [.focusPanel(id)](#Client+focusPanel)
    * [.connect()](#Client+connect)
    * [.sendCommand(cmd)](#Client+sendCommand)
    * [.sendMacro(cmds)](#Client+sendMacro)
    * [.sendAPI(cmd, args)](#Client+sendAPI)
    * [.execString(code, callback)](#Client+execString)
    * [.execJSON(code, callback)](#Client+execJSON)
    * [.saveLog(filename)](#Client+saveLog)
    * [.saveBackup(filename)](#Client+saveBackup)
    * [.initNotifications()](#Client+initNotifications)
    * [.initPanels()](#Client+initPanels)
    * [.bindKeys()](#Client+bindKeys)
    * [.unbindKeys()](#Client+unbindKeys)

<a name="new_Client_new"></a>

### new Client()
The main Client class controls and links together everything.

<a name="Client+setBubble"></a>

### client.setBubble
Set the activity count when the browser tab is out of view.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+timersEnabled"></a>

### client.timersEnabled
Enable timers, only if not already enabled.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+disableTimers"></a>

### client.disableTimers
Disable timers, only if already enabled.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+startTimers"></a>

### client.startTimers
Start the master timer loop, if timers are enabled.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+stopTimers"></a>

### client.stopTimers
Stop the master timer loop.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+runTimers"></a>

### client.runTimers
The master timer loop.

**Kind**: instance property of [<code>Client</code>](#Client)  
<a name="Client+keyPress"></a>

### client.keyPress
Handle key press events.

**Kind**: instance property of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | The key press event object. |

<a name="Client+keyRelease"></a>

### client.keyRelease
Handle key release events.

**Kind**: instance property of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | The key release event object. |

<a name="Client+render"></a>

### client.render()
Render the main React component.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadScript"></a>

### client.loadScript(src, [onLoad], [onError])
Load a script from the source URL by appending a <script> tag to the body.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| src | <code>string</code> |  | The URL of the script to load. |
| [onLoad] | <code>function</code> | <code></code> | A callback to run after loading. |
| [onError] | <code>function</code> | <code></code> | A callback to run on errors (e.g. 404). |

<a name="Client+execUserScript"></a>

### client.execUserScript(name)
Find and execute a user-defined script by name.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the script to execute. |

<a name="Client+execActionScript"></a>

### client.execActionScript(txt, [event])
Evaluate a fragment of Javascript code.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| txt | <code>string</code> | The code to execute. |
| [event] | <code>Event</code> | The event, if present. |

<a name="Client+loadStyle"></a>

### client.loadStyle(src)
Load custom CSS style sheet from the source URL by appending a <link> tag to the head.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | The URL of the CSS file to load. |

<a name="Client+updateCSS"></a>

### client.updateCSS(css, [erase]) ⇒ <code>HTMLElement</code>
Update the CSS definition object's rules on its <style> element.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>HTMLElement</code> - - The <style> tag with CSS added.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| css | <code>Object.&lt;string, string&gt;</code> |  | The CSS definition object. |
| [erase] | <code>boolean</code> | <code>false</code> | Erase the existing style first. |

<a name="Client+unloadStyle"></a>

### client.unloadStyle(src)
Uunload custom CSS style sheet loading from source URL.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | The source URL of the CSS file to unload. |

<a name="Client+createTheme"></a>

### client.createTheme([theme]) ⇒ <code>MuiTheme</code>
Create a new Material-UI theme from a theme configuration object.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>MuiTheme</code> - - The new theme object.  

| Param | Type | Description |
| --- | --- | --- |
| [theme] | <code>Object.&lt;string, \*&gt;</code> | The theme configuration object. |

<a name="Client+saveText"></a>

### client.saveText(filename, text, [type]) ⇒ <code>boolean</code>
Save a text string to a local file.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>boolean</code> - - Whether the save was successful or not.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | The name of the file to save. |
| text | <code>string</code> |  | The text of the file to save. |
| [type] | <code>string</code> | <code>&quot;text/plain&quot;</code> | The MIME type of the file Blob. |

<a name="Client+localStorageToText"></a>

### client.localStorageToText([indent]) ⇒ <code>string</code>
Convert localStorage to JSON object text.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>string</code> - - The JSON.stringified object text.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [indent] | <code>string</code> | <code>0</code> | If indent != 0 we use a pretty printer. If 0 or undefined we minify. |

<a name="Client+restoreLocalStorage"></a>

### client.restoreLocalStorage(text) ⇒ <code>boolean</code>
Restore localStorage from a string.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>boolean</code> - - Whether the text was succesfully parsed and merged with localStorage.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The string from which to restore localStorage. |

<a name="Client+loadLocalStorage"></a>

### client.loadLocalStorage(obj, key)
Load a configuration object string from localStorage.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object.&lt;string, \*&gt;</code> | The reference onto which to store the retrieved object. |
| key | <code>string</code> | The key of the object on localStorage. |

<a name="Client+clearLocalStorage"></a>

### client.clearLocalStorage(key)
Delete a configuration object from localStorage.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the object on localStorage. |

<a name="Client+saveLocalStorage"></a>

### client.saveLocalStorage(obj, key)
Save a configuration object to localStorage.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object.&lt;string, \*&gt;</code> | The object to be stored. |
| key | <code>string</code> | The key of the object on localStorage. |

<a name="Client+loadHistoryBuffer"></a>

### client.loadHistoryBuffer(key) ⇒ <code>string</code>
Load a history buffer string from localStorage.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>string</code> - - The buffer string.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the buffer on localStorage. |

<a name="Client+saveHistoryBuffer"></a>

### client.saveHistoryBuffer(key, text)
Save a history buffer string to localStorage.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the buffer on localStorage. |
| text | <code>string</code> | The value of the buffer. |

<a name="Client+castString"></a>

### client.castString(obj, key, value)
Set a value on an object, converting the argument to the correct type.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object.&lt;string, \*&gt;</code> | The object on which to store the value. |
| key | <code>string</code> | The key of the value to store on the object. |
| value | <code>\*</code> | The value to be stored. |

<a name="Client+changeSetting"></a>

### client.changeSetting(key, value)
Change a setting, updating the UI if necessary.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the setting to change. |
| value | <code>string</code> | The new value of the setting. |

<a name="Client+loadButtons"></a>

### client.loadButtons()
Load user-defined taskbar buttons.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadTriggers"></a>

### client.loadTriggers()
Load regex/wildcard pattern triggers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadTimers"></a>

### client.loadTimers()
Load automatic timers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadMacros"></a>

### client.loadMacros()
Load slash command macros.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadKeys"></a>

### client.loadKeys()
Load custom keybindings.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadCSS"></a>

### client.loadCSS()
Load custom css overrides.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadScripts"></a>

### client.loadScripts()
Load custom scripts.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadSettings"></a>

### client.loadSettings()
Load client settings.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+loadRecallHistory"></a>

### client.loadRecallHistory()
Load command recall history.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveRecallHistory"></a>

### client.saveRecallHistory()
Save command recall history.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveButtons"></a>

### client.saveButtons()
Save user-defined taskbar buttons.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveTriggers"></a>

### client.saveTriggers()
Save regex/wildcard pattern triggers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveTimers"></a>

### client.saveTimers()
Save automatic timers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveMacros"></a>

### client.saveMacros()
Save command macros.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveKeys"></a>

### client.saveKeys()
Save custom keybindings.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveCSS"></a>

### client.saveCSS()
Save custom css overrides.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveScripts"></a>

### client.saveScripts()
Save custom css overrides.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+saveSettings"></a>

### client.saveSettings()
Save client settings.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+parseCommand"></a>

### client.parseCommand(command) ⇒ <code>string</code>
Detect if more user input is required for a pueblo command.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>string</code> - - The command string with '??' tokens replace by user input.  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | The command string to parse for '??' tokens. |

<a name="Client+onCommand"></a>

### client.onCommand(cmd)
Execute a Pueblo command link, checking if it requires user input.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The command string. |

<a name="Client+appendMessage"></a>

### client.appendMessage(classid, msg)
Log messages to the output terminal.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| classid | <code>string</code> | The CSS class id of the log message. |
| msg | <code>string</code> | The message to append to the terminal. |

<a name="Client+createPattern"></a>

### client.createPattern(regex, pattern) ⇒ <code>RegExp</code>
Create a new RegExp pattern, creating one from a glob wildcard pattern if necessary.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>RegExp</code> - - The compiled regular expression.  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>boolean</code> | Is the pattern already a regex? If not we will make one. |
| pattern | <code>string</code> | The pattern string. |

<a name="Client+replaceArgs"></a>

### client.replaceArgs(args, text) ⇒ <code>string</code>
Replace %-tokens in a text string with match argument strings.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>string</code> - - The new text with arguments replaced if they are present.  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>Array.&lt;string&gt;</code> | The arguments array, element 0 is the full string. |
| text | <code>string</code> | The text to be scanned for %number tokens which are replaced by args[number]. |

<a name="Client+clear"></a>

### client.clear()
Clear the terminal.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+initInput"></a>

### client.initInput(input)
Initialize the terminal input window.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>HTMLElement</code> | The HTML element to which the Input object is attached. |

<a name="Client+initOutput"></a>

### client.initOutput(output, [container])
Initialize the terminal output window.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| output | <code>HTMLElement</code> |  | The HTML element to which the Emulator object is attached. |
| [container] | <code>HTMLElement</code> | <code></code> | The output elements container. |

<a name="Client+initPrompt"></a>

### client.initPrompt(prompt)
Initialize the command prompt.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| prompt | <code>HTMLElement</code> | The HTML element to which the Emulator object is attached. |

<a name="Client+scrollDown"></a>

### client.scrollDown(root)
Scroll the terminal output window down the very bottom of the current view.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>HTMLElement</code> | The HTML element to be scrolled down. |

<a name="Client+focus"></a>

### client.focus(force)
Passthrough for focusing the Input root.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| force | <code>boolean</code> | Whether to force the Input element to focus even if the normal rules determine it shouldn't. |

<a name="Client+scrollIfNeeded"></a>

### client.scrollIfNeeded(fun)
Wrapper for appending text that scrolls the output afterwards if needed.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| fun | [<code>appendCallback</code>](#appendCallback) | The wrapper function that appends text. |

<a name="Client+addPanel"></a>

### client.addPanel(id, cfg, [component]) ⇒ <code>Object</code>
Add a window panel with the given id and configuration, using a particular React component if provided.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>Object</code> - - A reference to the panel if it already exists, or undefined if not.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The window id. |
| cfg | <code>Object.&lt;string, \*&gt;</code> |  | The panel configuration. |
| [component] | <code>React.Component</code> | <code>Spawn</code> | The React component that serves as a base. |

<a name="Client+getSpawn"></a>

### client.getSpawn(id, cfg, el) ⇒ <code>jsPanel</code>
Create a new window with addPanel if one is not found with findSpawn.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>jsPanel</code> - - The window panel that was found, or the new one created.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The window id. |
| cfg | <code>Object.&lt;string, \*&gt;</code> | The panel configuration object. |
| el | <code>HTMLElemet</code> | The element to create inside the window. |

<a name="Client+delSpawn"></a>

### client.delSpawn(id)
Delete spawn window from internal list.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The window id. |

<a name="Client+findSpawn"></a>

### client.findSpawn(id) ⇒ <code>jsPanel</code>
Find spawn window in internal list.

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>jsPanel</code> - - The window panel if found, or null.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The window id. |

<a name="Client+closePanel"></a>

### client.closePanel(id)
Find and close a window panel.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The window id. |

<a name="Client+focusPanel"></a>

### client.focusPanel(id)
Bring a window panel into focus.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The window id. |

<a name="Client+connect"></a>

### client.connect()
Connect to the game server and setup message handlers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+sendCommand"></a>

### client.sendCommand(cmd)
Send a command string to the server, check macros for a match and append a local echo.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The command string to send. |

<a name="Client+sendMacro"></a>

### client.sendMacro(cmds)
Check a string for multiple commands and match them against the list of macros.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| cmds | <code>string</code> | A string of one or more commands separated by newlines. |

<a name="Client+sendAPI"></a>

### client.sendAPI(cmd, args)
Send an API command, falling back to player-executed softcode if the server doesn't support it.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The API command name. |
| args | <code>Array.&lt;string&gt;</code> | An array of string arguments to pass to the API command. |

<a name="Client+execString"></a>

### client.execString(code, callback)
Execute a MUSH softcode string and return the result as a string in a JSON object.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | The code string to execute. |
| callback | [<code>execCallback</code>](#execCallback) | The callback function to execute when we receive the return value. |

<a name="Client+execJSON"></a>

### client.execJSON(code, callback)
Execute a MUSH softcode string that creates a JSON object and return it.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | The code string to execute. |
| callback | [<code>execCallback</code>](#execCallback) | The callback function to execute when we receive the return object. |

<a name="Client+saveLog"></a>

### client.saveLog(filename)
Save the current display to a log file.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The name of the log file to save. |

<a name="Client+saveBackup"></a>

### client.saveBackup(filename)
Save the entire localStorage to a backup file.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The name of the backup file to save. |

<a name="Client+initNotifications"></a>

### client.initNotifications()
Initialize the browser activity notification events.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+initPanels"></a>

### client.initPanels()
Set window panel default parameters and event handlers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+bindKeys"></a>

### client.bindKeys()
Bind key press and key release event handlers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+unbindKeys"></a>

### client.unbindKeys()
Unbind key press and key release event handlers.

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="LOGINFAIL"></a>

## LOGINFAIL : <code>Array.&lt;string&gt;</code>
List of standard server login failure messages.

**Kind**: global constant  
<a name="UnicodeMap"></a>

## UnicodeMap : <code>Object.&lt;string, string&gt;</code>
Maps Unicode characters to ASCII characters.

**Kind**: global constant  
<a name="appendCallback"></a>

## appendCallback : <code>function</code>
**Kind**: global typedef  
<a name="execCallback"></a>

## execCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| result | <code>string</code> | 

