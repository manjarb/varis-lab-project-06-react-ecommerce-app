import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import StarReview from "@/shared/components/StarReview/StarReview";

interface ProductCardProps {
  productId: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number; // Rating out of 10
  reviewsCount: number;
  skeletonHeight?: number;
  onProductClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  originalPrice,
  discount,
  rating,
  reviewsCount,
  skeletonHeight = 240,
  productId,
  onProductClick,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className={`flex flex-column`}
      onClick={() => onProductClick(productId)}
    >
      <div className="image-container">
        {!isImageLoaded && <Skeleton height={skeletonHeight} />}
        <img
          src={image}
          alt={title}
          style={{
            display: isImageLoaded ? "block" : "none",
          }}
          onLoad={() => {
            setIsImageLoaded(true);
          }}
        />
      </div>

      <div className={`pt-15 pb-15`}>
        <h4 className="fs-18 mb-5 mt-0">{title}</h4>
        <p className="fs-14 text-muted mb-10 mt-0">{description}</p>
        <div className="flex align-item-center mb-15">
          <StarReview score={rating} />
          <span className="fs-12 text-muted ml-5">({reviewsCount})</span>
        </div>
        <p className="fs-20 mb-5">${price.toFixed(2)}</p>
        <div className="flex align-item-center">
          {originalPrice && (
            <span className="fs-14 text-muted text-line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <span className="fs-14 fw-medium ml-10 text-primary">
              {discount}% Off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
