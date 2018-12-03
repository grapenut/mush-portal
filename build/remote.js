/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// connection settings
/////////////////////////////////////////////////////////////////////

client.settings.serverSSL = window.location.protocol === "https:";
client.settings.serverAddress = window.location.hostname;
client.settings.serverPort = window.location.port;
client.settings.allowServerChange = true;
client.connect();

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// custom color configuration
/////////////////////////////////////////////////////////////////////

// invert the default colors and highlighting, for black text on white background
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

/* Example buttons implementing common MUSH tasks */
/*   name	: string, the button id
/*   text	: string, the commands, macros, or javascript to execute
/*   javascript	: boolean, true=javascript false=mush commands
/*   icon	: string, icon name. see https://material.io/tools/icons/
/*   count	: string, javascript expression, contents of icon badge
/*   tooltip	: string, text of the hover tooltip
/* */
if (client.buttons.length === 0) {
  client.buttons = [{
    name: "look",
    text: "look",
    javascript: false,
    icon: "remove_red_eye",
    count: "",
    tooltip: "Look around.",
  },
  /* */
  /*
  {
    name: "inventory",
    text: "inventory",
    javascript: false,
    icon: "business_center",
    count: "",
    tooltip: "What am I carrying?",
  },
  /* */
  {
    name: "who",
    text: "who",
    javascript: false,
    icon: "people",
    count: "",
    tooltip: "Who's online?",
  },
  /* */
  {
    name: "Mailbox",
    text: "SendAPI(\"maillist\");",
    javascript: true,
    icon: "mail",
    count: "client.react.taskbar.state.unreadMail",
    tooltip: "@mail Inbox",
  },
  /* */
  /*
  {
    name: "BBoard",
    text: "SendAPI(\"boardlist\");",
    javascript: true,
    icon: "forum",
    count: "client.react.taskbar.state.unreadBB",
    tooltip: "Bulletin Boards",
  },
  /* */
  {
    name: "help",
    text: "client.react.taskbar.showHelp(event);",
    javascript: true,
    icon: "search",
    count: "",
    tooltip: "Search help files",
  }];
  client.saveButtons();
}

/* */
/*
if (client.triggers.length === 0) {
  client.triggers = [{
    name: "AllChannels",
    text: "Window(\"Channels\").SaveHistory().append(\"%0\");",
    javascript: true,
    pattern: "<*> *",
    regex: false,
    suppress: true,
  }];
  client.saveTriggers();
}
/* */



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Default macros
/////////////////////////////////////////////////////////////////////

if (client.macros.length === 0) {
  client.macros = [{
    name: "OpenWindow",
    text: "Window(\"%2\").SaveHistory().Prefix(\"+%2 \").Focus();",
    javascript: true,
    pattern: "/win(dow)? (.*)",
    regex: true,
  }];
  client.saveMacros();
}


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
  client.addPanel("BBoard", obj);
  client.react.bboard.updateBoardList(obj.boardlist);
});

// open the bboard reader window
client.events.on('bbmsglist', function(obj) {
  obj.icon = "forum";
  client.addPanel("BBoard", obj);
  obj.messages.reverse();
  client.react.bboard.updateBoard(obj);
});

// open the bboard reader window
client.events.on('bbmsg', function(obj) {
  obj.icon = "forum";
  client.addPanel("BBoard", obj);
  client.react.bboard.openMessage(obj);
});

// open the mail reader window
client.events.on('maillist', function(obj) {
  obj.icon = "mail";
  client.addPanel("Mailbox", obj);
  obj.maillist.reverse();
  client.react.mailbox.updateMailList(obj.folder, obj.maillist, obj.unread);
});

// open a single mail item
client.events.on('mailitem', function(obj) {
  obj.icon = "mail";
  client.addPanel("Mailbox", obj);
  client.react.mailbox.openMailItem(obj);
});

// send a mail
client.events.on('sendmail', function(obj) {
  obj.icon = "mail";
  obj.panelSize = "30em 30em";
  client.addPanel("Sendmail", obj);
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
  client.react.login && client.react.login.setMessage(obj.msg);
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
  client.react.login.closeLogin();
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

