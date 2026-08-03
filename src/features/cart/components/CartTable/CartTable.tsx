import React from "react";
import { useCart } from "@/features/cart/useCart";

interface CartTableProps {
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const { cart } = useCart();

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td>
                <button
                  className="table-actions pointer"
                  onClick={() => onRemoveItem(item.id)}
                >
                  ×
                </button>
              </td>
              <td>
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="table-image"
                />
              </td>
              <td>{item.title}</td>
              <td>
                <span className="fw-bold mr-5 fs-18">
                  ${item.price.toFixed(2)}
                </span>
                {item.originalPrice && (
                  <>
                    <span className="table-original-price">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                    <br />
                    <span className="table-discount mt-5 inline-block fw-bold">
                      You Save: ${(item.originalPrice - item.price).toFixed(2)}
                    </span>
                  </>
                )}
              </td>
              <td>
                <div className="table-quantity">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    &lt;
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    &gt;
                  </button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
