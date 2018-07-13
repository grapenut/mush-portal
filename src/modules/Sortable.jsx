
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
  sortlist: {
    padding: 0,
    margin: 0,
  },
  sortitem: {
  },
});


const SortableItem = withStyles(styles, { withTheme: true })(SortableElement(({classes, children}) => {
  return (
    <li className={classes.sortitem}>
      {children}
    </li>
  );
}));

const SortableList = withStyles(styles, { withTheme: true })(SortableContainer(({classes, items}) => {
  return (
    <ul className={classes.sortlist}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index}>
          {value}
        </SortableItem>
      ))}
    </ul>
  );
}));


//////////////////////////////////////////////////////////////////////


class Sortable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { items, onSortEnd } = this.props;

    return (
      <SortableList items={items} onSortEnd={onSortEnd} />
    );
  }
}

Sortable.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Sortable);

