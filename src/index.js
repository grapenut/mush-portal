import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Portal from './modules/Portal';
import Client from './client';
import './style.css';

// ========================================

var client = new Client();
window.client = client;

var config = {
  content: [{
    type: 'row',
    isClosable: false,
    content: [{
      type: 'react-component',
      isClosable: false,
      title: 'Terminal',
      id: 'Terminal',
      component: 'Terminal',
      props: {
        client: client,
        ids: {
          output: "Terminal-output",
          prompt: "Terminal-prompt",
          links: "Terminal-links",
          input: "Terminal-input",
        }
      }
    }]
  }]
};

window.jQuery = jQuery;
window.React = React;
window.ReactDOM = ReactDOM;

ReactDOM.render(<Portal client={client} config={config} />, document.getElementById('root'));

var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '4202' : '4201';
var serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
var serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;
client.connect(serverAddress, serverPort, serverSSL);


