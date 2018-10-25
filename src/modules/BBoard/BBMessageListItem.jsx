
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

//import IconButton from '@material-ui/core/IconButton';

//import MailIcon from '@material-ui/icons/Mail';
//import DraftsIcon from '@material-ui/icons/Drafts';
//import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
//import DeleteIcon from '@material-ui/icons/Delete';
//import CheckCircleIcon from '@material-ui/icons/CheckCircle';
//import CancelIcon from '@material-ui/icons/Cancel';

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


class BBMessageListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, message, onOpen } = this.props;
    
    return (
      <div className={classes.frame}>
        <ListItem
          key={message.id}
          button
          dense
          divider
          onClick={onOpen}
        >
          <ListItemText
            primary={message.subject}
            secondary={
              <span>
                <span>
                  {message.author}
                </span><br />
                <span>
                  {message.date}
                </span>
              </span>
            }
          />
        </ListItem>
      </div>
    );
  }
}

BBMessageListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBMessageListItem);

