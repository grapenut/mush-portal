
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
| `client`                         | The `client` object is the main class that controls everything in the MUSH Portal.
| `Window(id [, config[, event]])` | Open or create a window named `id`. Optionally pass the `config` object with panel options, or the `event` if the window was spawned by an event.
| `Send(cmd)`                      | Send a text command to the MUSH, checking for macros.
| `SendText(cmd)`                  | Send a text command directly to the MUSH.
| `SendAPI(cmd)`                   | Send a _JSON API_ command to the MUSH, automatically failing over to a player-run version if available.
| `Append(text)`                   | Append `text` to the main terminal output.
| `Output`                         | The main terminal output object.
| `Input`                          | The command window input object.
| `UI`                             | A collection of UI components with which you may interact.
| `UI.portal`                      | The top-level `React.Component`.
| `UI.taskbar`                     | The header with buttons and minimized windows.
| `UI.terminal`                    | The terminal emulator UI wrapper.
| `UI.input`                       | The command input UI wrapper.
| `UI.statusbar`                   | The footer with status messages.
| `UI.login`                       | The character login form.
| `UI.mailbox`                     | The Mailbox app for reading @mail.
| `UI.sendmail`                    | The Sendmail app for sending @mail.
| `UI.bboard`                      | The BBoard app for reading Myrddin's BBS.
| `UI.bbpost`                      | The BBPost app for posting to Myrddin's BBS.
| `UI.upload`                      | The Upload app for uploading MUSH commands.
| `UI.backup`                      | The Backup app for saving/loading/editting config files.
| `UI.configure`                   | The Configure app for user-defined buttons, triggers, timers, keys, macros, CSS, and scripts.
| `UI.spawns`                      | A list of open windows.







