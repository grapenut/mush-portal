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

// load local customization file
client.loadScript('./local.js');
