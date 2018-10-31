# mush-portal
The Mush Portal is an interactive web portal for PennMUSH servers (v1.8.7 and up). It features a terminal client with full xterm 256 color support and an extensible user interface.

See <https://node.grapenut.org> for a live demo on my test server. This MUSH has server-side events that send additional information to the client.

You can also try <https://node.grapenut.org?mush.pennmush.org:4202> to see it in action on a standard PennMUSH server without additional enhancements.

After cloning the repository you can find the pre-built app in ```build/```. This has been built to live at the root of your web server, so you can just copy the contents of ```build/``` to ```/your/html/directory```. If you are hosting from a subdirectory on your web server, you will need to rebuild following the instructions below.

This project was created using ```create-react-app```, so you may refer to your favorite React tutorial for more details about the architecture.

If you plan to modify the app or rebuild it, first run ```npm install``` in the repository folder to install the Javascript dependencies packages to ```node_modules/```.

To build the app use ```npm run build``` to compile the source into a static website that you can drop into your existing web server. The default options assume you are hosting at the root directory of your web server, e.g. ```http://my.domain.com```. If you are hosting the app in a subdirectory on your web server, you can set the ```PUBLIC_URL``` environment variable, or the ```"homepage"``` key in ```package.json```. For instance ```PUBLIC_URL=/myapp npm run build``` to build the app to be hosted at ```http://my.domain.com/myapp```.

You can run ```npm start``` to run a development webserver on port 3000 that hot-loads your code changes automatically and avoids file caching issues. Start an HTTPS dev server with ```HTTPS=true npm start```. If you wish to use a custom SSL key, modify ```config-overrides.js```.

```public/``` contains the static resources and uncompiled Javascript that can be modified to change basic behaviour without rebuilding the app.

```src/``` contains the javascript source code for the client and UI. This code must be compiled using ```npm run build```.

```src/client/``` contains the WebSocket client source files, which handle low-level networking and terminal emulation.

```src/modules/``` contains the React component source files, which are used to build the user interface.

```src/index.js``` is the main entry point for source. It is embedded in the HTML file and is responsible for initiating the rest of the app libraries.

