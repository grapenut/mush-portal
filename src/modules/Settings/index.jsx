
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
//import ListItemText from '@material-ui/core/ListItemText';

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
    width: "100%",
    height: "100%",
    display: "flex",
    'flex-flow': 'row nowrap',
  },
  content: {
    flex: 1,
    display: 'flex',
//    alignItems: 'center',
//    justifyContent: 'flex-end',
//    padding: '0 8px',
//    ...theme.mixins.toolbar,
  },
  close: {
  },
  flex: {
    flex: 1,
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
    this.colorList = [
                       [ "30", "31", "32", "33", "34", "35", "36", "37" ],
                       [ "1-30", "1-31", "1-32", "1-33", "1-34", "1-35", "1-36", "1-37" ],
                     ];
    
    Object.keys(window.client.settings).forEach(key => {
      this.state[key] = window.client.settings[key];
    });
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
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, closeDrawer } = this.props;
    const { debugEvents, decompileEditor, decompileKey, ansiFG, ansiBG, wrapWidth,
      sidebarOpen, sidebarAnchor, sidebarAlwaysShow, colorAnchor, sidebarShowPlayers,
      sidebarShowThings, sidebarShowExits, sidebarShowCompass, sidebarWidth } = this.state;
    
    return (
      <div className={classes.frame}>
        <div className={classes.content} tabIndex={0} role="button">
          <Popover id="settings.color" anchorEl={colorAnchor} open={false} onClose={this.closeColor}>
            {this.colorList.map((row,i) => (
              row.map((color, c) => (
                <div key={i+","+c} className={classNames(classes.colorButton, "ansi-"+color)} onClick={this.chooseColor(color)}></div>
              ))
            ))}
          </Popover>
          
          <List disablePadding dense subheader={<ListSubheader>Debugging</ListSubheader>}>
            <ListItem dense>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Debug JSON events" />
              <ListItemSecondaryAction>
                <Switch checked={debugEvents} value="debugEvents" onChange={this.handleSwitch('debugEvents')} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          <List disablePadding dense subheader={<ListSubheader>Display Settings</ListSubheader>}>
            <ListItem dense>
              <ListItemIcon>
                <WrapTextIcon />
              </ListItemIcon>
              <TextField label="Terminal Width" value={wrapWidth} onChange={this.handleValue('wrapWidth')} />
            </ListItem>
            
            <ListItem dense>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <TextField label="Background Color" value={ansiBG} onChange={this.handleValue('ansiBG')} />
            </ListItem>

            <ListItem dense>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <TextField label="Foreground Color" value={ansiFG} onChange={this.handleValue('ansiFG')} />
            </ListItem>
          </List>
          
          <List disablePadding dense subheader={<ListSubheader>@decompile/tf</ListSubheader>}>
            <ListItem dense>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Send @dec/tf to editor." />
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

          <List disablePadding dense subheader={<ListSubheader>Sidebar Display</ListSubheader>}>
            <ListItem dense>
              <ListItemIcon>
                <VerticalSplitIcon />
              </ListItemIcon>
              <ListItemText primary="Show sidebar?" />
              <ListItemSecondaryAction>
                <Switch checked={sidebarOpen} value="sidebarOpen" onChange={this.handleSwitch('sidebarOpen')} />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem dense disabled={!sidebarOpen}>
              <ListItemIcon>
                <PictureInPictureIcon />
              </ListItemIcon>
              <ListItemText primary="Sidebar on top?" />
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
            
            <ListItem dense>
              <ListItemIcon>
                <FormatIndentIncreaseIcon />
              </ListItemIcon>
              <TextField label="Sidebar Width" value={sidebarWidth} onChange={this.handleValue('sidebarWidth')} />
            </ListItem>
          </List>
          
          <List disablePadding dense subheader={<ListSubheader>Sidebar Content</ListSubheader>}>
            <ListItem dense>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Show players?" />
              <ListItemSecondaryAction>
                <Switch checked={sidebarShowPlayers} value="sidebarShowPlayers" onChange={this.handleSwitch('sidebarShowPlayers')} />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem dense>
              <ListItemIcon>
                <GroupWorkIcon />
              </ListItemIcon>
              <ListItemText primary="Show things?" />
              <ListItemSecondaryAction>
                <Switch checked={sidebarShowThings} value="sidebarShowThings" onChange={this.handleSwitch('sidebarShowThings')} />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem dense>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Show exits?" />
              <ListItemSecondaryAction>
                <Switch checked={sidebarShowExits} value="sidebarShowExits" onChange={this.handleSwitch('sidebarShowExits')} />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem dense disabled={!sidebarShowExits}>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Show compass?" />
              <ListItemSecondaryAction>
                <Switch disabled={!sidebarShowExits} checked={sidebarShowCompass} value="sidebarShowCompass" onChange={this.handleSwitch('sidebarShowCompass')} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
        <Button className={classes.close} onClick={closeDrawer}>
          Close
        </Button>
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

