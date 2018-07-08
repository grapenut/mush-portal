import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './modules/portal';
import Client from './client/main';

// ========================================

var output = "Terminal";
var prompt = "Prompt";
var links = "QuickLinks";
var input = "UserInput";

ReactDOM.render(<Portal output={output} prompt={prompt} links={links} />, document.getElementById('root'));

var client = new Client();

