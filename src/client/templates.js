

class Templates {
  constructor() {
    // blank triggers, timers, macros, and keybindings
    this.empty = {
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

