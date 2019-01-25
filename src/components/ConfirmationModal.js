import PropTypes from 'prop-types';
import React from 'react';
import Modal from './Modal';

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onConfirmation: PropTypes.func.isRequired
};

export default function ConfirmationModal({ show, onHide, onConfirmation, children }) {
  return (
    <Modal
      show={show}
      dialogClassName="modal-alert"
      onHide={onHide}
      size="small"
    >
      <div className="modal-body">
        {children}
      </div>
      <div className="modal-footer">
        <button onClick={onHide} className="btn btn-default">Cancel</button>
        <button onClick={onConfirmation} className="btn btn-primary">OK</button>
      </div>
    </Modal>
  );
}
