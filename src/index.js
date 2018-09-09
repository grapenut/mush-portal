import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Portal from './modules/Portal';
import Client from './client';
import './style.css';

// ========================================

var client = new Client();
window.client = client;

// restore layout config from cookie
var config = JSON.parse(localStorage.getItem('savedConfig'), function(key, value) {
  if (key === 'client') {
    return client;
  }
  return value;
});

// default layout config
if (config === null)
{
  config = {
    isClosable: false,
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
        }
      }]
    }]
  };
}

// make things global for Golden Layout
window.jQuery = jQuery;
window.React = React;
window.ReactDOM = ReactDOM;

// render the react app layout
// ReactDOM.render(<Portal client={client} config={config} />, document.getElementById('root'));
ReactDOM.render(React.createElement(Portal, { client, config }, null), document.getElementById('root'));

// load custom JSON event handlers
client.loadScript('./events.js');

// setup client address and connect
var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '4202' : '4201';
var serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
var serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;
client.connect(serverAddress, serverPort, serverSSL);



