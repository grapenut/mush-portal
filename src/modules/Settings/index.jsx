
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
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import ColorPicker from './ColorPicker';

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
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SecurityIcon from '@material-ui/icons/Security';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import HistoryIcon from '@material-ui/icons/History';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-evenly',
    },
  },
  list: {
    flexGrow: 0,
    flexBasis: 'auto',
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
    flexFlow: "column-reverse nowrap",
    [theme.breakpoints.up('md')]: {
      flexFlow: "row nowrap",
    },
  },
  reset: {
    flex: 1,
  },
  close: {
    flex: 1,
  },
  leftright: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noPadding: {
    padding: 0,
  },
  summaryText: {
    marginLeft: theme.spacing.unit,
  },
  panel: {
    width: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    
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
  
  handleExpand = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
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
    const { expanded, debugEvents, decompileEditor, decompileKey, ansiFG, ansiBG, wrapWidth,
      invertHighlight, debugActions, serverAddress, serverPort, serverSSL,
      historySize, historySpawnSize, mobileAutoHide, allowServerChange,
      sidebarOpen, sidebarAnchor, sidebarAlwaysShow, sidebarShowPlayers, fontFamily, fontSize,
      sidebarShowThings, sidebarShowExits, sidebarShowCompass, sidebarWidth } = this.state;
    const isMobile = window.client.mobile;
   
    var debugging = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Debugging Console</ListSubheader>)}>
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
    );
    
    var connection = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Server Connection</ListSubheader>)}>
        <ListItem dense>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <TextField label="Server address" disabled={!allowServerChange} value={serverAddress} onChange={this.handleValue('serverAddress')} />
        </ListItem>
        <ListItem dense>
          <ListItemIcon>
            <SettingsEthernetIcon />
          </ListItemIcon>
          <TextField label="Server port" disabled={!allowServerChange} value={serverPort} onChange={this.handleValue('serverPort')} type="number" />
        </ListItem>
        <ListItem dense>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Encrypt connection with SSL?" />
          <ListItemSecondaryAction>
            <Switch checked={serverSSL} disabled={!allowServerChange} value="serverSSL" onChange={this.handleSwitch('serverSSL')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
    
    var history = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Output History</ListSubheader>)}>
        <ListItem dense>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <TextField label="History Size" value={historySize} onChange={this.handleValue('historySize')} type="number" helperText="Lines of terminal output history." />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <TextField label="Spawn History Size" value={historySpawnSize} onChange={this.handleValue('historySpawnSize')} type="number" helperText="Lines of spawn window history." />
        </ListItem>
      </List>
    );
    
    var display = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Display & Font</ListSubheader>)}>
        <ListItem dense>
          <ListItemIcon>
            <WrapTextIcon />
          </ListItemIcon>
          <TextField label="Terminal Width" value={wrapWidth} onChange={this.handleValue('wrapWidth')} type="number" />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <FontDownloadIcon />
          </ListItemIcon>
          <TextField label="Font" value={fontFamily} onChange={this.handleValue('fontFamily')} />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <FormatSizeIcon />
          </ListItemIcon>
          <TextField label="Size" value={fontSize} onChange={this.handleValue('fontSize')} type="number" />
        </ListItem>
      </List>
    );
    
    var color = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Default Colors</ListSubheader>)}>
        <ListItem dense>
          <ListItemIcon>
            <PaletteIcon />
          </ListItemIcon>
          <ColorPicker label="Background" value={ansiBG} onChange={this.handleColor('ansiBG')} background />
        </ListItem>

        <ListItem dense>
          <ListItemIcon>
            <PaletteIcon />
          </ListItemIcon>
          <ColorPicker label="Foreground" value={ansiFG} onChange={this.handleColor('ansiFG')} />
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
    );
    
    var upload = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>@decompile/tf</ListSubheader>)}>
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
    );
    
    var sidebarDisplay = (
      <List className={classes.list} disablePadding dense subheader={!isMobile && (<ListSubheader>Sidebar Display</ListSubheader>)}>
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
        
        <ListItem dense disabled={!sidebarOpen} className={classes.leftright}>
          <Icon color="action">
            <BorderLeftIcon />
          </Icon>
          <Typography>Left</Typography>
          <Switch checked={sidebarAnchor === "right"}
            color="default" disabled={!sidebarOpen}
            value={sidebarAnchor === "right" ? "left" : "right"}
            onChange={this.handleValue('sidebarAnchor')}
          />
          <Typography>Right</Typography>
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
    );
    
    var sidebarContent = (
      <List className={classes.list} disabled={!sidebarOpen} disablePadding dense subheader={!isMobile && (<ListSubheader>Sidebar Content</ListSubheader>)}>
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
    );
    
    var mobile = (
      <List className={classes.list} disabled={!isMobile} disablePadding dense subheader={!isMobile && (<ListSubheader>Mobile Only</ListSubheader>)}>
        <ListItem dense disabled={!isMobile}>
          <ListItemIcon>
            <MobileScreenShareIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Auto hide mobile taskbar when empty?" />
          <ListItemSecondaryAction>
            <Switch disabled={!isMobile} checked={mobileAutoHide} value="mobileAutoHide" onChange={this.handleSwitch('mobileAutoHide')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
    
    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <div className={classes.content} tabIndex={0} role="button">
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'debugging'} onChange={this.handleExpand('debugging')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Debugging Console</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {debugging}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{debugging}</span> )}
            
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'connection'} onChange={this.handleExpand('connection')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Server Connection</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {connection}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{connection}</span> )}

            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'history'} onChange={this.handleExpand('history')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Output History</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {history}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{history}</span> )}
            
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'display'} onChange={this.handleExpand('display')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Display & Font</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {display}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{display}</span> )}
              
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'color'} onChange={this.handleExpand('color')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Default Colors</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {color}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{color}</span> )}
            
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'upload'} onChange={this.handleExpand('upload')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>@decompile/tf</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {upload}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{upload}</span> )}

            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'sidebarDisplay'} onChange={this.handleExpand('sidebarDisplay')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Sidebar Display</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {sidebarDisplay}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{sidebarDisplay}</span> )}
            
            {isMobile ? (
              <ExpansionPanel disabled={!sidebarOpen} className={classes.panel} expanded={expanded === 'sidebarContent'} onChange={this.handleExpand('sidebarContent')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Sidebar Content</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {sidebarContent}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : ( <span>{sidebarContent}</span> )}
            
            {isMobile ? (
              <ExpansionPanel className={classes.panel} expanded={expanded === 'mobile'} onChange={this.handleExpand('mobile')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Mobile Only</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {mobile}
                </ExpansionPanelDetails>
              </ExpansionPanel>
             ) : ( <span>{mobile}</span> )}
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

