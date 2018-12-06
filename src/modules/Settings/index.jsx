
import React from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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
import TextRotateVerticalIcon from '@material-ui/icons/TextRotateVertical';
import CodeIcon from '@material-ui/icons/Code';
import BorderLeftIcon from '@material-ui/icons/BorderLeft';
import BorderRightIcon from '@material-ui/icons/BorderRight';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExploreIcon from '@material-ui/icons/Explore';
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SecurityIcon from '@material-ui/icons/Security';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import HistoryIcon from '@material-ui/icons/History';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import RepeatIcon from '@material-ui/icons/Repeat';
import TimerIcon from '@material-ui/icons/Timer';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import SmsIcon from '@material-ui/icons/Sms';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import UpdateIcon from '@material-ui/icons/Update';
import ShortTextIcon from '@material-ui/icons/ShortText';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "relative",
    height: "100%",
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
      justifyContent: 'flex-end',
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
      expandAll: false,
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
      expandAll: false,
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
    const { expanded, expandAll, debugEvents, decompileEditor, decompileKey, ansiFG, ansiBG, mobileButtonbar,
      invertHighlight, debugActions, serverAddress, serverPort, serverSSL, sidebarLargeCompass, activitySize,
      historySize, historySpawnSize, mobileHideTaskbar, mobileHideStatusbar, allowServerChange, activityDelay,
      sidebarOpen, sidebarAnchor, sidebarAlwaysShow, sidebarShowPlayers, fontFamily, fontSize, activityReposition,
      recallButtons, recallAnchor, recallSize, mobileFontSize, terminalWidth, timersAutoStart, activityEnabled,
      sidebarShowThings, sidebarShowExits, sidebarShowCompass, sidebarDense, timersEnabled, terminalAutoScroll } = this.state;
    const isMobile = window.client.mobile;
   
    var debugging = (
      <List className={classes.list} disablePadding dense>
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
      <List className={classes.list} disablePadding dense>
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
      <List className={classes.list} disablePadding dense>
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
    
    var input = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <TextField label="Recall History Size" value={recallSize} onChange={this.handleValue('recallSize')} type="number" helperText="Commands in recall history." />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <RepeatIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show command history buttons?" />
          <ListItemSecondaryAction>
            <Switch checked={recallButtons} value="recallButtons" onChange={this.handleSwitch('recallButtons')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense className={classes.leftright}>
          <Icon color="action">
            <BorderLeftIcon />
          </Icon>
          <Typography>Left</Typography>
          <Switch checked={recallAnchor === "right"}
            color="default"
            value={recallAnchor === "right" ? "left" : "right"}
            onChange={this.handleValue('recallAnchor')}
          />
          <Typography>Right</Typography>
          <Icon color="action">
            <BorderRightIcon />
          </Icon>
        </ListItem>
      </List>
    );

    var terminal = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <WrapTextIcon />
          </ListItemIcon>
          <TextField label="Terminal Width" value={terminalWidth} onChange={this.handleValue('terminalWidth')} type="number" />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <TextRotateVerticalIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Scroll to bottom on command input?" />
          <ListItemSecondaryAction>
            <Switch checked={terminalAutoScroll} value="terminalAutoScroll" onChange={this.handleSwitch('terminalAutoScroll')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
        
    var font = (
      <List className={classes.list} disablePadding dense>
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
      <List className={classes.list} disablePadding dense>
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
      <List className={classes.list} disablePadding dense>
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
    
    var timers = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            {timersEnabled ? (<TimerIcon />) : (<TimerOffIcon />)}
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Enable timers?" />
          <ListItemSecondaryAction>
            <Switch checked={timersEnabled} value="timersEnabled" onChange={this.handleSwitch('timersEnabled')} />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem dense>
          <ListItemIcon>
            <AutorenewIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Auto-start timers on refresh?" />
          <ListItemSecondaryAction>
            <Switch checked={timersAutoStart} value="timersAutoStart" onChange={this.handleSwitch('timersAutoStart')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );

    var activity = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <SmsIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show spawn activity notification?" />
          <ListItemSecondaryAction>
            <Switch checked={activityEnabled} value="activityEnabled" onChange={this.handleSwitch('activityEnabled')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <SwapVertIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary={isMobile ? "Move notification to bottom?" : "Move notification to top?"} />
          <ListItemSecondaryAction>
            <Switch checked={activityReposition} value="activityReposition" onChange={this.handleSwitch('activityReposition')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <UpdateIcon />
          </ListItemIcon>
          <TextField label="Autoclose delay" value={activityDelay} onChange={this.handleValue('activityDelay')} type="number" />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <ShortTextIcon />
          </ListItemIcon>
          <TextField label="Preview size" value={activitySize} onChange={this.handleValue('activitySize')} type="number" />
        </ListItem>
      </List>
    );
    
    var sidebarDisplay = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <VerticalSplitIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show sidebar?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarOpen} value="sidebarOpen" onChange={this.handleSwitch('sidebarOpen')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense className={classes.leftright}>
          <Icon color="action">
            <BorderLeftIcon />
          </Icon>
          <Typography>Left</Typography>
          <Switch checked={sidebarAnchor === "right"}
            color="default"
            value={sidebarAnchor === "right" ? "left" : "right"}
            onChange={this.handleValue('sidebarAnchor')}
          />
          <Typography>Right</Typography>
          <Icon color="action">
            <BorderRightIcon />
          </Icon>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <PictureInPictureIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Keep panels off sidebar?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarAlwaysShow} value="sidebarAlwaysShow" onChange={this.handleSwitch('sidebarAlwaysShow')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <FormatIndentDecreaseIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Use small sidebar icons?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarDense} value="sidebarDense" onChange={this.handleSwitch('sidebarDense')} />
          </ListItemSecondaryAction>
        </ListItem>
        
      </List>
    );
    
    var sidebarContent = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show players?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarShowPlayers} value="sidebarShowPlayers" onChange={this.handleSwitch('sidebarShowPlayers')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <GroupWorkIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show things?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarShowThings} value="sidebarShowThings" onChange={this.handleSwitch('sidebarShowThings')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show exits?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarShowExits} value="sidebarShowExits" onChange={this.handleSwitch('sidebarShowExits')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show compass?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarShowCompass} value="sidebarShowCompass" onChange={this.handleSwitch('sidebarShowCompass')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show in, out, up, & down?" />
          <ListItemSecondaryAction>
            <Switch checked={sidebarLargeCompass} value="sidebarLargeCompass" onChange={this.handleSwitch('sidebarLargeCompass')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
    
    var mobile = (
      <List className={classes.list} disablePadding dense>
        <ListItem dense>
          <ListItemIcon>
            <FormatSizeIcon />
          </ListItemIcon>
          <TextField label="Terminal Font Size" value={mobileFontSize} onChange={this.handleValue('mobileFontSize')} type="number" />
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <MobileScreenShareIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Show buttons on bottom of terminal?" />
          <ListItemSecondaryAction>
            <Switch checked={mobileButtonbar} value="mobileButtonbar" onChange={this.handleSwitch('mobileButtonbar')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <MobileScreenShareIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Auto hide mobile taskbar when empty?" />
          <ListItemSecondaryAction>
            <Switch checked={mobileHideTaskbar} value="mobileHideTaskbar" onChange={this.handleSwitch('mobileHideTaskbar')} />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem dense>
          <ListItemIcon>
            <MobileScreenShareIcon />
          </ListItemIcon>
          <ListItemText className={classes.switchText} primary="Hide the status bar to save screen space?" />
          <ListItemSecondaryAction>
            <Switch checked={mobileHideStatusbar} value="mobileHideStatusbar" onChange={this.handleSwitch('mobileHideStatusbar')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
    
    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <div className={classes.content} tabIndex={0} role="button">
            <Grid>
              <ExpansionPanel className={classes.panel} expanded={false} onChange={() => this.setState({ expandAll: !this.state.expandAll })}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<UnfoldMoreIcon />}>
                  <Typography className={classes.summaryText}>{expandAll ? "Collapse All Categories" : "Expand All Categories"}</Typography>
                </ExpansionPanelSummary>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'connection'} onChange={this.handleExpand('connection')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Server Connection</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {connection}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'history'} onChange={this.handleExpand('history')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Output History</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {history}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'input'} onChange={this.handleExpand('input')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Command Recall</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {input}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'terminal'} onChange={this.handleExpand('terminal')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Terminal Display</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {terminal}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'font'} onChange={this.handleExpand('font')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Terminal Font</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {font}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'color'} onChange={this.handleExpand('color')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Default Colors</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {color}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'sidebarDisplay'} onChange={this.handleExpand('sidebarDisplay')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Sidebar Display</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {sidebarDisplay}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'sidebarContent'} onChange={this.handleExpand('sidebarContent')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Sidebar Content</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {sidebarContent}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'upload'} onChange={this.handleExpand('upload')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>@decompile/tf</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {upload}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'timers'} onChange={this.handleExpand('timers')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>User-defined Timers</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {timers}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'activity'} onChange={this.handleExpand('activity')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Activity Notifications</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {activity}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'debugging'} onChange={this.handleExpand('debugging')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Debugging Console</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {debugging}
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel className={classes.panel} expanded={expandAll || expanded === 'mobile'} onChange={this.handleExpand('mobile')}>
                <ExpansionPanelSummary classes={{ root: classes.noPadding }} expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.summaryText}>Mobile Display</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.noPadding }}>
                  {mobile}
                </ExpansionPanelDetails>
              </ExpansionPanel>
             </Grid>
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

