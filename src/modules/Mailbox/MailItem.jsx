
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
//import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import ForwardIcon from '@material-ui/icons/Forward';
import CloseIcon from '@material-ui/icons/Close';

import Emulator from '../../client/emulator';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  card: {
    height: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  header: {
    display: "flex",
    "flex-flow": "row nowrap",
  },
  sub: {
    display: "flex",
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: "3em",
  },
  body: {
    flex: 1,
    display: "flex",
  },
  actions: {
    "justify-content": "space-evenly",
  },
  button: {
    display: "block",
  },
  wrap: {
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "10pt",
    width: "100%",
    flex: 1,
    "overflow-y": "auto",
    "overflow-x": "hidden",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    padding: "0.25em 0.5em",
  },
  mobileOnly: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});


//////////////////////////////////////////////////////////////////////


class MailItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };

    this.body = React.createRef();
    this.emulator = null;
  }
  
  componentDidMount() {
    const { mail } = this.props;
    this.emulator = new Emulator(this.body.current);
    this.emulator.appendText(mail.body+'\n');
  }
  
  showMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  
  closeMenu = () => {
    this.setState({ anchorEl: null });
  };
  
  markUnread = () => {
    window.client.react.mailbox.markUnread();
    this.closeMenu();
  };
  
  markDeleted = () => {
    window.client.react.mailbox.markDeleted();
    this.closeMenu();
  };
  
  markUndeleted = () => {
    window.client.react.mailbox.markUndeleted();
    this.closeMenu();
  };
  
  replyMail = () => {
    const { mail } = this.props;
    window.client.react.mailbox.sendMail(mail.from, "Re: "+mail.subject, "");
  };
  
  forwardMail = () => {
    const { mail } = this.props;
    window.client.react.mailbox.sendMail("", "Fwd: "+mail.subject, mail.body);
  };
  
  render() {
    const { classes, mail } = this.props;
    const { anchorEl } = this.state;
    const { ansiFG, ansiBG } = window.client.settings;    
    const { fontFamily, fontSize } = window.client.settings;

    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? fontSize/2 : fontSize) + "pt",
    };

    this.emulator && this.emulator.clear();
    this.emulator && this.emulator.appendText(mail.body+'\n');
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={mail.subject}
          subheader={
            <span className={classes.sub}>
              <span className={classes.left}>
                {mail.from}
              </span>
              <span className={classes.right}>
                {mail.time}
              </span>
            </span>
          }
        />
        <CardContent className={classes.body}>
          <div ref={this.body} className={classNames(classes.wrap, ansiFG, ansiBG)} style={font}></div>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button className={classes.mobileOnly} onClick={() => window.client.react.mailbox.setState({ mailitem: null })}>
            <Icon>
              <CloseIcon />
            </Icon>
            Close
          </Button>
          <Button className={classes.button} onClick={this.replyMail}>
            <Icon>
              <ReplyIcon />
            </Icon>
            Reply
          </Button>
          <Button className={classes.button} onClick={this.forwardMail}>
            <Icon>
              <ForwardIcon />
            </Icon>
            Forward
          </Button>
          <IconButton aria-owns={anchorEl ? 'mailitem.menu' : null} aria-haspopup="true" onClick={this.showMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu id="mailitem.menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMenu}>
            <MenuItem onClick={this.markUnread}>Mark as Unread</MenuItem>
            {mail.deleted ? (
              <MenuItem onClick={this.markUndeleted}>Restore Message</MenuItem>
            ) : (
              <MenuItem onClick={this.markDeleted}>Move to Trash</MenuItem>
            )}
          </Menu>
        </CardActions>
      </Card>
    );
  }
}

MailItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  mail: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MailItem);

