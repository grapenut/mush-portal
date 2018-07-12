
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import FeedTab from './FeedTab';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "50%",
  },
  tab: {
  },
});


//////////////////////////////////////////////////////////////////////


class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      current: 0,
      feed: null,
      tablist: [],
      client: props.client,
    };
  }
  
  addTab(name, content) {
    var { tablist } = this.state;
    tablist.push({ name, content });
    this.setState({ tablist });
  }
  
  changeTab = (event, current) => {
    this.setState({ current });
  }

  componentDidMount() {
    this.state.client.react.feed = this;
  }

  render() {
    const { classes, theme, ids, client } = this.props;
    const { current, feed, tablist } = this.state;

    return (
      <div className={classes.frame}>
        <AppBar position="static">
          <Tabs id={ids.tabbar} value={current} onChange={this.changeTab}>
            <Tab label="Feed" />
            { tablist.map(tab => <Tab label={tab.name} />) }
          </Tabs>
        </AppBar>
        { current === 0 && <FeedTab id={ids.feed} variant="fixed"></FeedTab> }
        { tablist.map((tab, i) => { current === i+1 && <FeedTab>{tab.content}</FeedTab> }) }
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Feed);

