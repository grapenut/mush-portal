import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './modules/Portal';
import Client from './client';
import './style.css';

// ========================================

// create the MUSH client
var client = new Client();

// render the react Portal app
ReactDOM.render(React.createElement(Portal, null, null), document.getElementById('root'));

// custom handlers for JSON events from the MUSH
client.loadScript('./local.js');

// setup client address and connect
var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '4202' : '4201';
var serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
var serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;
client.connect(serverAddress, serverPort, serverSSL);



