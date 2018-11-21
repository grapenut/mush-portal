
import React from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

import ColorPicker from './colorpicker';

import BugReportIcon from '@material-ui/icons/BugReport';
import PaletteIcon from '@material-ui/icons/Palette';
import WrapTextIcon from '@material-ui/icons/WrapText';
import EditIcon from '@material-ui/icons/Edit';
import CodeIcon from '@material-ui/icons/Code';
import BorderLeftIcon from '@material-ui/icons/BorderLeft';
import BorderRightIcon from '@material-ui/icons/BorderRight';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExploreIcon from '@material-ui/icons/Explore';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "relative",
    height: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  left: {
    flex: 1,
    overflowY: "auto",
  },
  right: {
    display: "flex",
    flexFlow: "column nowrap",
  },
  content: {
    display: 'flex',
    flexFlow: "row wrap",
    justifyContent: 'flex-start',
  },
  list: {
    flex: 1,
  },
  switchText: {
    paddingLeft: 0,
    marginRight: 2*theme.spacing.unit,
  },
  buttons: {
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    display: "flex",
    flexFlow: "row nowrap",
  },
});


//////////////////////////////////////////////////////////////////////


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorAnchor: null,
    };
    
    this.color = null;
    
    this.state = Object.assign(this.state, window.client.settings);
  }
  
  handleSwitch = name => event => {
    window.client.changeSetting(name, event.target.checked);
    this.setState({ [name]: window.client.settings[name] });
    window.client.saveSettings();
    window.client.react.portal.forceUpdate();
  };
  
  handleValue = name => event => {
    window.client.changeSetting(name, event.target.value);
    this.setState({ [name]: window.client.settings[name] });
    window.client.saveSettings();
    window.client.react.portal.forceUpdate();
  };
  
  handleColor = name => color => {
    window.client.changeSetting(name, color);
    this.setState({ [name]: window.client.settings[name] });
    window.client.saveSettings();
    window.client.react.portal.forceUpdate();
  };
  
  showColor = name => event => {
    this.color = name;
    this.setState({ colorAnchor: event.currentTarget });
  };
  
  closeColor = () => {
    this.setState({ colorAnchor: null });
  };
  
  chooseColor = color => event => {
    this.setState({ [this.color]: "ansi-"+color });
    this.closeColor();
  };
  
  loadSettings = () => {
    this.setState({ ...window.client.settings });
  }
  
  resetSettings = () => {
    if (!window.confirm("Are you sure you want to reset settings to defaults?")) {
      return;
    }
    
    window.client.settings = Object.assign({}, window.client.defaultSettings);
    this.loadSettings();
    window.client.saveSettings();
    window.client.react.portal.forceUpdate();
  };
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, closeDrawer } = this.props;
    const { debugEvents, decompileEditor, decompileKey, ansiFG, ansiBG, wrapWidth,
      invertHighlight, debugActions,
      sidebarOpen, sidebarAnchor, sidebarAlwaysShow, colorAnchor, sidebarShowPlayers,
      sidebarShowThings, sidebarShowExits, sidebarShowCompass, sidebarWidth } = this.state;
    
    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <div className={classes.content} tabIndex={0} role="button">
            <Popover id="settings.color" anchorEl={colorAnchor} open={false} onClose={this.closeColor}>
            </Popover>
            
            <List className={classes.list} disablePadding dense subheader={<ListSubheader>Debugging</ListSubheader>}>
              <ListItem dense>
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Debug server events?" />
                <ListItemSecondaryAction>
                  <Switch checked={debugEvents} value="debugEvents" onChange={this.handleSwitch('debugEvents')} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Debug user-defined actions?" />
                <ListItemSecondaryAction>
                  <Switch checked={debugActions} value="debugActions" onChange={this.handleSwitch('debugActions')} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <List className={classes.list} disablePadding dense subheader={<ListSubheader>Display Settings</ListSubheader>}>
              <ListItem dense>
                <ListItemIcon>
                  <WrapTextIcon />
                </ListItemIcon>
                <TextField label="Terminal Width" value={wrapWidth} onChange={this.handleValue('wrapWidth')} type="number" />
              </ListItem>
              
              <ListItem dense>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ColorPicker label="Background Color" value={ansiBG} onChange={this.handleColor('ansiBG')} background />
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ColorPicker label="Foreground Color" value={ansiFG} onChange={this.handleColor('ansiFG')} />
              </ListItem>
              
              <ListItem dense>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Invert foreground & background?" />
                <ListItemSecondaryAction>
                  <Switch checked={invertHighlight} value="invertHighlight" onChange={this.handleSwitch('invertHighlight')} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <List className={classes.list} disablePadding dense subheader={<ListSubheader>@decompile/tf</ListSubheader>}>
              <ListItem dense>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Send @dec/tf to editor." />
                <ListItemSecondaryAction>
                  <Switch checked={decompileEditor} value="decompileEditor" onChange={this.handleSwitch('decompileEditor')} />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <TextField label="TFPREFIX" value={decompileKey} onChange={this.handleValue('decompileKey')} helperText="Prefix used by @dec/tf." />
              </ListItem>
            </List>

            <List className={classes.list} disablePadding dense subheader={<ListSubheader>Sidebar Display</ListSubheader>}>
              <ListItem dense>
                <ListItemIcon>
                  <VerticalSplitIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Show sidebar?" />
                <ListItemSecondaryAction>
                  <Switch checked={sidebarOpen} value="sidebarOpen" onChange={this.handleSwitch('sidebarOpen')} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen}>
                <ListItemIcon>
                  <PictureInPictureIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Keep panels off sidebar?" />
                <ListItemSecondaryAction>
                  <Switch disabled={!sidebarOpen} checked={sidebarAlwaysShow} value="sidebarAlwaysShow" onChange={this.handleSwitch('sidebarAlwaysShow')} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen}>
                <Icon color="action">
                  <BorderLeftIcon />
                </Icon>
                <ListItemText primary="Left" />
                <Switch checked={sidebarAnchor === "right"}
                  color="default" disabled={!sidebarOpen}
                  value={sidebarAnchor === "right" ? "left" : "right"}
                  onChange={this.handleValue('sidebarAnchor')}
                />
                <ListItemText primary="Right" />
                <Icon color="action">
                  <BorderRightIcon />
                </Icon>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen}>
                <ListItemIcon>
                  <FormatIndentIncreaseIcon />
                </ListItemIcon>
                <TextField label="Sidebar Width" value={sidebarWidth} onChange={this.handleValue('sidebarWidth')} />
              </ListItem>
            </List>
            
            <List className={classes.list} disabled={!sidebarOpen} disablePadding dense subheader={<ListSubheader>Sidebar Content</ListSubheader>}>
              <ListItem dense disabled={!sidebarOpen}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Show players?" />
                <ListItemSecondaryAction>
                  <Switch disabled={!sidebarOpen} checked={sidebarShowPlayers} value="sidebarShowPlayers" onChange={this.handleSwitch('sidebarShowPlayers')} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen}>
                <ListItemIcon>
                  <GroupWorkIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Show things?" />
                <ListItemSecondaryAction>
                  <Switch disabled={!sidebarOpen} checked={sidebarShowThings} value="sidebarShowThings" onChange={this.handleSwitch('sidebarShowThings')} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen}>
                <ListItemIcon>
                  <ExploreIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Show exits?" />
                <ListItemSecondaryAction>
                  <Switch checked={sidebarShowExits} disabled={!sidebarOpen} value="sidebarShowExits" onChange={this.handleSwitch('sidebarShowExits')} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem dense disabled={!sidebarOpen || !sidebarShowExits}>
                <ListItemIcon>
                  <ExploreIcon />
                </ListItemIcon>
                <ListItemText className={classes.switchText} primary="Show compass?" />
                <ListItemSecondaryAction>
                  <Switch disabled={!sidebarOpen || !sidebarShowExits} checked={sidebarShowCompass} value="sidebarShowCompass" onChange={this.handleSwitch('sidebarShowCompass')} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.buttons}>
            <Button className={classes.reset} onClick={this.resetSettings}>
              Reset
            </Button>
            <Button className={classes.close} onClick={closeDrawer}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Settings);

