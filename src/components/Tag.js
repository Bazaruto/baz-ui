import PropTypes from 'prop-types';
import React, { Fragment, Component } from 'react';

Tag.propTypes = {
  label: PropTypes.node.isRequired,
  onRemove: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  colour: PropTypes.string,
  type: PropTypes.string,
};

Tag.defaultProps = {
  type: 'default',
  colour: 'grey',
};

export default function Tag(props) {
  let className = `${props.type}-tag group`;
  if (props.colour) {
    className += ` ${props.colour}`;
  }

  return (
    <div className={className}>
      {props.onRemove
        ? <RemovableTagContent label={props.label} value={props.value} onRemove={props.onRemove} />
        : <div>{props.label}</div>
      }
    </div>
  );
}

class RemovableTagContent extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]).isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  handleRemove = () => {
    this.props.onRemove(this.props.value);
  };

  render() {
    return (
      <Fragment>
        <div className="box_l">{this.props.label}</div>
        <div className="box_r">
          <button onClick={this.handleRemove} className="btn btn-sm blank-button">
            <span className="glyphicon glyphicon glyphicon-remove"></span>
          </button>
        </div>
      </Fragment>
    );
  }
}
