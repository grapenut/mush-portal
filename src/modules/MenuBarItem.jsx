
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  chip: {
  },
});


//////////////////////////////////////////////////////////////////////


class MenuBarItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  avatar = (a) => {
    return (
      <Avatar src={a.src}>{a.text}</Avatar>
    );
  };
  
  render() {
    const { classes, chip, onDelete, onClick } = this.props;
    
    return (
      <Chip
        className={classes.chip}
        label={chip.label}
        avatar={chip.avatar && this.avatar(chip.avatar)}
        onClick={onClick}
        onDelete={onDelete}
        component="a"
        href={chip.href}
        clickable
      />
    );
  }
}

MenuBarItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  chip: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(MenuBarItem);

