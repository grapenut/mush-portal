
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
  odd: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  even: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});


//////////////////////////////////////////////////////////////////////


class BBListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, board, onOpen, id } = this.props;
    
    var even = (id %2 === 0);
    
    return (
      <div className={classes.frame}>
        <ListItem
          key={board.id}
          button
          dense
          divider
          onClick={onOpen}
          className={even ? classes.even : classes.odd}
        >
          <ListItemText
            primary={board.name}
            secondary={
              <span>
                <span>
                  {board.posts} Posts
                </span><br />
                <span>
                  {board.lastmod}
                </span>
              </span>
            }
          />
        </ListItem>
      </div>
    );
  }
}

BBListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBListItem);

