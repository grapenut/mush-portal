
# MUSH Portal API Documentation

If you are hacking the source code you might want to take a look at the
[Client](https://github.com/grapenut/mush-portal/tree/master/docs/CLIENT.md)
class.

## <a name="userscripts">User-defined Javascript</a>

Triggers, macros, timers, keys, and buttons with javascript actions are all
executed with the same environment. In addition to the main `client` object
that controls everything, there are also a few functions and other objects
defined for convenience.

| Object                           | Description
|----------------------------------|-------------
| `client`                         | An instance of the main [Client]() class that controls everything in the MUSH Portal.
| `Output`                         | A link to the main terminal [Emulator]() object, `client.output`.
| `Append(text)`                   | Append `text` to the main terminal output, `client.output.appendText(text)`.
| `Input`                          | The command window [UserInput]() object, `client.input`.
| `Send(cmd)`                      | Send a text command or macro to the MUSH, `client.sendCommand(cmd)`.
| `SendText(cmd)`                  | Send a text command directly to the MUSH, `client.sendText(cmd)`.
| `SendAPI(cmd)`                   | Send a _JSON API_ command to the MUSH automatically failing over to a player-run version if available, `client.sendAPI(cmd)`.
| `Window(id [, config[, event]])` | Open or create a window named `id`. Optionally pass the `config` object with panel options, or the `event` if the window was spawned by an event. `client.getPanel(id, config, event)`

| `UI`            | A collection of UI components with which you may interact.
|-----------------|-------------------
| `UI.portal`     | The top-level [Portal]() `React.Component`.
| `UI.taskbar`    | The [Taskbar]() header with action buttons, the task menu, and minimized windows.
| `UI.terminal`   | The [Terminal]() wrapper around `client.output` and `client.prompt`.
| `UI.input`      | The [Input]() wrapper around `client.input`..
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







