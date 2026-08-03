import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ReviewSection from "./components/ReviewSection";
import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
import ProductImageGallery from "@/features/products/components/ProductImageGallery/ProductImageGallery";
import { calculateOriginalPrice } from "@/shared/utils/price.utils";
import ProductDetailInfo from "@/features/products/components/ProductDetailInfo/ProductDetailInfo";
import AddToCartModalContent from "@/features/cart/components/AddToCartModalContent/AddToCartModalContent";
import { useCart } from "@/features/cart/useCart";
import { productQueries } from "@/features/products/queries";
import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    data: productDetail,
    isLoading,
    isError,
  } = useQuery({
    ...productQueries.detail(id ?? ""),
    enabled: !!id,
  });
  const { addToCart } = useCart();

  const onOpenModal = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  const onAddToCart = () => {
    if (productDetail) {
      addToCart({
        id: productDetail.id,
        title: productDetail.title,
        price: productDetail.price,
        quantity: 1,
        image: productDetail.thumbnail,
        originalPrice: calculateOriginalPrice(
          productDetail.price,
          productDetail.discountPercentage,
        ),
      });
      onOpenModal();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mb-30">
        <ClipLoader
          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (isError || !productDetail) {
    return (
      <div className="container">
        <ErrorMessage message="We couldn't load this product. Please try again." />
      </div>
    );
  }

  const {
    title,
    images,
    description,
    brand,
    reviews,
    rating,
    price,
    discountPercentage,
    sku,
    stock,
    availabilityStatus,
    shippingInformation,
    warrantyInformation,
  } = productDetail;
  const originalPrice = calculateOriginalPrice(price, discountPercentage);

  return (
    <div>
      <CategoryBanner name={title} />
      <section className="pt-60">
        <div className="container">
          <div className="flex mb-35">
            <div className="width-50">
              <div className="pr-10">
                <ProductImageGallery images={images} />
              </div>
            </div>
            <div className="width-50">
              <div className="pl-10">
                <ProductDetailInfo
                  title={title}
                  brand={brand}
                  rating={rating}
                  reviewsCount={reviews.length}
                  price={price}
                  originalPrice={originalPrice}
                  discountPercentage={discountPercentage}
                  description={description}
                  sku={sku}
                  stock={stock}
                  availabilityStatus={availabilityStatus}
                  shippingInfo={shippingInformation}
                  warrantyInfo={warrantyInformation}
                  onButtonClick={onAddToCart}
                />
              </div>
            </div>
          </div>
          <div className="pb-30">
            <h3 className="fs-24">Reviews</h3>
            <ReviewSection rating={rating} reviews={reviews} />
          </div>
        </div>
      </section>

      <AddToCartModalContent isOpen={isModalOpen} onClose={onCloseModal} />
    </div>
  );
};

export default Product;
