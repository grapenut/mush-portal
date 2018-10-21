
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import MailListItem from './MailListItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    maxHeight: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  header: {
  },
  title: {
  },
  overflow: {
    overflowY: "auto",
    flex: 1,
  },
});


//////////////////////////////////////////////////////////////////////


class MailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, openMail, maillist, unread } = this.props;

    return (
      <div className={classes.frame}>
        <div className={classes.header}>
          <Typography variant="subheading" className={classes.title}>
            {maillist.length} Messages ({unread} unread)
          </Typography>
        </div>
        <div className={classes.overflow}>
          <List
            dense
            disablePadding
          >
            {maillist.map((mail,i) => (
              <MailListItem key={i} mail={mail} onOpen={() => openMail(i)} />
            ))}
          </List>
        </div>
      </div>
    );
  }
}

MailList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  openMail: PropTypes.func,
  maillist: PropTypes.array,
  unread: PropTypes.number.isRequired,
};

export default withStyles(styles, { withTheme: true })(MailList);

