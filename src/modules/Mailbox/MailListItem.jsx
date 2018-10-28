
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
  listicon: {
    margin: 0,
  },
  read: {
    opacity: 0.5,
  },
  odd: {
    background: 'rgba(1, 0, 0, 0.1)',
  },
  even: {
  },
});


//////////////////////////////////////////////////////////////////////


class MailListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, mail, onOpen, quickDelete, handleMark, selected, key } = this.props;
    
    var icon;
    if (mail.deleted) {
      icon = (<DeleteIcon className={mail.unread ? null : classes.read} />);
    } else if (mail.unread) {
      if (mail.urgent) {
        icon = (<PriorityHighIcon />);
      } else {
        icon = (<MailIcon />);
      }
    } else {
      icon = (<DraftsIcon className={classes.read} />);
    }
    
    var even = (key % 2 === 0);

    return (
      <div className={classes.frame}>
        <ListItem
          key={mail.id}
          button
          dense
          divider
          selected={selected}
          onClick={quickDelete ? () => {} : onOpen}
          className={even ? classes.even : classes.odd}
        >
          <ListItemIcon className={classes.listicon}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={mail.subject}
            secondary={
              <span>
                <span>
                  {mail.from}
                </span><br />
                <span>
                  {mail.time}
                </span>
              </span>
            }
          />
          {quickDelete && (
            <ListItemSecondaryAction>
              <IconButton onClick={handleMark}>
                {mail.deleted ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    );
  }
}

MailListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  mail: PropTypes.object.isRequired,
  quickDelete: PropTypes.bool,
  onOpen: PropTypes.func,
  handleMark: PropTypes.func,
  selected: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(MailListItem);

