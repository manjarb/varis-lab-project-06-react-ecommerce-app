import React from "react";
import Button from "@/shared/components/Button/Button";
import Modal from "@/shared/components/Modal/Modal";

interface AddToCartModalContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToCartModalContent: React.FC<AddToCartModalContentProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal isOpen={isOpen} onRequestClose={onClose}>
    <div className="text-center">
      <h3 className="fs-20 fw-bold mb-10">Product Added to Cart</h3>
      <p className="mb-20">
        The product has been successfully added to your cart!
      </p>
      <div className="inline-block">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  </Modal>
);

export default AddToCartModalContent;
