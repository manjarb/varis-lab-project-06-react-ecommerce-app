import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReactModal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./Modal.module.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};
interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <button
        onClick={onRequestClose}
        className={styles.closeButton}
        aria-label="Close Modal"
      >
        <FontAwesomeIcon icon={faTimes} className="fs-20" />
      </button>
      <div>{children}</div>
    </ReactModal>
  );
};

export default Modal;
