import React from 'react';
import PropTypes from 'prop-types';

// /_*
//  _ Render a single item
//  _
//  _ @param {Object} props
//  */

function ListItem(props) {
  const { item } = props;
  return <li className="item">{item}</li>;
}

ListItem.propTypes = {
  item: PropTypes.string,
};

export default ListItem;
