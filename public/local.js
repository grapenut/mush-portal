/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// custom color configuration
/////////////////////////////////////////////////////////////////////
// override the default emulator color settings, unless user-defined
//if (!window.localStorage.hasOwnProperty("settings_invertHighlight")) {
//  client.changeSetting('invertHighlight', true);
//}

client.theme = client.createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: client.colors.indigo,
    secondary: client.colors.blueGrey,
    type: 'dark',
  },
});
client.react.portal.updateTheme(client.theme);

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// connection settings
/////////////////////////////////////////////////////////////////////
// server address, port and protocol
var serverSSL = window.location.protocol === "https:";
var defaultAddress = "node.grapenut.org";
var defaultPort = serverSSL ? '2001' : '2000';

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
var panelConfig = client.panels.defaults;

panelConfig.theme = client.theme.palette.primary.main;
panelConfig.contentOverflow = "auto";
panelConfig.maximizedMargin = 5;
panelConfig.syncMargins = true;
panelConfig.boxShadow = false;
panelConfig.border = "1px solid black";
panelConfig.position = {
  my: "right-top",
  at: "right-top",
  offsetX: -panelConfig.maximizedMargin,
  offsetY: panelConfig.maximizedMargin,
};
//panelConfig.dragit.snap = { repositionOnSnap: true };


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Taskbar buttons
/////////////////////////////////////////////////////////////////////

client.react.taskbar.addButton({
  title: "Look around.",
  ariaLabel: "send-look",
  action: function() { client.sendCommand("look"); client.sendAPI("listcontents"); },
  icon: "remove_red_eye",
});

client.react.taskbar.addButton({
  title: "What am I carrying?",
  ariaLabel: "send-inventory",
  action: function() { client.sendCommand("inventory"); },
  icon: "business_center",

});

client.react.taskbar.addButton({
  title: "Who's online?",
  ariaLabel: "send-who",
  action: function() { client.sendCommand("who"); },
  icon: "people",

});

client.react.taskbar.addButton({
  title: "Bulletin Boards",
  ariaLabel: "open-bbs",
  action: function() { client.sendAPI("boardlist"); },
  count: function() { return client.react.taskbar.state.unreadBB; },
  icon: "forum",
});

client.react.taskbar.addButton({
  title: "@mail Inbox",
  ariaLabel: "open-mail",
  action: function() { client.sendAPI("maillist"); },
  count: function() { return client.react.taskbar.state.unreadMail; },
  icon: "mail",
});

client.react.taskbar.addButton({
  title: "Need help?",
  ariaLabel: "help",
  action: function(e) { client.react.taskbar.showHelp(e); },
  icon: "search",
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// MUSH event handlers
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// spawn windows
/////////////////////////////////////////////////////////////////////

// open generic spawn window
client.events.on('spawn', function(obj) {
  client.panels.create(obj);
});

// open the bboard reader window
client.events.on('boardlist', function(obj) {
  obj.icon = "forum";
  client.addReactPanel("BBoard", obj);
  client.react.bboard.updateBoardList(obj.boardlist);
});

// open the bboard reader window
client.events.on('bbmsglist', function(obj) {
  obj.icon = "forum";
  client.addReactPanel("BBoard", obj);
  obj.messages.reverse();
  client.react.bboard.updateBoard(obj);
});

// open the bboard reader window
client.events.on('bbmsg', function(obj) {
  obj.icon = "forum";
  client.addReactPanel("BBoard", obj);
  client.react.bboard.openMessage(obj);
});

// open the mail reader window
client.events.on('maillist', function(obj) {
  obj.icon = "mail";
  client.addReactPanel("Mailbox", obj);
  obj.maillist.reverse();
  client.react.mailbox.updateMailList(obj.folder, obj.maillist, obj.unread);
});

// open a single mail item
client.events.on('mailitem', function(obj) {
  obj.icon = "mail";
  client.addReactPanel("Mailbox", obj);
  client.react.mailbox.openMailItem(obj);
});

// send a mail
client.events.on('sendmail', function(obj) {
  obj.icon = "mail";
  obj.panelSize = "30em 30em";
  client.addReactPanel("Sendmail", obj);
  client.react.sendmail.setFields(obj.to, obj.subject, obj.body);
});

// update on movement, contents received by listcontents
client.events.on('move', function(obj) {
});

// exit list
client.events.on('listexits', function(obj) {
  if (!client.settings.sidebarOpen) return;
  client.react.sidebar.updateExits(obj.exits);
});

// player list
client.events.on('listplayers', function(obj) {
  if (!client.settings.sidebarOpen) return;
  client.react.sidebar.updatePlayers(obj.players);
});

// thing list
client.events.on('listthings', function(obj) {
  if (!client.settings.sidebarOpen) return;
  client.react.sidebar.updateThings(obj.things);
});

// contents list
client.events.on('listcontents', function(obj) {
  if (!client.settings.sidebarOpen) return;
  client.react.sidebar.updateExits(obj.exits);
  client.react.sidebar.updatePlayers(obj.players);
  client.react.sidebar.updateThings(obj.things);
});

client.events.on('addobject', function(obj) {
  if (!client.settings.sidebarOpen) return;
  client.react.sidebar.addObject(obj);
});

client.events.on('delobject', function(obj) {
  if (!client.settings.sidebarOpen) return;
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

