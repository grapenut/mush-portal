
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

//import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CreateIcon from '@material-ui/icons/Create';

import BBMessageListItem from './BBMessageListItem';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    maxHeight: "100%",
    width: "100%",
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
  container: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    paddingLeft: theme.spacing.unit,
    "align-items": "center",
  },
  flex: {
    flex: 1,
  },
});


//////////////////////////////////////////////////////////////////////


class BBMessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
    };
  }
  
  sendBBPost = () => {
    window.client.react.bboard.sendBBPost(this.props.board.name, "", "");
  };

  render() {
    const { classes, openMessage, board } = this.props;
    
    return (
      <div className={classes.frame}>
        <div className={classes.header}>
          <Typography variant="subtitle1" className={classes.title}>
            <span className={classes.container}>
              {board.name} ({board.messages.length} Posts)
              <span className={classes.flex} />
              <Tooltip title="Go back to the board list.">
                <IconButton disabled={!Boolean(board)} onClick={() => window.client.react.bboard.setState({ board: null, bbmsg: null })}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Make a new BBoard post.">
                <IconButton onClick={this.sendBBPost}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
            </span>
          </Typography>
        </div>
        <div className={classes.overflow}>
          <List
            dense
            disablePadding
          >
            {board.messages.map((msg,i) => (
              <BBMessageListItem key={i} message={msg} onOpen={() => {
                this.setState({ selected: i });
                openMessage(i);
              }} />
            ))}
          </List>
        </div>
      </div>
    );
  }
}

BBMessageList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  openMessage: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBMessageList);

