
# MUSH Portal User Documentation

## <a name="userscripts">User-defined Action Scripts</a>

Triggers, macros, timers, keys, and buttons can be configured to execute
either MUSH commands or Javascript code. When executing Javascript code,
we have defined the following objects and functions for your convenience.
Most of these are wrappers or links around different parts of the game's
main `client` object. For more in-depth `client` documentation see
[CLIENT.md](https://github.com/grapenut/mush-portal/tree/master/docs/CLIENT.md).

| Object or Function  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;                   | Description
|:-------------------------------------|--------------------
| `client` or `window.client`          | An instance of the main [Client](https://github.com/grapenut/mush-portal/blob/master/src/client/index.js) class that controls everything in the MUSH Portal.
| [UI](#react) or `client.react`       | A collection of UI components with which you may interact.
| [Output](#output) or `client.output` | A link to the main terminal [Emulator](https://github.com/grapenut/mush-portal/blob/master/src/client/emulator.js) object.
| [Input](#input) or `client.input`    | The command window [UserInput](https://github.com/grapenut/mush-portal/blob/master/src/client/userinput.js) object, `client.input`.
| `Append(text)`                       | Append `text` to the main terminal output. Alias for `Output.appendText(text)`.
| `Send(cmd)`                          | Send a text command or macro to the MUSH, `client.sendCommand(cmd)`.
| `SendText(cmd)`                      | Send a text command directly to the MUSH, `client.sendText(cmd)`.
| `SendAPI(cmd, args)`                 | Send _JSON API_ command with optional string `args` for MUSH servers that have implemented a _JSON API_.
| [Window](#spawn)`(id, config)`       | Open the app or spawn window named `id`, with optional panel `config` settings. See `client.getPanel()` and `client.addPanel()`.


| <a name="spawn">`Window(id)`</a> | Returns the [Spawn](https://github.com/grapenut/mush-portal/blob/master/src/modules/Spawn/index.jsx) so you can chain the following functions.
|----------------------------------|------------------
| `Spawn.SaveHistory()`            | Turns on output history after first loading the existing history. Pass `false` to turn history off.
| `Spawn.AutoHide()`               | Automatically minimize the spawn window after creation.
| `Spawn.Prefix(prefix)`           | Set the command prefix that gets prepended to input commands, e.g. "+public ".
| `Spawn.ShowActivity()`           | Turns on popup activity notifications to preview new output in this window.
| `Spawn.Focus()`                  | Unminimize the window and bring it to the front.
| `Spawn.Append(text)`             | Append `text` to the output window.


| <a name="output">`Output`</a>   | The main terminal [Emulator](https://github.com/grapenut/mush-portal/blob/master/src/client/emulator.js) object, `client.output`.
|---------------------------------|---------------------
| `Output.scrollPageUp()`         | Scroll the terminal up by one page.
| `Output.scrollPageDown()`       | Scroll the terminal down by one page.
| `Output.scrollDown()`           | Scroll the terminal down to the bottom.
| `Output.loadHistory(key)`       | Load history stored in localStorage as `key`.
| `Output.saveHistory(key, size)` | Save history to localStorage as `key` with maximum lines `size`.
| `Output.appendHTML(text)`       | Parse `text` as an HTML fragment and append it to the main terminal output.
| `Output.appendText(text)`       | Append `text` to the main terminal output.
| `Append(text)`                  | Alias for `Output.appendText(text)`.


| <a name="input>`Input`</a> | The command window [UserInput](https://github.com/grapenut/mush-portal/blob/master/src/client/userinput.js) object, `client.input`.
|----------------------------|--------------------
| `Input.cycleBackward()`    | Change the input to the previous command from recall history.
| `Input.cycleForward()`     | Change the input to the next command from recall history.
| `Input.value()`            | Current text of the command input window.
| `Input.focus([force])`     | Move the browser focus to the input window. Set `force` to true to force the input change, even on mobile.


| <a name="react">`UI`</a> | A collection of UI components with which you may interact.
|--------------------------|-------------------
| `UI.portal`              | The top-level [Portal](https://github.com/grapenut/mush-portal/blob/master/src/modules/Portal/index.jsx) `React.Component`.
| `UI.taskbar`             | The [Taskbar](https://github.com/grapenut/mush-portal/blob/master/src/modules/Taskbar/index.jsx) header with action buttons, the task menu, and minimized windows.
| `UI.terminal`            | The [Terminal](https://github.com/grapenut/mush-portal/blob/master/src/modules/Terminal/index.jsx) wrapper around `client.output` and `client.prompt`.
| `UI.input`               | The [Input](https://github.com/grapenut/mush-portal/blob/master/src/modules/Input/index.jsx) wrapper around `client.input`.
| `UI.statusbar`           | The [Statusbar](https://github.com/grapenut/mush-portal/blob/master/src/modules/Statusbar/index.jsx) footer with status messages.
| `UI.login`               | The [Login](https://github.com/grapenut/mush-portal/blob/master/src/modules/Login/index.jsx) form used to input character names and passwords.
| `UI.mailbox`             | The [Mailbox](https://github.com/grapenut/mush-portal/blob/master/src/modules/Mailbox/index.jsx) app for reading @mail.
| `UI.sendmail`            | The [Sendmail](https://github.com/grapenut/mush-portal/blob/master/src/modules/Sendmail/index.jsx) app for sending @mail.
| `UI.bboard`              | The [BBoard](https://github.com/grapenut/mush-portal/blob/master/src/modules/BBoard/index.jsx) app for reading Myrddin's BBS.
| `UI.bbpost`              | The [BBPost](https://github.com/grapenut/mush-portal/blob/master/src/modules/BBPost/index.jsx) app for posting to Myrddin's BBS.
| `UI.upload`              | The [Upload](https://github.com/grapenut/mush-portal/blob/master/src/modules/Upload/index.jsx) app for uploading MUSH commands.
| `UI.backup`              | The [Backup](https://github.com/grapenut/mush-portal/blob/master/src/modules/Backup/index.jsx) app for saving/loading/editting config files.
| `UI.configure`           | The [Configure](https://github.com/grapenut/mush-portal/blob/master/src/modules/Configure/index.jsx) app for user-defined buttons, triggers, timers, keys, macros, CSS, and scripts.
| `UI.spawns[]`            | A list of open [Spawn](https://github.com/grapenut/mush-portal/blob/master/src/modules/Spawn/index.jsx) windows.







