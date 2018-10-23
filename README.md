# mush-portal
An interactive web portal for PennMUSH, including a web terminal client and graphical UI.

See <https://node.grapenut.org> for a live demo.

Made using ```create-react-app```. Refer to your favorite React tutorial for more details.

After cloning the repository enter the directory and ```npm install``` to load javascript dependencies.

You can run ```npm run build``` to compile the code into a static website that you can drop into your existing web server.

You can run ```npm start``` to run a development webserver on port 3000 that hot-loads your code changes automatically.
Start an HTTPS dev server with ```HTTPS=true npm start```.

Edit ```config-overrides.js``` to set your SSL certificate and key files for the development server.
Delete ```config-overrides.js``` to get rid of the SSL config, if you are not using it.

```public/``` contains the local configs and static resources.

```src/``` contains the javascript source code for the client and UI.

```src/client/``` contains the terminal client source files.

```src/modules/``` contains the React component source files.

```src/index.js``` main source file is linked to the HTML.

