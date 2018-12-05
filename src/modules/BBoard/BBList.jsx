
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

//import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
//import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import CreateIcon from '@material-ui/icons/Create';

import BBListItem from './BBListItem';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "100%",
    height: "100%",
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


class BBList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  sendBBPost = () => {
    window.client.react.bboard.sendBBPost("", "", "");
  };

  render() {
    const { classes, openBoard, boardlist } = this.props;
    
    return (
      <div className={classes.frame}>
        <div className={classes.header}>
          <Typography variant="subtitle1" className={classes.title}>
            <span className={classes.container}>
              {boardlist.length} Bulletin Boards
              <span className={classes.flex} />
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
            {boardlist.map((board,i) => (
              <BBListItem key={i} board={board} onOpen={() => openBoard(i)} />
            ))}
          </List>
        </div>
      </div>
    );
  }
}

BBList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  openBoard: PropTypes.func.isRequired,
  boardlist: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBList);

