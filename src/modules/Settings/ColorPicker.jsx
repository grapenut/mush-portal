
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  popover: {
    overflow: "hidden",
  },
  swatch: {
    cursor: "pointer",
    margin: 0,
    border: 0,
    padding: 0,
    height: "1em",
    width: "1em",
    lineHeight: "100%",
  },
  bgfix: {
    color: "transparent",
  },
});


//////////////////////////////////////////////////////////////////////


class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
      value: props.value,
    };

    var offset = props.background ? 40 : 30;
    this.rows = [];
    var colors = [];
    var i, j;
    
    for (i = 0; i < 8; i++) {
      colors.push("ansi-" + (i+offset));
    }
    
    for (i = 0; i < 8; i++) {
      colors.push("ansi-" + (i+offset) + "-1");
    }
    this.rows.push(colors);
    
    for (i = 1; i < 16; i++) {
      colors = [];
      for (j = 0; j < 16; j++) {
        colors.push("ansi-" + (8+offset) + "-5-" + (i*16+j));
      }
      this.rows.push(colors);
    }
  }
  
  show = event => {
    this.setState({ anchor: event.currentTarget });
  };
  
  hide = () => {
    this.setState({ anchor: null });
  };
  
  choose = (color) => (event) => {
    this.hide();
    this.setState({ value: color });
    this.props.onChange(color);
  };

  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, background, label } = this.props;
    const { anchor, value } = this.state;
    
    var bgfix;
    if (background) {
      bgfix = classes.bgfix;
    }
    
    return (
      <div>
        <Button aria-haspopup="true" aria-owns={anchor ? 'colorpicker' : null} onClick={this.show}>
          <div className={value}>
            {label}
          </div>
        </Button>
        
        <Popover className={classes.popover} id="colorpicker" anchorEl={anchor} open={Boolean(anchor)} onClose={this.hide}>
          {this.rows.map((colors, i) => (
            <div key={1000+i}>
              {colors.map((color, j) => (
                <span key={i*16+j} className={classNames(classes.swatch, bgfix, color)} onClick={this.choose(color)}>
                  {"\u2588"}
                </span>
              ))}
            </div>
          ))}
        </Popover>
      </div>
    );
  }
}

ColorPicker.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  background: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(ColorPicker);

