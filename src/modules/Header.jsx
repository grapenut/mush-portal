
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import ForumIcon from '@material-ui/icons/Forum';

//////////////////////////////////////////////////////////////////////


const drawerHeight = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  headerFrame: {
  },
  header: {
  },
  title: {
    margin: '0 20px',
  },
  flex: {
    flex: 1,
  },
  drawerButton: {
    margin: theme.spacing.unit * 2,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: drawerHeight,
  },
  drawerFrame: {
    width: '100%',
  },
  drawerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerClose: {
  },
  mailButton: {
    margin: theme.spacing.unit * 2,
  },
  BBButton: {
    margin: theme.spacing.unit * 2,
  },
});


function BadgeIcon(props) {
  if (props.count > 0) {
    return (
      <Badge badgeContent={props.count} color="error">
        {props.children}
      </Badge>
    );
  }
  return props.children;
};

//////////////////////////////////////////////////////////////////////


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: props.title,
      unreadBB: 0,
      unreadMail: 0,
    };
    this.client = props.client;
  }

  
  toggleDrawer = () => {
    if (this.state.open) {
      this.closerDrawer();
    } else {
      this.openDrawer();
    }
  };

  openDrawer = () => {
    this.setState({open: true});
  };
  
  closeDrawer = () => {
    this.setState({open: false});
  };
  
  openMail = () => {
    this.client.sendText("jsonapi/maillist");
  };

  setTitle = t => {
    this.setState({title: t});
  };
  
  setUnreadMail = u => {
    this.setState({unreadMail: u});
  };

  setUnreadBB = u => {
    this.setState({unreadBB: u});
  };
  
  componentDidMount() {
    this.client.react.header = this;
  }
  
  render() {
    const { classes } = this.props;
    const { title, open, unreadBB, unreadMail } = this.state;
    
    return (
      <div className={classes.root}>
        <div className={classes.headerFrame}>
          <AppBar className={classes.header} position="static">
            <Toolbar disableGutters={!this.state.open}>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                {title}
              </Typography>
              <div className={classes.flex}></div>
              <IconButton className={classes.BBButton} color='inherit' aria-label="open-bbs" onClick={this.openBBS}>
                <BadgeIcon count={unreadBB}>
                  <ForumIcon />
                </BadgeIcon>
              </IconButton>
              <IconButton className={classes.mailButton} color='inherit' aria-label="open-mail" onClick={this.openMail}>
                <BadgeIcon count={unreadMail}>
                  <MailIcon />
                </BadgeIcon>
              </IconButton>
              <IconButton className={classes.drawerButton} color='inherit' aria-label="open-drawer" onClick={this.toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.drawerFrame}>
          <SwipeableDrawer
            variant="temporary"
            anchor="top"
            open={open}
            classes={{paper: classes.drawerPaper}}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
          >
            <div className={classes.drawerContent} tabIndex={0} role="button" onClick={this.closeDrawer} onKeyDown={this.closeDrawer}>
              This is where we will have the local client settings, host address, and username/password.
            </div>
            <div className={classes.flex}></div>
            <Button className={classes.drawerClose} onClick={this.closeDrawer}>
              Close
            </Button>
          </SwipeableDrawer>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Header);

