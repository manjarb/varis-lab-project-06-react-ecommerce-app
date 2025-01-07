import React from "react";
import { Product } from "../../types/product.type";
import ProductCard from "../ProductCard/ProductCard";
import { calculateOriginalPrice } from "../../utils/price.utlls";

interface ProductsListProps {
  products: Product[] | undefined;
  onProductClick: (id: number) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onProductClick,
}) => {
  return (
    <>
      {products?.map(
        ({
          thumbnail,
          id,
          title,
          brand,
          price,
          discountPercentage,
          rating,
          reviews,
        }) => (
          <div key={id} className="mb-15 pointer">
            <ProductCard
              productId={id}
              image={thumbnail}
              title={title}
              description={brand}
              price={price}
              originalPrice={calculateOriginalPrice(price, discountPercentage)}
              discount={discountPercentage}
              rating={rating}
              reviewsCount={reviews.length}
              onProductClick={onProductClick}
            />
          </div>
        )
      )}
    </>
  );
};

export default ProductsList;
