
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

//import Icon from '@material-ui/core/Icon';
//import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';

//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';

//import MoreVertIcon from '@material-ui/icons/MoreVert';
//import ReplyIcon from '@material-ui/icons/Reply';
//import ForwardIcon from '@material-ui/icons/Forward';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  card: {
    height: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  header: {
    display: "flex",
    "flex-flow": "row nowrap",
  },
  sub: {
    display: "flex",
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: "3em",
  },
  body: {
    flex: 1,
    "overflow-y": "auto",
    "overflow-x": "hidden",
  },
  actions: {
    "justify-content": "space-evenly",
  },
  button: {
    display: "block",
  },
});


//////////////////////////////////////////////////////////////////////


class BBMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, message } = this.props;
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={message.subject}
          subheader={
            <span className={classes.sub}>
              <span className={classes.left}>
                {message.author}
              </span>
              <span className={classes.right}>
                {message.date}
              </span>
            </span>
          }
        />
        <CardContent className={classes.body}>
          <Typography component="span">
            <pre>{message.body}</pre>
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
        </CardActions>
      </Card>
    );
  }
}

BBMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(BBMessage);

