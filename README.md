# mush-portal
The MUSH Portal is an interactive web portal for PennMUSH servers (v1.8.7p1 and up). In addition to a fully customizable 256-color terminal emulator, the MUSH Portal features a highly extensible Javascript-controlled graphical user interface.

See <http://www.mushportal.com> for a live demo on the development server. This MUSH has been enhanced with server-side events that send additional information to the client via JSON objects. See <http://www.mushportal.com?mush.pennmush.org:4201> to connect to the standard, unenhanced PennMUSH development server.

**Note when hosting on HTTPS clients may only connect to MUSH servers on the SSL port due to browser security rules. When hosting on HTTP you can connect to either the standard telnet port or the encrypted SSL port.**

After cloning the repository you can find the pre-built app in ```build/```. This has been built to live at the root of your web server, so you can just copy the contents of ```build/``` to ```/your/html/directory```. If you are hosting from a subdirectory on your web server, you will need to rebuild following the instructions below.

If you plan to modify the app or rebuild it, first run ```npm install``` in the repository folder to install the Javascript dependencies packages to ```node_modules/```. To build the app use ```npm run build``` to compile the source into the ```build/``` directory that you can drop into your existing web server directory. The default options assume you are hosting at the root directory of your web server, e.g. ```http://my.domain.com```. If you are hosting the app in a subdirectory on your web server, you can set the ```PUBLIC_URL``` environment variable, or the ```"homepage"``` key in ```package.json```. For instance ```PUBLIC_URL=/myapp npm run build``` to build the app to be hosted at ```http://my.domain.com/myapp```.

You can run ```npm start``` to run a development webserver on port 3000 that hot-loads your code changes automatically and avoids file caching issues. Start an HTTPS dev server with ```HTTPS=true npm start```. If you wish to use a custom SSL key, modify ```config-overrides.js```.

```public/``` contains the source for files that get copied directly to ```build/``` like ```local.js``` which you can use to customize the client on the server-side.

```src/``` contains the javascript source code for the client and UI. This code must be compiled using ```npm run build```.

```src/client/``` contains the WebSocket client source files, which handle low-level networking and terminal emulation.

```src/modules/``` contains the React component source files, which are used to build the user interface.

```src/index.js``` is the main entry point for source. It is embedded in the HTML file and is responsible for initiating the rest of the app libraries.
