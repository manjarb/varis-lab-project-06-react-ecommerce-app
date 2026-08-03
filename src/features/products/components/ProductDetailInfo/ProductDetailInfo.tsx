import React from "react";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import StarReview from "@/shared/components/StarReview/StarReview";
import Button from "@/shared/components/Button/Button";

interface ProductDetailInfoProps {
  title: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  discountPercentage: number | undefined;
  description: string;
  sku: string | undefined;
  stock: number;
  availabilityStatus: string;
  shippingInfo: string;
  warrantyInfo: string;
  onButtonClick: () => void;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  title,
  brand,
  rating,
  reviewsCount,
  price,
  originalPrice,
  discountPercentage,
  description,
  sku,
  stock,
  availabilityStatus,
  shippingInfo,
  warrantyInfo,
  onButtonClick,
}) => {
  return (
    <div>
      <h2 className="fs-32 mb-10">{title}</h2>
      <p className="fs-18 text-muted mb-20 mt-0">{brand}</p>
      <div className="flex align-item-center mb-20">
        <StarReview score={rating} />
        <span className="text-muted ml-5">{reviewsCount} Reviews</span>
      </div>
      <div className="flex align-item-center mb-20">
        <p className="fs-32 fw-medium mr-10">$ {price.toFixed(2)}</p>
        {originalPrice && (
          <span className="fs-14 text-muted text-line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {discountPercentage && (
          <span className="fs-18 fw-medium ml-10 text-primary">
            {discountPercentage}% Off
          </span>
        )}
      </div>
      <p className="text-muted">{description}</p>
      <div className="pt-25 pb-25">
        <Button icon={faCartPlus} onClick={onButtonClick}>
          Add To Cart
        </Button>
      </div>
      <div>
        <h4>Product Info:</h4>
        <ul className="pl-15 lh-1-75 mt-10">
          {sku && <li className="text-muted">SKU: {sku}</li>}
          <li className="text-muted">Quantity: {stock} left</li>
          {availabilityStatus && (
            <li className="text-muted">Stock Status: {availabilityStatus}</li>
          )}
        </ul>
      </div>
      <div>
        <h4>Delivery Details:</h4>
        <ul className="pl-15 lh-1-75 mt-10">
          <li className="text-muted">{shippingInfo}</li>
          <li className="text-muted">{warrantyInfo}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
