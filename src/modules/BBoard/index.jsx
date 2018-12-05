
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
  bblist: {
    flex: 1,
    position: "relative",
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  bbmsglist: {
    position: "relative",
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
  right: {
    flex: 1,
    maxHeight: "100%",
    position: "relative",
  },
  mobileClose: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  mobileOpen: {
    flex: 1,
    display: 'flex',
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
  
  sendBBPost(to, subject, body) {
    if (window.client.react.bbpost) {
      window.client.focusPanel("BBPost");
      if (window.confirm("Replace current draft with new mail?")) {
        window.client.react.bbpost.setFields(to, subject, body);
      }
    } else {
      window.client.addPanel("BBPost", { icon: "forums" });
      window.client.react.bbpost.setFields(to, subject, body);
    }  
  }

  

/////////////////////////////////////////////////////////


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
        <span className={bbmsg ? classes.mobileClose : classes.mobileOpen}>
          {board ? (
            <div className={classes.bbmsglist}>
              <BBMessageList board={board} openMessage={this.openBBMsg} />
            </div>
          ) : (
            <div className={classes.bblist}>
              <BBList boardlist={boardlist} openBoard={this.openBB} />
            </div>
          )}
        </span>
        {bbmsg && (
          <div className={classes.right}>
            <BBMessage message={bbmsg} />
          </div>
        )}
      </div>
    );
  }
}

BBoard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  bblist: PropTypes.array,
  bbmessagelist: PropTypes.array,
  bbmessage: PropTypes.object,
  unread: PropTypes.number,
};

export default withStyles(styles, { withTheme: true })(BBoard);

	