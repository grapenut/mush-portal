
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MailList from './MailList';
import MailItem from './MailItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    height: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    position: "relative",
    height: "100%",
    flex: 1,
  },
  right: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  mail: {
    position: "absolute",
    overflowY: "auto",
    maxHeight: "100%",
  },
  list: {
    position: "absolute",
    overflowY: "auto",
    maxHeight: "100%",
  },
  listitem: {
  },
  listicon: {
    fontSize: 14,
    margin: 0,
  },
  listsub: {
    display: "flex",
  },
  listfrom: {
    flex: 1,
  },
  listtime: {
    marginLeft: "3em",
  },
  read: {
    opacity: 0.5,
  },
});


//////////////////////////////////////////////////////////////////////


class MailBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      folder: props.folder ? props.folder : 0,
      folderlist: [{ id: 0, name: "Inbox" }],
      maillist: props.maillist ? props.maillist : [ ],
    };
    this.client = props.client;
  }
  
  openMail = (message) => {
    this.setState({ message });
    
    const { maillist } = this.state;
    
    const mail = maillist[message];
    if (mail.unread) {
      mail.unread = false;
      this.forceUpdate();
      this.client.sendText("@mail/status "+mail.folder+":"+mail.id+"=read");

      const { unreadMail } = this.client.react.header.state;
      this.client.react.header.setUnreadMail(unreadMail-1);
    }
  }

  componentDidMount() {
    this.client.react.mailbox = this;
  }
  
  componentWillUnmount() {
    this.client.react.mailbox = null;
  }
  
  updateMailList(folder, maillist) {
    this.setState({ folder, maillist });
  }
  
  updateFolderList(folderlist) {
    this.setState({ folderlist });
  }
  
  render() {
    const { classes } = this.props;
    const { maillist, message } = this.state;
    const { openMail } = this.openMail;

    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <MailList maillist={maillist} openMail={openMail} />
        </div>
        <div className={classes.right}>
          {message !== null && (
            <MailItem mail={maillist[message]} />
          )}
        </div>
      </div>
    );
  }
}

MailBox.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  folder: PropTypes.number,
  maillist: PropTypes.array,
};

export default withStyles(styles, { withTheme: true })(MailBox);

