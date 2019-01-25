var PropTypes = require('prop-types');
var React = require('react');
import './spinner.scss';

Spinner.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.string,
  className: PropTypes.string
};

Spinner.defaultProps = {
  show: true,
  size: '',
  style: '',
  className: ''
};

export default function Spinner(props) {
  if (!props.show) {
    return <span/>;
  }
  return <span className={'loader ' + props.style + ' ' + props.size + ' ' + props.className}/>;
}
