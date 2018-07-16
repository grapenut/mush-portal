
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { arrayMove } from 'react-sortable-hoc';
import Sortable from './Sortable';
import MenuBarItem from './MenuBarItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chips: [ ],
    };
    this.client = props.client;
  }
  
  componentDidMount() {
    this.client.react.menubar = this;
  }

  addMenuBarItem(obj) {
    var { chips } = this.state;
    chips.push(obj);
    this.setState({ chips });
  }
  
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      chips: arrayMove(this.state.chips, oldIndex, newIndex),
    });
  };
  
  onClick = (which) => {
    console.log("CLICK ", which);
  };
  
  onDelete = (which) => {
    console.log("DELETE ", which);
  };
  
  render() {
    const { classes } = this.props;
    const { chips } = this.state;
    
    return (
      <div className={classes.frame}>
        <Sortable
          items={chips.map((chip, index) => 
            <MenuBarItem
              index={index}
              chip={chip}
              onClick={this.onClick}
              onDelete={!chip.permanent && this.onDelete}
            />)}
          onSortEnd={this.onSortEnd}
        />
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuBar);

