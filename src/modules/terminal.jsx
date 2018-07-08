
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
});


//////////////////////////////////////////////////////////////////////


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, theme } = this.props;
    
    return (
      <div id={this.props.wrapper}>
        <div id={this.props.output} class="ansi-37 ansi-40"></div>
        <div id={this.props.links} class="ansi-1-34 ansi-40">
          <a onClick='sendCommand("who");'>WHO</a>
          <a onClick='sendCommand("look");'>LOOK</a>
          <a onClick='sendCommand("inventory");'>INVENTORY</a>
          <a onClick='sendCommand("@mail");'>MAIL</a>
          <a onClick='sendCommand("+bb");'>BBOARD</a>
          <a onClick='sendCommand("home");'>HOME</a>
          <a onClick="output.clear(); cmdprompt.clear();">CLEAR OUTPUT</a></div>
        <div id={this.props.prompt} class="ansi-37 ansi-40"></div>
        <textarea id="input" autocomplete="off" autofocus></textarea>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Terminal);

