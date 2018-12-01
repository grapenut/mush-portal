

class Templates {
  constructor() {
    // blank triggers, timers, macros, and keybindings
    this.empty = {
      buttons: {
        name: "",
        text: "",
        javascript: false,
        icon: "widgets",
        count: "0",
        tooltip: "",
        
      },
      triggers: {
        name: "",
        text: "",
        javascript: false,
        pattern: "",
        regex: false,
        suppress: false,
      },
      timers: {
        name: "",
        text: "",
        javascript: false,
        delay: 0,
        repeat: false,
        times: 0,
      },
      macros: {
        name: "",
        text: "",
        javascript: false,
        pattern: "",
        regex: false,
      },
      keys: {
        name: "",
        text: "",
        javascript: false,
        keycode: null,
        ctrl: false,
        alt: false,
        shift: false,
      },
      css: {
        name: "",
        text: "",
      },
      scripts: {
        name: "",
        text: "// Insert JavaScript below.\n",
      },
    };
    
    this.saved = {
      buttons: [
        {
          name: "look",
          text: "look",
          javascript: false,
          icon: "remove_red_eye",
          count: "",
          tooltip: "Look around.",
        },
        {
          name: "inventory",
          text: "inventory",
          javascript: false,
          icon: "business_center",
          count: "",
          tooltip: "What am I carrying?",
        },
        {
          name: "who",
          text: "who",
          javascript: false,
          icon: "people",
          count: "",
          tooltip: "Who's online?",
        },
        {
          name: "Mailbox",
          text: "SendAPI(\"maillist\");",
          javascript: true,
          icon: "mail",
          count: "client.react.taskbar.state.unreadMail",
          tooltip: "@mail Inbox",
        },
        {
          name: "BBoard",
          text: "SendAPI(\"boardlist\");",
          javascript: true,
          icon: "forum",
          count: "client.react.taskbar.state.unreadBB",
          tooltip: "Bulletin Boards",
        },
        {
          name: "help",
          text: "client.react.taskbar.showHelp(event);",
          javascript: true,
          icon: "search",
          count: "",
          tooltip: "Search help files",
        },
/*
        {
          name: "",
          text: "",
          javascript: false,
          icon: "widgets",
          count: "",
          tooltip: "",
        },
*/        
      ],
      triggers: [
/*
        {
          name: "",
          text: "",
          javascript: false,
          pattern: "",
          regex: false,
          suppress: false,
        }
*/
        {
          name: "PerChannel",
          text: "Window(\"%1\").SaveHistory().Prefix(\"+%1 \").AutoHide().append(\"%0\");",
          javascript: true,
          pattern: "<*> *",
          regex: false,
          suppress: true,
        },
        {
          name: "AllChannels",
          text: "Window(\"Channels\").SaveHistory().append(\"%0\");",
          javascript: true,
          pattern: "<*> *",
          regex: false,
          suppress: true,
        },
      ],
      timers: [
/*
        {
          name: "",
          text: "",
          javascript: false,
          delay: 0,
          repeat: false,
          times: 0,
        },
*/
      ],
      macros: [
/*
        {
          name: "",
          text: "",
          javascript: false,
          pattern: "",
          regex: false,
        },
*/
        {
          name: "OpenWindow",
          text: "Window(\"%2\").SaveHistory().Prefix(\"+%2 \").Focus();",
          javascript: true,
          pattern: "/win(dow)? (.*)",
          regex: true,
        },
        {
          name: "ChannelRecall",
          text: "th crecall(%1,100,,%r)",
          javascript: false,
          pattern: "/recall *",
          regex: false,
        },
      ],
      keys: [
/*
        {
          name: "",
          text: "",
          javascript: false,
          keycode: null,
          ctrl: false,
          alt: false,
          shift: false,
        },
*/
      ],
      css: [
/*
        {
          name: "",
          text: "",
        },
*/
      ],
      scripts: [
/*
        {
          name: "",
          text: "// Insert JavaScript below.\n",
        },
*/
      ],
    };
  }

}



export default Templates;

