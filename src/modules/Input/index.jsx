
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    "background-color": theme.palette.primary.main,
    display: "flex",
  },
  text: {
    flex: 1,
//    "background-color": "black",
//    color: "silver",
    margin: "1px 0 0 0",
    border: "none",
    outline: "none",
    "vertical-align": "middle",
    padding: "0.25em",
    resize: "none",
    height: "1em",
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "16pt",
    [theme.breakpoints.up('md')]: {
      height: "3em",
    },
  },
});


//////////////////////////////////////////////////////////////////////


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.input = React.createRef();
  }
  
  componentDidMount() {
    window.client.react.input = this;
    window.client.initInput(this.input.current);
  }
  
  render() {
    const { classes, ansiFG, ansiBG } = this.props;
    const { fontFamily, fontSize } = window.client.settings;
    
    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? 16 : fontSize) + "pt",
    };
    
    return (
      <div className={classes.frame}>
        <textarea ref={this.input} className={classNames(classes.text, ansiFG, ansiBG)} style={font}  autoComplete="off" autoFocus={!window.client.mobile}></textarea>
      </div>
    );
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ansiFG: PropTypes.string.isRequired,
  ansiBG: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(Input);

