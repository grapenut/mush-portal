/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// custom color configuration
/////////////////////////////////////////////////////////////////////
// override the default color settings, unless the user has chosen
if (!window.localStorage.hasOwnProperty("settings_invertHighlight")) {
  client.changeSetting('invertHighlight', true);
}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// connection settings
/////////////////////////////////////////////////////////////////////
// server address, port and protocol
var serverSSL = window.location.protocol === "https:";
var defaultAddress = "mush.pennmush.org";
var defaultPort = serverSSL ? '4202' : '4201';

// you can override the default address
// www.mysite.com/app?address:port
client.serverSSL = serverSSL;
client.serverAddress = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[0] : defaultAddress;
client.serverPort = window.location.search.substring(1) ? window.location.search.substring(1).split(":")[1] : defaultPort;
client.connect();


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// panel defaults
/////////////////////////////////////////////////////////////////////
var config = client.panels.defaults;

config.theme = "#3f51b5";
//config.container = client.react.container;
config.contentOverflow = "auto";
config.maximizedMargin = 5;
config.syncMargins = true;
config.boxShadow = false;
config.border = "1px solid black";
//config.borderRadius = 10;
//config.panelSize = {
//  width: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
//  height: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
//};
config.position = {
  my: "right-top",
  at: "right-top",
  offsetX: -config.maximizedMargin,
  offsetY: config.maximizedMargin,
};
config.dragit.snap = { repositionOnSnap: true };


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// MUSH event handlers
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn windows
/////////////////////////////////////////////////////////////////////
function openFullHeight(which, obj) {
  obj.panelSize = {
    width: 'calc(50% - ' + 1.5*config.maximizedMargin + 'px)',
    height: 'calc(100% - ' + 2*config.maximizedMargin + 'px)',
  };
  client.addReactPanel(which, obj);
}

// open generic spawn window
client.events.on('spawn', function(obj) {
  client.panels.create(obj);
});

// open the chargen window
client.events.on('chargen', function(obj) {
  client.addReactPanel("Chargen", obj);
});

// open the bboard reader window
client.events.on('boardlist', function(obj) {
  openFullHeight("BBoard", obj);
  client.react.bboard.updateBoardList(obj.boardlist);
});

// open the bboard reader window
client.events.on('bbmsglist', function(obj) {
  openFullHeight("BBoard", obj);
  obj.messages.reverse();
  client.react.bboard.updateBoard(obj);
});

// open the bboard reader window
client.events.on('bbmsg', function(obj) {
  openFullHeight("BBoard", obj);
  client.react.bboard.openMessage(obj);
});

// open the mail reader window
client.events.on('maillist', function(obj) {
  openFullHeight("Mailbox", obj);
  obj.maillist.reverse();
  client.react.mailbox.updateMailList(obj.folder, obj.maillist, obj.unread);
});

// open a single mail item
client.events.on('mailitem', function(obj) {
  openFullHeight("Mailbox", obj);
  client.react.mailbox.openMailItem(obj);
});

// send a mail
client.events.on('sendmail', function(obj) {
  client.addReactPanel("Sendmail", obj);
  client.react.sendmail.setFields(obj.to, obj.subject, obj.body);
});

// update on movement, contents received by listcontents
client.events.on('move', function(obj) {
});

// exit list
client.events.on('listexits', function(obj) {
  client.react.sidebar.updateExits(obj.exits);
});

// player list
client.events.on('listplayers', function(obj) {
  client.react.sidebar.updatePlayers(obj.players);
});

// thing list
client.events.on('listthings', function(obj) {
  client.react.sidebar.updateThings(obj.things);
});

// contents list
client.events.on('listcontents', function(obj) {
  client.react.sidebar.updateExits(obj.exits);
  client.react.sidebar.updatePlayers(obj.players);
  client.react.sidebar.updateThings(obj.things);
});

client.events.on('addobject', function(obj) {
  client.react.sidebar.addObject(obj);
});

client.events.on('delobject', function(obj) {
  client.react.sidebar.delObject(obj);
});

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn overlays/modals
/////////////////////////////////////////////////////////////////////

// open login dialog
client.events.on('connect', function(obj) {
  client.react.login && client.react.login.openLogin(obj.msg);
  client.react.statusbar && client.react.statusbar.setStatus("Connecting...");
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// update taskbar/statusbar furniture
/////////////////////////////////////////////////////////////////////

// change the taskbar title
client.events.on('changetitle', function(obj) {
  client.react.taskbar && client.react.taskbar.setTitle(obj.title);
});

// update the unread mail count on the taskbar
client.events.on('unreadmail', function(obj) {
  client.react.taskbar && client.react.taskbar.setUnreadMail(obj.unread);
});

// update the unread bb message count on the taskbar
client.events.on('unreadbb', function(obj) {
  client.react.taskbar && client.react.taskbar.setUnreadBB(obj.unread);
});

// update the status bar after logging in
client.events.on('login', function(obj) {
  client.loggedIn = true;
  client.react.statusbar && client.react.statusbar.setStatus("Connected to "+obj.login+".");
});

// clear the status bar after logging out
client.events.on('logout', function(obj) {
  client.react.statusbar && client.react.statusbar.setStatus(null);
});

// enable jsonapi commands
client.events.on('jsonapi', function(obj) {
  client.jsonapi = true;
  client.react.taskbar.forceUpdate();
});

