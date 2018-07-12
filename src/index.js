import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './modules/Portal';
import Client from './client/main';
import './style.css';

// ========================================

var terminal_ids = {
  terminal: "Terminal",
  output: "Terminal-output",
  prompt: "Terminal-prompt",
  links: "Terminal-links",
  input: "Terminal-input",
};

var feed_ids = {
  dragbar: "Feed-dragbar",
  tabbar: "Feed-tabbar",
  feed: "Feed-main",
};

var client = new Client();

ReactDOM.render(<Portal terminal_ids={terminal_ids} feed_ids={feed_ids} client={client} />, document.getElementById('root'));

var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '4202' : '4201';
var serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
var serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;
client.connect(serverAddress, serverPort, serverSSL);


