
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import MailListItem from './MailListItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    overflowY: "auto",
    maxHeight: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class MailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, openMail, maillist } = this.props;

    return (
      <div className={classes.frame}>
        <List
          dense
          disablePadding
          subheader={<ListSubheader component="div">Messages</ListSubheader>}
        >
          {maillist.map((mail,i) => (
            <MailListItem key={i} mail={mail} onOpen={() => openMail(i)} />
          ))}
        </List>
      </div>
    );
  }
}

MailList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  openMail: PropTypes.func,
  maillist: PropTypes.array,
};

export default withStyles(styles, { withTheme: true })(MailList);

