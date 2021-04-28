import React from 'react';
import { Modal as ReactBootstrapModal } from 'react-bootstrap';

export default class Modal extends React.Component {
  render() {
    const { children, header, ...modalProps } = this.props;
    return (
      <ReactBootstrapModal {...modalProps}>
        <span
          data-submit-events-blocker
          onSubmit={ev => ev.stopPropagation()}
        >
          {header ? (
            <Layout header={header} onClose={modalProps.onHide}>
              {children}
            </Layout>
          ) : (
            children
          )}
        </span>
      </ReactBootstrapModal>
    );
  }
}

const Layout = (props) => {
  let className = 'modal-body'
  if (props.className) {
    className += ` ${props.className}`;
  }
  return (
    <>
      <div className="modal-header">
        {props.header && (
          <h4 className="modal-title">
            {props.header}
          </h4>
        )}
        <button
          onClick={props.onClose}
          type="button"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className={className}>
        {props.children}
      </div>
    </>
  );
};

Modal.Layout = Layout;
