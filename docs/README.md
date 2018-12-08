
# MUSH Portal API Documentation

If you are hacking the source code you might want to take a look at the
[Client](https://github.com/grapenut/mush-portal/tree/master/docs/CLIENT.md)
class.

## <a name="userscripts">User-defined Action Scripts</a>

Triggers, macros, timers, keys, and buttons can be configured to execute
either MUSH commands or Javascript code. When executing Javascript code,
we have defined the following objects and functions for your convenience.
Most of these are wrappers or links around different parts of the game's
main `client` object which controls every aspect of the MUSH Portal.

| Object                   | Description
|--------------------------|------------------
| `client`                 | An instance of the main [Client]() class that controls everything in the MUSH Portal.
| `UI`                     | A collection of UI components with which you may interact, a link to `client.react`.
| `Output`                 | A link to the main terminal [Emulator]() object, `client.output`.
| `Append(text)`           | Append `text` to the main terminal output. Alias for `client.output.appendText(text)`.
| `Input`                  | The command window [UserInput]() object, `client.input`.
| `Send(cmd)`              | Send a text command or macro to the MUSH, `client.sendCommand(cmd)`.
| `SendText(cmd)`          | Send a text command directly to the MUSH, `client.sendText(cmd)`.
| `SendAPI(cmd)`           | Send a _JSON API_ command to the MUSH automatically failing over to a player-run version if available, `client.sendAPI(cmd)`.
| `Window(id\[, config\])` | Open or create a window named `id`. Optionally pass the `config` object with panel options. See `client.getPanel()` and `client.addPanel()`.

| `Output`                        | The main terminal [Emulator]() object, `client.output`.
|---------------------------------|---------------------
| `Output.scrollPageUp()`         | Scroll the terminal up by one page.
| `Output.scrollPageDown()`       | Scroll the terminal down by one page.
| `Output.scrollDown()`           | Scroll the terminal down to the bottom.
| `Output.loadHistory(key)`       | Load history stored in localStorage as `key`.
| `Output.saveHistory(key, size)` | Save history to localStorage as `key` with maximum lines `size`.
| `Output.appendHTML(text)`       | Parse `text` as an HTML fragment and append it to the main terminal output.
| `Output.appendText(text)`       | Append `text` to the main terminal output.
| `Append(text)`                  | Alias for `client.output.appendText(text)`.

| `Input`                  | The command window [UserInput]() object, `client.input`.
|--------------------------|--------------------
| `Input.cycleBackward()`  | Change the input to the previous command from recall history.
| `Input.cycleForward()`   | Change the input to the next command from recall history.
| `Input.value()`          | Current text of the command input window.
| `Input.focus(\[force\])` | Move the browser focus to the input window. Set `force` to true to force the input change, even on mobile.

| `UI`            | A collection of UI components with which you may interact.
|-----------------|-------------------
| `UI.portal`     | The top-level [Portal]() `React.Component`.
| `UI.taskbar`    | The [Taskbar]() header with action buttons, the task menu, and minimized windows.
| `UI.terminal`   | The [Terminal]() wrapper around `client.output` and `client.prompt`.
| `UI.input`      | The [Input]() wrapper around `client.input`.
| `UI.statusbar`  | The [Statusbar]() footer with status messages.
| `UI.login`      | The [Login]() form used to input character names and passwords.
| `UI.mailbox`    | The [Mailbox]() app for reading @mail.
| `UI.sendmail`   | The [Sendmail]() app for sending @mail.
| `UI.bboard`     | The [BBoard]() app for reading Myrddin's BBS.
| `UI.bbpost`     | The [BBPost]() app for posting to Myrddin's BBS.
| `UI.upload`     | The [Upload]() app for uploading MUSH commands.
| `UI.backup`     | The [Backup]() app for saving/loading/editting config files.
| `UI.configure`  | The [Configure]() app for user-defined buttons, triggers, timers, keys, macros, CSS, and scripts.
| `UI.spawns\[\]` | A list of open [Spawn]() windows.







