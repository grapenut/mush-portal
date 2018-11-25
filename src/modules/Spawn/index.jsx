
import React from 'react';
import classNames from 'classnames';
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
    margin: '0.25em 0.5em',
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
    this.emulator = new Emulator(this.output.current);
  }
  
  componentWillUnmount() {
    this.emulator = null;
  }
  
  appendText(text) {
    this.emulator.appendText(text);
  }
  
  append(text) {
    this.emulator.appendText(text+"\n");
  }
  
  render() {
    const { classes } = this.props;
    const { ansiFG, ansiBG, fontFamily, fontSize } = window.client.settings;

    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? fontSize/2 : fontSize) + "pt",
    };

    //this.emulator && this.emulator.clear();
    //this.emulator && this.emulator.appendText();
    

    return (
      <div className={classes.frame}>
        <div ref={this.output} className={classNames(classes.output, ansiFG, ansiBG)} style={font}></div>
      </div>
    );
  }
}

Spawn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  panel: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Spawn);

	