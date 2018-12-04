

class Templates {
  constructor() {
    // blank triggers, timers, macros, and keybindings
    this.empty = {
      buttons: {
        name: "",
        text: "",
        javascript: false,
        icon: "icon-portal",
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
        disabled: true,
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
        code: 0,
        ctrl: false,
        alt: false,
        shift: false,
        prevent: true,
        release: true,
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
      ],
      timers: [
        {
          name: "EveryMinute",
          text: "th DING!",
          javascript: false,
          disabled: true,
          delay: 60,
          repeat: true,
          times: -1,
        },
/*
        {
          name: "",
          text: "",
          javascript: false,
          disabled: true,
          delay: 0,
          repeat: false,
          times: 0,
        },
*/
      ],
      macros: [
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
/*
        {
          name: "",
          text: "",
          javascript: false,
          pattern: "",
          regex: false,
        },
*/
      ],
      keys: [
        {
          name: "ScrollToBottom",
          text: "Output.scrollDown();",
          javascript: true,
          code: 34,
          ctrl: false,
          alt: false,
          shift: true,
          prevent: true,
          release: true,
        },
        {
          name: "RecallPrevious",
          text: "Input.cycleBackward();",
          javascript: true,
          code: 38,
          ctrl: false,
          alt: false,
          shift: true,
          prevent: true,
          release: true,
        },
        {
          name: "RecallNext",
          text: "Input.cycleForward();",
          javascript: true,
          code: 40,
          ctrl: false,
          alt: false,
          shift: true,
          prevent: true,
          release: true,
        },
/*
        {
          name: "",
          text: "",
          javascript: false,
          code: 0,
          ctrl: false,
          alt: false,
          shift: false,
          prevent: true,
          release: true,
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

