
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Emulator from '../../client/emulator';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
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
});


//////////////////////////////////////////////////////////////////////


class Spawn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.output = React.createRef();
    this.emulator = null;
  }
  
  componentDidMount() {
    window.client.addSpawn(this);
    this.emulator = new Emulator(this.output.current);
  }
  
  componentWillUnmount() {
    window.client.delSpawn(this);
    this.emulator = null;
  }
  
  appendText(text) {
    this.emulator.appendText(text);
  }
  
  render() {
    const { classes } = this.props;
    const { fontFamily, fontSize } = window.client.settings;

    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? fontSize/2 : fontSize) + "pt",
    };

    //this.emulator && this.emulator.clear();
    //this.emulator && this.emulator.appendText();
    

    return (
      <div className={classes.frame}>
        <div ref={this.output} className={classNames(classes.wrap, ansiFG, ansiBG)} style={font}></div>
      </div>
    );
  }
}

Spawn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Spawn);

	