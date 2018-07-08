
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
      <div id={this.props.terminal}>
        <div id={this.props.output} className="ansi-37 ansi-40"></div>
        <div id={this.props.links} className="ansi-1-34 ansi-40"></div>
        <div id={this.props.prompt} className="ansi-37 ansi-40"></div>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Terminal);

