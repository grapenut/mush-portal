
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import IconButton from '@material-ui/core/IconButton';

import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';


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
});


//////////////////////////////////////////////////////////////////////


class MailListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, mail, onOpen } = this.props;

    return (
      <div className={classes.frame}>
        <ListItem
          key={mail.id}
          button
          dense
          divider
          onClick={onOpen}
        >
          <ListItemIcon className={classes.listicon}>
            {mail.unread ? (
              mail.urgent ? (
                  <PriorityHighIcon />
              ) : (
                  <MailIcon />
              )
            ) : (
              <DraftsIcon className={classes.read} />
            )}
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
        </ListItem>
      </div>
    );
  }
}

MailListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  mail: PropTypes.object.isRequired,
  onOpen: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(MailListItem);

