# <a name="top">![][logo] MUSH Portal</a>

[logo]: https://github.com/grapenut/mush-portal/raw/master/build/favicon-32x32.png "MUSH Portal"

The _MUSH Portal_ is an integrated web platform for PennMUSH servers (**PennMUSH v1.8.7p0 or higher required**). The web client has a fully customizable 256-color terminal emulator designed with a **responsive mobile-friendly** UI. The Javascript controlled user interface is completely user configurable using the editing tools. It can integrate with the provided server-side JSON event handler and command API to provide unprecedented interactivity. Automatic _JSON API_ fallbacks executed by the client's player provide enhanced functionality on standard servers without the _JSON API_ installed.

See the [installation instructions](#install) below for information about hosting _MUSH Portal_ on your own website.

------------------------------------------------------------------

## <a name="demo">Demo</a>

The _MUSH Portal_ website at <http://www.mushportal.com> connects to _grapenut's_ _JSON API_-enhanced development MUSH by default, but can easily be connected to any PennMUSH server with WebSockets. See <http://www.mushportal.com?mush.pennmush.org:4201> to connect to the standard, un-enhanced M\*U\*S\*H development server.

###### Active Games with MUSH Portals
- [Blood of Dragons](http://westeros.org/BoD/Portal/)

------------------------------------------------------------------

## <a name="features">Feature List</a>

> - User-defined Configuration
>   - Create and modify taskbar buttons, text triggers, command macros, and timers.
>   - Execute MUSH commands or Javascript code on activation.
>   - Override ANSI color CSS and onLoad scripts for complete customization.
>   - Load pre-made examples of typical user-defined actions to use as templates.

> - Sidebar Navigation
>   - Configurable docked panel with interactive context command buttons.
>   - Show basic information about the room (contents, players, exits).

> - Spawn Windows
>   - Append text, e.g. from matched triggers, with full 256-color support.
>   - Update taskbar icon of minimized window on new activity.
>   - Secondary input window with optional command prefix (so you don't have to type +p).

> - Taskbar
>   - Customize icon buttons that execute MUSH commands or Javascript code.
>   - Stay aware of minimized spawn windows with new activity counters.
>   - Launch client task windows and change settings from the task menu.
>     - Configuration editing tool gives complete control over all UI and client functionality.
>     - Edit and upload MUSH commands from a file, a URL, captured from @dec/tf, or edited manually.
>     - Download terminal output logs to a local file.
>     - Backup client configuration to a JSON file, restore from file/url, or directly edit in the browser.
>     - Show interactive command history listing.
>     - Clear the terminal output or reconnect to the server.

> - Mailbox
>   - List, view, and compose @mail messages with full 256-color output.
>   - Automatic player name validation in Sendmail input.
>   - Unread message count is synced with taskbar icons.

> - Command Recall
>   - Press Ctrl+p (previous) and Ctrl+n (next) to cycle history, or use the buttons.
>   - Interactive list of prior commands available from the task menu.
>   - Command recall history is automatically saved and restored after page refresh.

> - Output History
>   - Update browser tab icon on new activity when not in focus.
>   - Automatically save output history and restore on page refresh.
>   - Separate output history buffers for the main terminal and spawn windows.

> - Server-side _JSON API_
>   - Execute MUSH softcode and return the results to the client using JSON.
>   - Server-side events and global _JSON API_ commands with server support.
>   - Client-side fallbacks for sidebar updates and @mail without server support.
>   - Execute MUSH softcode as your player and receive JSON results.

> - Custom UI Settings
>   - Change server host, port, and SSL encryption.
>   - Terminal font, font size, and word wrapping width.
>   - Default ANSI background/foreground colors and invert black/white color scheme.
>   - Command recall size and output history size.
>   - Sidebar size, position, contents, and navigation compass.
>   - @decompile/tf multiple attributes directly to the command upload editor.
>   - Dev console output for debugging user-defined Javascript and MUSH events.
>   - Mobile friendly screen space and text visibility enhancements.

> - Over 4300+ Icons Available
>   - Choose any icon from Game-Icons.net and Google Material Icons.
>   - See <http://www.mushportal.com/icons.html> for a complete list of icons.

------------------------------------------------------------------

## <a name="install">Adding MUSH Portal To Your Website</a>

**NOTE: When hosting the website on HTTPS clients may only connect to MUSH servers on the SSL port due to browser security rules. When hosting on HTTP you can connect to either the standard telnet port or the encrypted SSL port.**

**A proxy may be configured in your HTTP/HTTPS server to relay WebSocket SSL connections to a non-secure standard telnet port, useful for tunneling through corporate firewalls. Examples for _grapenut's_ development MUSH can bee seen using <http://www.mushportal.com?mushportal.com:80> for HTTP or <https://mushportal.com?mushportal.com:443> for HTTPS/SSL.**

After cloning the repository with
```
git clone https://github.com/grapenut/mush-portal.git
```
you can find the pre-built app in ```build/```. Many customizations can be achieved at run-time without modifying the source code or installing additional dependencies. To get started just copy the contents of ```build/``` to your web server directory.
```
cp -r mush-portal/build/* /your/html/directory/
```

**Edit the default ```local.js``` file for site-specific configuration.** Change the default server address, theme, and color settings. You can also set default taskbar buttons, text triggers, command macros, and timers. _JSON API_ event handlers are defined to handle JSON objects received from the server.
------------------------------------------------------------------

If you plan to modify and build the source code you must have an updated [NodeJS](https://nodejs.org/en/download/) installation with ```npm``` to install the Javascript dependencies.
```
cd mush-portal
npm install
```

Compile the _MUSH Portal_ source into the ```build/``` directory.
```
npm run build
```

If you are hosting the _MUSH Portal_ in a subdirectory on your web server you can explicitly set the ```PUBLIC_URL``` environment variable or the ```"homepage"``` key in ```package.json```. To build the _MUSH Portal_ hosted at ```http://domain.com/mygame/index.html``` use
```
PUBLIC_URL=/mygame npm run build
```

------------------------------------------------------------------

You can start a development web server on port 3000 that hot-loads your code changes automatically and avoids file caching issues.
```
npm start
```

Or test out HTTPS.
```
HTTPS=true npm start
```

------------------------------------------------------------------

###### <a name="files">Directory Listing</a>

> - ```public/``` contains the source for files that get copied directly to ```build/``` like styles, fonts, mobile configuration files, and the local client customization file ```local.js```.

>   - ```public/local.js``` contains site-specific customizations. Access the _MUSH Portal_ _Client API_ using the ```client``` object.

> - ```src/``` contains the Javascript source code for the client and UI. This code must be compiled using ```npm run build```.

>   - ```src/client/``` contains the WebSocket client source files, which handle low-level networking and terminal emulation.

>   - ```src/modules/``` contains the React component source files, which are used to build the user interface.

>  - ```src/index.js``` is the main entry point for source. It is embedded in the HTML file and is responsible for initiating the rest of the app libraries.

------------------------------------------------------------------

[Back to the top.](#top)

