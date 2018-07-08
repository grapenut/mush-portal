import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './modules/Portal';
import Client from './client/main';

// ========================================

var terminal = "Terminal"
var output = "Terminal-output";
var prompt = "Terminal-prompt";
var links = "Terminal-links";
var input = "Terminal-input";

ReactDOM.render(<Portal terminal={terminal} output={output} prompt={prompt} links={links} input={input} />, document.getElementById('root'));

var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '4202' : '4201';

var serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
var serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;

// The connection URL is ws://host:port/wsclient (or wss:// for SSL connections)
var client = new Client();
client.connect(serverAddress, serverPort, serverSSL);


