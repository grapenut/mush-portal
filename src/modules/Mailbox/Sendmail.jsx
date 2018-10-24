
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  card: {
    position: "absolute",
    width: "100%",
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
  stretch: {
    width: "100%",
  },
  body: {
    flex: 1,
    display: "flex",
    "overflow-y": "auto",
    "overflow-x": "hidden",
  },
  bodytext: {
    width: "100%",
    flex: 1,
  },
  actions: {
    "justify-content": "space-evenly",
  },
  button: {
    display: "block",
  },
});


//////////////////////////////////////////////////////////////////////


class Sendmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to: props.to ? props.to : "",
      subject: props.subject ? props.subject : "",
      body: props.body ? props.body : "",
    };
  }

  setTarget(to) {
    this.setState({ to });
  }
  
  setSubject(subject) {
    this.setState({ subject });
  }
  
  setBody(body) {
    this.setState({ body });
  }

  setFields(to, subject, body) {
    this.setState({ to, subject, body });
  }
  
  sendMail = () => {
    const { to, subject, body } = this.state;
    var realsub = subject;
    
    if (!to || to === "") {
      alert("Invalid recipient.");
      return;
    }
    
    if (!body || body === "") {
      alert("Empty message.");
      return;
    }
    
    if (!subject || subject === "") {
      if (body.length > 20) {
        realsub = body.substr(0,20)+"...";
      } else {
        realsub = body;
      }
    }
    
    window.client.sendCommand("@mail "+to+"="+realsub+"/"+body);
    this.closePanel();
  };
  
  closePanel = () => {
    window.client.closePanel("Sendmail");
  };
  
  componentDidMount() {
    window.client.react.sendmail = this;
  }
  
  componentWillUnmount() {
    window.client.react.sendmail = null;
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  render() {
    const { classes } = this.props;
    const { to, subject, body } = this.state;
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={(
            <TextField id="sendmail-to" label="Recipient" value={to} onChange={this.handleChange("to")} className={classes.stretch} />
          )}
          subheader={(
            <TextField id="sendmail-subject" label="Subject" value={subject} onChange={this.handleChange("subject")} className={classes.stretch} />
          )}
        />
        <CardContent className={classes.body}>
          <textarea id="sendmail-body" className={classes.bodytext} value={body} onChange={this.handleChange("body")} />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button className={classes.button} onClick={this.sendMail}>
            <Icon>
              <SendIcon />
            </Icon>
            Send
          </Button>
          <Button className={classes.button} onClick={this.closePanel}>
            <Icon>
              <CancelIcon />
            </Icon>
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }
}

Sendmail.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  to: PropTypes.string,
  subject: PropTypes.string,
  body: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(Sendmail);

