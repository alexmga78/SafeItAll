import { Modal } from "react-bootstrap";
import { ReactNode } from "react";

interface PopupProps {
  show: boolean;
  handleClose: () => void;
  children: ReactNode;
}

export default function Popup({ show, handleClose, children }: PopupProps) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Fill the Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
			{children}
      </Modal.Body>
    </Modal>
  );
}