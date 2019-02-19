import React from 'react';
import { Modal as ReactBootstrapModal } from 'react-bootstrap';

export default class Modal extends React.Component {
  handleClick = e => e.stopPropagation();

  render() {
    const { children, header, ...modalProps } = this.props;
    return (
      <span onClick={this.handleClick}>
        <ReactBootstrapModal {...modalProps}>
          {header ? (
            <Layout header={header} onClose={modalProps.onHide}>
              {children}
            </Layout>
          ) : (
            children
          )}
        </ReactBootstrapModal>
      </span>
    );
  }
}

const Layout = (props) => {
  let className = 'modal-padded-content margin-bottom'
  if (props.className) {
    className += ` ${props.className}`;
  }
  return (
    <div>
      <div className="modal-header">
        {props.header}
        <button
          onClick={props.onClose}
          type="button"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className={className}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

Modal.Layout = Layout;
