
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import BBList from './BBList';
import BBMessageList from './BBMessageList';
import BBMessage from './BBMessage';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    position: "relative",
    maxHeight: "100%",
    flex: 1,
  },
  right: {
    flex: 1,
    maxHeight: "100%",
    position: "relative",
  },
  full: {
    flex: 1,
    position: "relative",
    display: "flex",
  },
});


//////////////////////////////////////////////////////////////////////


class BBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bbmsg: null,
      board: null,
      boardlist: props.boardlist ? props.boardlist : [ ],
    };
  }
  
  openBB = (key) => {
    const { boardlist } = this.state;
    const board = boardlist[key];

    window.client.sendAPI("bbmsglist", board.id);
  };
  
  openBBMsg = (key) => {
    const { board } = this.state;
    const msg = board.messages[key];

    window.client.sendAPI("bbmsg", board.id+"="+msg.id);
  };
  
  componentDidMount() {
    window.client.react.bboard = this;
  }
  
  componentWillUnmount() {
    window.client.react.bboard = null;
  }
  
  updateBoardList(boardlist) {
    this.setState({ boardlist, board: null, bbmsg: null });
  }
  
  updateBoard(board) {
    this.setState({ board, bbmsg: null });
  }
  
  openMessage(bbmsg) {
    const { board } = this.state;
    board.messages.forEach((bb,i) => {
      if (bbmsg.id === bb.id) {
        bbmsg.key = i;
      }
    });
    this.setState({ bbmsg });
  }

  render() {
    const { classes } = this.props;
    const { boardlist, board, bbmsg } = this.state;

    return (
      <div className={classes.frame}>
        { board ? (
          <div className={classes.full}>
            <div className={classes.left}>
              <BBMessageList board={board} openMessage={this.openBBMsg} />
            </div>
            <div className={classes.right}>
              { bbmsg && (
                <BBMessage message={bbmsg} />
              )}
            </div>
          </div>
        ) : (
          <div className={classes.full}>
            <div className={classes.left}>
              <BBList boardlist={boardlist} openBoard={this.openBB} />
            </div>
            <div className={classes.right}></div>
          </div>
        )}
      </div>
    );
  }
}

BBoard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  folder: PropTypes.number,
  maillist: PropTypes.array,
  mailitem: PropTypes.object,
  unread: PropTypes.number,
};

export default withStyles(styles, { withTheme: true })(BBoard);

	