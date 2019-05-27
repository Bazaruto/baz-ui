import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

WithTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  placement: PropTypes.string,
  className: PropTypes.string
};

WithTooltip.defaultProps = {
  placement: 'bottom',
};

export default function WithTooltip(props) {
  if (!props.tooltip) {
    return props.children;
  }

  const tooltip = (
    <Tooltip id={props.id} className={props.className}>
      {props.tooltip}
    </Tooltip>
  );

  return (
    <OverlayTrigger overlay={tooltip} placement={props.placement}>
      {props.children}
    </OverlayTrigger>
  );
}
