
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class Menubar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
    };
  }
  
  componentDidMount() {
    this.state.client.react.menubar = this;
  }
  
  render() {
    const { classes, theme, client } = this.props;
    
    return (
      <div className={classes.frame}>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Menubar);

