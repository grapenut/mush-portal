# [mush-portal](.) *0.1.0*



### src/client/index.js


#### LOGINFAIL() 

List of standard server login failure messages.






##### Returns


- `Void`



#### UnicodeMap() 

Maps Unicode characters to ASCII characters.






##### Returns


- `Void`



#### constructor() 

The main Client class controls and links together everything.






##### Returns


- `Void`



#### render() 

Render the main React component.






##### Returns


- `Void`



#### loadScript(src) 

Load a script from the source URL by appending a <script> tag to the body.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| src | `string`  | - The URL of the script to load. | &nbsp; |




##### Returns


- `Void`



#### execUserScript(name) 

Find and execute a user-defined script by name.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name | `string`  | - Name of the script to execute. | &nbsp; |




##### Returns


- `Void`



#### execActionScript(txt[, event]) 

Evaluate a fragment of Javascript code.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| txt | `string`  | - The code to execute. | &nbsp; |
| event | `Event`  | - The event, if present. | *Optional* |




##### Returns


- `Void`



#### loadStyle(src) 

Load custom CSS style sheet from the source URL by appending a <link> tag to the head.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| src | `string`  | - The URL of the CSS file to load. | &nbsp; |




##### Returns


- `Void`



#### updateCSS(css[, erase&#x3D;false]) 

Update the CSS definition object's rules on its <style> element.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| css | `Object.<string, string>`  | - The CSS definition object. | &nbsp; |
| erase&#x3D;false | `boolean`  | - Erase the existing style first. | *Optional* |




##### Returns


- `HTMLElement`  - The <style> tag with CSS added.



#### unloadStyle(src) 

Uunload custom CSS style sheet loading from source URL.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| src | `string`  | - The source URL of the CSS file to unload. | &nbsp; |




##### Returns


- `Void`



#### createTheme([theme]) 

Create a new Material-UI theme from a theme configuration object.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| theme | `Object.<string, *>`  | - The theme configuration object. | *Optional* |




##### Returns


- `MuiTheme`  - The new theme object.



#### saveText(filename, text[, type&#x3D;text/plain]) 

Save a text string to a local file.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| filename | `string`  | - The name of the file to save. | &nbsp; |
| text | `string`  | - The text of the file to save. | &nbsp; |
| type&#x3D;text/plain | `string`  | - The MIME type of the file Blob. | *Optional* |




##### Returns


- `boolean`  - Whether the save was successful or not.



#### localStorageToText([indent&#x3D;0]) 

Convert localStorage to JSON object text.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| indent&#x3D;0 | `string`  | - If indent != 0 we use a pretty printer. If 0 or undefined we minify. | *Optional* |




##### Returns


- `string`  - The JSON.stringified object text.



#### restoreLocalStorage(text) 

Restore localStorage from a string.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| text | `string`  | - The string from which to restore localStorage. | &nbsp; |




##### Returns


- `boolean`  - Whether the text was succesfully parsed and merged with localStorage.



#### loadLocalStorage(obj, key) 

Load a configuration object string from localStorage.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| obj | `Object.<string, *>`  | - The reference onto which to store the retrieved object. | &nbsp; |
| key | `string`  | - The key of the object on localStorage. | &nbsp; |




##### Returns


- `Void`



#### clearLocalStorage(key) 

Delete a configuration object from localStorage.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| key | `string`  | - The key of the object on localStorage. | &nbsp; |




##### Returns


- `Void`



#### saveLocalStorage(obj, key) 

Save a configuration object to localStorage.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| obj | `Object.<string, *>`  | - The object to be stored. | &nbsp; |
| key | `string`  | - The key of the object on localStorage. | &nbsp; |




##### Returns


- `Void`



#### loadHistoryBuffer(key) 

Load a history buffer string from localStorage.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| key | `string`  | - The key of the buffer on localStorage. | &nbsp; |




##### Returns


- `string`  - The buffer string.



#### saveHistoryBuffer(key, text) 

Save a history buffer string to localStorage.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| key | `string`  | - The key of the buffer on localStorage. | &nbsp; |
| text | `string`  | - The value of the buffer. | &nbsp; |




##### Returns


- `Void`



#### castString(obj, key, value) 

Set a value on an object, converting the argument to the correct type.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| obj | `Object.<string, *>`  | - The object on which to store the value. | &nbsp; |
| key | `string`  | - The key of the value to store on the object. | &nbsp; |
| value |  | - The value to be stored. | &nbsp; |




##### Returns


- `Void`



#### changeSetting(key, value) 

Change a setting, updating the UI if necessary.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| key | `string`  | - The key of the setting to change. | &nbsp; |
| value | `string`  | - The new value of the setting. | &nbsp; |




##### Returns


- `Void`



#### loadButtons() 

Load user-defined taskbar buttons.






##### Returns


- `Void`



#### loadTriggers() 

Load regex/wildcard pattern triggers.






##### Returns


- `Void`



#### loadTimers() 

Load automatic timers.






##### Returns


- `Void`



#### loadMacros() 

Load slash command macros.






##### Returns


- `Void`



#### loadKeys() 

Load custom keybindings.






##### Returns


- `Void`



#### loadCSS() 

Load custom css overrides.






##### Returns


- `Void`



#### loadScripts() 

Load custom scripts.






##### Returns


- `Void`



#### loadSettings() 

Load client settings.






##### Returns


- `Void`



#### loadRecallHistory() 

Load command recall history.






##### Returns


- `Void`



#### saveRecallHistory() 

Save command recall history.






##### Returns


- `Void`



#### saveButtons() 

Save user-defined taskbar buttons.






##### Returns


- `Void`



#### saveTriggers() 

Save regex/wildcard pattern triggers.






##### Returns


- `Void`



#### saveTimers() 

Save automatic timers.






##### Returns


- `Void`



#### saveMacros() 

Save command macros.






##### Returns


- `Void`



#### saveKeys() 

Save custom keybindings.






##### Returns


- `Void`



#### saveCSS() 

Save custom css overrides.






##### Returns


- `Void`



#### saveScripts() 

Save custom css overrides.






##### Returns


- `Void`



#### saveSettings() 

Save client settings.






##### Returns


- `Void`



#### parseCommand(command) 

Detect if more user input is required for a pueblo command.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| command | `string`  | - The command string to parse for '??' tokens. | &nbsp; |




##### Returns


- `string`  - The command string with '??' tokens replace by user input.



#### onCommand(cmd) 

Execute a Pueblo command link, checking if it requires user input.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| cmd | `string`  | - The command string. | &nbsp; |




##### Returns


- `Void`



#### appendMessage(classid, msg) 

Log messages to the output terminal.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| classid | `string`  | - The CSS class id of the log message. | &nbsp; |
| msg | `string`  | - The message to append to the terminal. | &nbsp; |




##### Returns


- `Void`



#### createPattern(regex, pattern) 

Create a new RegExp pattern, creating one from a glob wildcard pattern if necessary.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| regex | `boolean`  | - Is the pattern already a regex? If not we will make one. | &nbsp; |
| pattern | `string`  | - The pattern string. | &nbsp; |




##### Returns


- `RegExp`  - The compiled regular expression.



#### replaceArgs(args, text) 

Replace %-tokens in a text string with match argument strings.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| args | `Array.<string>`  | - The arguments array, element 0 is the full string. | &nbsp; |
| text | `string`  | - The text to be scanned for %number tokens which are replaced by args[number]. | &nbsp; |




##### Returns


- `string`  - The new text with arguments replaced if they are present.



#### clear() 

Clear the terminal.






##### Returns


- `Void`



#### initInput(input) 

Initialize the terminal input window.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| input | `HTMLElement`  | - The HTML element to which the Input object is attached. | &nbsp; |




##### Returns


- `Void`



#### initOutput(output[, container&#x3D;null]) 

Initialize the terminal output window.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| output | `HTMLElement`  | - The HTML element to which the Emulator object is attached. | &nbsp; |
| container&#x3D;null | `HTMLElement`  | - The output elements container. | *Optional* |




##### Returns


- `Void`



#### initPrompt(prompt) 

Initialize the command prompt.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| prompt | `HTMLElement`  | - The HTML element to which the Emulator object is attached. | &nbsp; |




##### Returns


- `Void`



#### scrollDown(root) 

Scroll the terminal output window down the very bottom of the current view.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| root | `HTMLElement`  | - The HTML element to be scrolled down. | &nbsp; |




##### Returns


- `Void`



#### focus(force) 

Passthrough for focusing the Input root.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| force | `boolean`  | - Whether to force the Input element to focus even if the normal rules determine it shouldn't. | &nbsp; |




##### Returns


- `Void`



#### scrollIfNeeded(fun) 

Wrapper for appending text that scrolls the output afterwards if needed.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| fun | `appendCallback`  | - The wrapper function that appends text. | &nbsp; |




##### Returns


- `Void`



#### addPanel(id, cfg[, component&#x3D;Spawn]) 

Add a window panel with the given id and configuration, using a particular React component if provided.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |
| cfg | `Object.<string, *>`  | - The panel configuration. | &nbsp; |
| component&#x3D;Spawn | `React.Component`  | - The React component that serves as a base. | *Optional* |




##### Returns


- `Object`  - A reference to the panel if it already exists, or undefined if not.



#### getSpawn(id, cfg, el) 

Create a new window with addPanel if one is not found with findSpawn.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |
| cfg | `Object.<string, *>`  | - The panel configuration object. | &nbsp; |
| el | `HTMLElemet`  | - The element to create inside the window. | &nbsp; |




##### Returns


- `jsPanel`  - The window panel that was found, or the new one created.



#### delSpawn(id) 

Delete spawn window from internal list.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |




##### Returns


- `Void`



#### findSpawn(id) 

Find spawn window in internal list.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |




##### Returns


- `jsPanel`  - The window panel if found, or null.



#### closePanel(id) 

Find and close a window panel.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |




##### Returns


- `Void`



#### focusPanel(id) 

Bring a window panel into focus.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - The window id. | &nbsp; |




##### Returns


- `Void`



#### connect() 

Connect to the game server and setup message handlers.






##### Returns


- `Void`



#### this.conn.onUpdate() 

onMessage callback before data handler






##### Returns


- `Void`



#### this.conn.onText() 

handle incoming text






##### Returns


- `Void`



#### this.conn.onHTML() 

handle incoming html






##### Returns


- `Void`



#### this.conn.onPueblo() 

handle incoming pueblo






##### Returns


- `Void`



#### this.conn.onPrompt() 

handle incoming command prompts






##### Returns


- `Void`



#### this.conn.onObject() 

use the Events handler collection






##### Returns


- `Void`



#### sendCommand(cmd) 

Send a command string to the server, check macros for a match and append a local echo.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| cmd | `string`  | - The command string to send. | &nbsp; |




##### Returns


- `Void`



#### sendMacro(cmds) 

Check a string for multiple commands and match them against the list of macros.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| cmds | `string`  | - A string of one or more commands separated by newlines. | &nbsp; |




##### Returns


- `Void`



#### sendAPI(cmd, args) 

Send an API command, falling back to player-executed softcode if the server doesn't support it.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| cmd | `string`  | - The API command name. | &nbsp; |
| args | `Array.<string>`  | - An array of string arguments to pass to the API command. | &nbsp; |




##### Returns


- `Void`



#### execString(code, callback) 

Execute a MUSH softcode string and return the result as a string in a JSON object.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| code | `string`  | - The code string to execute. | &nbsp; |
| callback | `execCallback`  | - The callback function to execute when we receive the return value. | &nbsp; |




##### Returns


- `Void`



#### execJSON(code, callback) 

Execute a MUSH softcode string that creates a JSON object and return it.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| code | `string`  | - The code string to execute. | &nbsp; |
| callback | `execCallback`  | - The callback function to execute when we receive the return object. | &nbsp; |




##### Returns


- `Void`



#### saveLog(filename) 

Save the current display to a log file.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| filename | `string`  | - The name of the log file to save. | &nbsp; |




##### Returns


- `Void`



#### saveBackup(filename) 

Save the entire localStorage to a backup file.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| filename | `string`  | - The name of the backup file to save. | &nbsp; |




##### Returns


- `Void`



#### initNotifications() 

Initialize the browser activity notification events.






##### Returns


- `Void`



#### initPanels() 

Set window panel default parameters and event handlers.






##### Returns


- `Void`



#### bindKeys() 

Bind key press and key release event handlers.






##### Returns


- `Void`



#### unbindKeys() 

Unbind key press and key release event handlers.






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
