
const JSONAPI = {
  maillist: function(self, args) {
    self.sendText("th null(oob(%#,maillist,json(object,folder,json(number,if(%0,before(%0,:),0)),maillist,\\[[iter(maillist(%#,if(%0,before(%0,:):,0:)),json(object,id,json(string,%i0),deleted,switch(setr(0,mailstatus(%#,%i0)),*C*,true,false),unread,switch(%q0,N*,true,false),urgent,switch(%q0,*U*,true,false),time,json(string,mailtime(%#,%i0)),subject,json(string,mailsubject(%#,%i0)),from,json(string,if(setr(0,mailfrom(%#,%i0)),name(%q0),!PURGED!))),,\\,)]\\],unread,json(number,extract(mailfstats(%#),6,1)))))");
  },
  mailitem: function(self, args) {
    self.sendText("th null(oob(%#,mailitem,json(object,id,json(string,"+args+"),deleted,switch(setr(0,mailstatus(%#,"+args+")),*C*,true,false),unread,switch(%q0,N*,true,false),urgent,switch(%q0,*U*,true,false),time,json(string,mailtime(%#,"+args+")),subject,json(string,mailsubject(%#,"+args+")),from,json(string,if(setr(0,mailfrom(%#,"+args+")),name(%q0),!PURGED!)),body,json(string,mail(%#,"+args+")))))");
  },
  boardlist: function(self, args) {
    self.sendText("+bbread");
  },
  bbmsglist: function(self, args) {
    self.sendText("+bbread "+args);
  },
  bbmsg: function(self, args) {
    self.sendText("+bbread "+args);
  },
  listcontents: function(self, args) {
    self.sendText("th null(oob(%#,listcontents,json(object,players,\\[[iter(remove(lvplayers(%l),%#),json(string,name(%i0)),,\\,)]\\],exits,\\[[iter(lexits(%l),json(string,fullname(%i0)),,\\,)]\\],things,\\[[iter(lvthings(%l),json(string,name(%i0)),,\\,)]\\])))");
  },
};

export default JSONAPI;
