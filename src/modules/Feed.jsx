
import React from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import indigo from '@material-ui/core/colors/indigo';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import FeedTab from './FeedTab';
import FeedContent from './FeedContent';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    height: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  appbar: {
    "background-color": indigo[300],
    position: "relative",
  },
  tabbar: {
  },
  tab: {
  },
  wrapper: {
//    "flex-direction": "row",
  },
  scrollButton: {
    flex: 0,
  },
  selected: {
    "background-color": indigo[500],
  },
  expand: {
    height: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      current: 0,
      tablist: [],
    };
    this.client = props.client;
  }
  
  addTab(name, icon, content) {
    var { tablist } = this.state;
    tablist.push({ name, icon, content });
    this.setState({ tablist });
  }
  
  changeTab = (event, current) => {
    this.setState({ current });
    this.client.react.drawer.openDrawer();
  }
  
  focusTab(which) {
    const { tablist } = this.state;
    if (which === "Feed") {
      this.changeTab(null, 0);
      return;
    }
    for (var i = 0; i < tablist.length; i++) {
      if (tablist[i].name === which) {
        this.changeTab(null, i+1);
        return;
      }
    }
  }

  componentDidMount() {
    this.client.react.feed = this;
  }

  render() {
    const { classes, client } = this.props;
    const { current, tablist } = this.state;

    return (
      <div className={classes.frame}>
        <AppBar position="static" className={classes.appbar} color="primary">
          <Tabs
            value={current}
            className={classes.tabbar}
            classes={{ scrollButtons: classes.scrollButton }}
            onChange={this.changeTab}
            scrollable
            scrollButtons="on"
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab key="Feed" label="Feed" className={classes.tab} icon={<ViewQuiltIcon />} classes={{ wrapper: classes.wrapper, selected: classes.selected }} />
            { tablist.map(tab => <Tab key={tab.name} label={tab.name} className={classes.tab} icon={tab.icon} classes={{ wrapper: classes.wrapper, selected: classes.selected }} />) }
          </Tabs>
        </AppBar>
        {(current === 0) ? (
          <FeedTab client={client} />
        ) : (
          <FeedContent className={classes.expand} client={client}>
            {tablist[current-1].content}
          </FeedContent>
        )}
      </div>
    );
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ids: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Feed);

