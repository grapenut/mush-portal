
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MailList from './MailList';
import MailItem from './MailItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    position: "relative",
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
  right: {
    flex: 1,
    maxHeight: "100%",
    position: "relative",
  },
  mobileClose: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  mobileOpen: {
    display: 'flex',
  },
});


//////////////////////////////////////////////////////////////////////


class Mailbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mailitem: null,
      unreadMail: props.unread ? props.unread : 0,
      folder: props.folder ? props.folder : 0,
      folderlist: [{ id: 0, name: "Inbox" }],
      maillist: props.maillist ? props.maillist : [ ],
    };
  }
  
  openMail = (message) => {
    const { maillist, unreadMail } = this.state;
    const mail = maillist[message];
    
    if (mail.unread) {
      mail.unread = false;
      this.setState({ maillist, unreadMail: unreadMail-1 });
      window.client.sendText("@mail/status "+mail.id+"=read");
    }
    
    window.client.sendAPI("mailitem", mail.id);
  }
  
  handleMark = (message) => {
    const { maillist } = this.state;
    const mail = maillist[message];
    
    mail.deleted = !mail.deleted;
    
    if (mail.deleted) {
      window.client.sendText("@mail/clear "+mail.id);
    } else {
      window.client.sendText("@mail/unclear "+mail.id);
    }
    
    this.setState({ maillist });
  }
  
  setUnreadMail(unreadMail) {
    this.setState({ unreadMail })
    window.client.react.taskbar.setUnreadMail(unreadMail);
  }

  markDeleted() {
    const { maillist, mailitem } = this.state;
    
    if (mailitem.deleted) {
      return;
    }
    
    mailitem.deleted = true;
    maillist[mailitem.key].deleted = true;
    window.client.sendText("@mail/clear "+mailitem.id);
    this.setState({ maillist, mailitem });
  }

  markUndeleted() {
    const { maillist, mailitem } = this.state;
    
    if (!mailitem.deleted) {
      return;
    }
    
    mailitem.deleted = false;
    maillist[mailitem.key].deleted = false;
    window.client.sendText("@mail/unclear "+mailitem.id);
    this.setState({ maillist, mailitem });
  }

  markUnread() {
    const { maillist, mailitem, unreadMail } = this.state;
    
    if (mailitem.unread) {
      return;
    }
    
    mailitem.unread = true;
    maillist[mailitem.key].unread = true;
    window.client.sendText("@mail/status "+mailitem.id+"=unread");
    this.setState({ maillist, mailitem, unreadMail: unreadMail+1 });
  }

  purgeMail() {
    if (window.confirm("Do you want to purge deleted mail?")) {
      const { maillist, mailitem } = this.state;

      if (mailitem && maillist[mailitem.key].deleted) {
        // we are purging the current mailitem, so clear it
        this.setState({ mailitem: null });
      }
      window.client.sendText("@mail/purge");
      window.client.sendAPI("maillist");
    }
  }
  
  sendMail(to, subject, body) {
    if (window.client.react.sendmail) {
      window.client.focusPanel("Sendmail");
      if (window.confirm("Replace current draft with new mail?")) {
        window.client.react.sendmail.setFields(to, subject, body);
      }
    } else {
      window.client.addPanel("Sendmail", { icon: "mail" });
      window.client.react.sendmail.setFields(to, subject, body);
    }  
  }

  componentDidMount() {
    window.client.react.mailbox = this;
  }
  
  componentWillUnmount() {
    window.client.react.mailbox = null;
  }
  
  updateMailList(folder, maillist, unreadMail) {
    this.setState({ folder, maillist, unreadMail });
  }
  
  updateFolderList(folderlist) {
    this.setState({ folderlist });
  }
  
  openMailItem(mailitem) {
    const { maillist } = this.state;
    maillist.forEach((mail,i) => {
      if (mail.id === mailitem.id) {
        mailitem.key = i;
      }
    });
    this.setState({ mailitem });
  }

  render() {
    const { classes } = this.props;
    const { maillist, mailitem, unreadMail } = this.state;

    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <span className={mailitem ? classes.mobileClose : classes.mobileOpen}>
            { maillist && (
              <MailList maillist={maillist} unread={unreadMail} openMail={this.openMail} handleMark={this.handleMark} />
            )}
          </span>
        </div>
        { mailitem && (
          <div className={classes.right}>
            <MailItem mail={mailitem} />
          </div>
        )}
      </div>
    );
  }
}

Mailbox.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  folder: PropTypes.number,
  maillist: PropTypes.array,
  mailitem: PropTypes.object,
  unread: PropTypes.number,
};

export default withStyles(styles, { withTheme: true })(Mailbox);

	