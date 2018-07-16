
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import blueGrey from '@material-ui/core/colors/blueGrey';

import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

import Mail from './Mail';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    height: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    "overflow-y": "auto",
  },
  right: {
    flex: 1,
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


class Mailbox extends React.Component {
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
    
    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <List
            dense
            disablePadding
            subheader={<ListSubheader component="div">Messages</ListSubheader>}
          >
            {maillist.map((mail,i) => (
              <ListItem
                key={mail.id}
                button
                dense
                divider
                onClick={() => this.openMail(i)}
              >
              <ListItemIcon className={classes.listicon}>
                {mail.unread ? (
                  mail.urgent ? (
                      <PriorityHighIcon />
                  ) : (
                      <MailIcon />
                  )
                ) : (
                  <DraftsIcon className={classes.read} />
                )}
              </ListItemIcon>
              <ListItemText
                  primary={mail.subject}
                  secondary={
                    <span className={classes.listsub}>
                      <span className={classes.listfrom}>
                        {mail.from}
                      </span>
                      <span className={classes.listtime}>
                        {mail.time}
                      </span>
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div className={classes.right}>
          {message !== null && (
            <Mail mail={maillist[message]} />
          )}
        </div>
      </div>
    );
  }
}

Mailbox.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  folder: PropTypes.number,
  maillist: PropTypes.array,
};

export default withStyles(styles, { withTheme: true })(Mailbox);

