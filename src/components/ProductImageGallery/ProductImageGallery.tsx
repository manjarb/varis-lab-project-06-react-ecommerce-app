import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./ProductImageGallery.module.scss";

interface ProductImageGalleryProps {
  images: string[];
  defaultImage?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  defaultImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    defaultImage || images[0]
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageClick = (image: string) => {
    setIsImageLoaded(false);
    setSelectedImage(image);
  };

  return (
    <div className={styles.productImageGallery}>
      {/* Large Displayed Image */}
      <div className="width-full text-center">
        {!isImageLoaded && (
          <div className="mb-30">
            <Skeleton height={400} />
          </div>
        )}
        <img
          src={selectedImage}
          alt="Selected image"
          style={{
            display: isImageLoaded ? "inline-block" : "none",
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      {/* Image Thumbnails */}
      <div className={styles.thumbnailList}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.thumbnail} ${
              selectedImage === image ? styles.active : ""
            }`}
            onClick={() => handleImageClick(image)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
