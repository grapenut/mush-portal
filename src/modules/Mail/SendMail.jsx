
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import ForwardIcon from '@material-ui/icons/Forward';


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


class Mail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, mail } = this.props;
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={mail.subject}
          subheader={
            <span className={classes.sub}>
              <span className={classes.left}>
                {mail.from}
              </span>
              <span className={classes.right}>
                {mail.time}
              </span>
            </span>
          }
        />
        <CardContent className={classes.body}>
          <Typography>
            {mail.body}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button className={classes.button}>
            <Icon>
              <ReplyIcon />
            </Icon>
            Reply
          </Button>
          <Button className={classes.button}>
            <Icon>
              <ForwardIcon />
            </Icon>
            Forward
          </Button>
          <IconButton>
              <MoreVertIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

Mail.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  mail: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Mail);

