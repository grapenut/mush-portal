
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

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
    margin: '0 20px',
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
});


//////////////////////////////////////////////////////////////////////


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      title: props.title,
    };
  }

  
  toggleDrawer = () => {
    if (this.state.isDrawerOpen) {
      this.closerDrawer();
    } else {
      this.openDrawer();
    }
  };

  openDrawer = () => {
    this.setState({isDrawerOpen: true});
  };
  
  closeDrawer = () => {
    this.setState({isDrawerOpen: false});
  };
  
  setTitle = t => {
    this.setState({title: t});
  };
  
  render() {
    const { classes, theme, title } = this.props;
    
    return (
      <div className={classes.root}>
        <div className={classes.headerFrame}>
          <AppBar className={classes.header} position="static">
            <Toolbar disableGutters={!this.state.open}>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                {this.state.title}
              </Typography>
              <div className={classes.flex}></div>
              <IconButton className={classes.drawerButton} color='inherit' aria-label="open drawer" onClick={this.toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.drawerFrame}>
          <SwipeableDrawer variant="temporary" anchor="top" open={this.state.isDrawerOpen} classes={{paper: classes.drawerPaper}} onClose={this.closeDrawer}>
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

export default withStyles(styles, { withTheme: true })(Header);

