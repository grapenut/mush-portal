
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
    flex: 1,
  },
  right: {
    flex: 1,
    maxHeight: "100%",
    position: "relative",
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
    const { maillist } = this.state;
    const mail = maillist[message];
    
    window.client.sendText("jsonapi/mailitem "+mail.id);
    
    if (mail.unread) {
      mail.unread = false;
      this.forceUpdate();
      window.client.sendText("@mail/status "+mail.id+"=read");

      const { unreadMail } = this.state;
      this.setUnreadMail(unreadMail-1);
    }
  }
  
  setUnreadMail(unreadMail) {
    this.setState({ unreadMail })
    window.client.react.taskbar.setUnreadMail(unreadMail);
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
    this.setState({ mailitem });
  }

  render() {
    const { classes } = this.props;
    const { maillist, mailitem, unreadMail } = this.state;

    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          { maillist && (
            <MailList maillist={maillist} unread={unreadMail} openMail={this.openMail} />
          )}
        </div>
        <div className={classes.right}>
          { mailitem && (
            <MailItem mail={mailitem} />
          )}
        </div>
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

	