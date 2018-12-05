
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
//import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
//import ReplyIcon from '@material-ui/icons/Reply';
//import ForwardIcon from '@material-ui/icons/Forward';
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
  output: {
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


class BBMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
    
    this.body = React.createRef();
    this.emulator = null;
  }
  
  componentDidMount() {
    const { message } = this.props;
    this.emulator = new Emulator(this.body.current);
    this.emulator.appendText(message.body+'\n');
  }
  
  showMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  
  closeMenu = () => {
    this.setState({ anchorEl: null });
  };
  
  render() {
    const { classes, message } = this.props;
    const { anchorEl } = this.state;
    const { ansiFG, ansiBG } = window.client.settings;
    const { fontFamily, fontSize } = window.client.settings;

    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: fontSize + "pt",
    };
    
    this.emulator && this.emulator.clear();
    this.emulator && this.emulator.appendText(message.body);
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={message.subject}
          subheader={
            <span className={classes.sub}>
              <span className={classes.left}>
                {message.author}
              </span>
              <span className={classes.right}>
                {message.date}
              </span>
            </span>
          }
        />
        <CardContent className={classes.body}>
          <div ref={this.body} className={classNames(classes.output, ansiFG, ansiBG)} style={font}></div>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button className={classes.mobileOnly} onClick={() => window.client.react.bboard.setState({ bbmsg: null })}>
            <Icon>
              <CloseIcon />
            </Icon>
            Close
          </Button>
          <IconButton aria-owns={anchorEl ? 'message.menu' : null} aria-haspopup="true" onClick={this.showMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu id="message.menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMenu}>
{/*
            <MenuItem onClick={}></MenuItem>
            <MenuItem onClick={}> Message</MenuItem>
*/}
          </Menu>
        </CardActions>
      </Card>
    );
  }
}

BBMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBMessage);

