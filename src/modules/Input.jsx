
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
    "background-color": "black",
    color: "silver",
    margin: "1px 0 0 0",
    border: "none",
    outline: "none",
    "vertical-align": "middle",
    padding: "0.25em",
    resize: "none",
    height: "3em",
  },
});


//////////////////////////////////////////////////////////////////////


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
    };
  }
  
  componentDidMount() {
    this.state.client.react.input = this;
  }
  
  render() {
    const { classes, theme, id, client } = this.props;
    
    return (
      <div className={classes.frame}>
        <textarea id={id} className={classes.text}  autoComplete="off" autoFocus></textarea>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Input);

