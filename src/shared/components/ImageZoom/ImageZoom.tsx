import React from "react";
import styles from "./ImageZoom.module.scss";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className }) => {
  return (
    <div className={`${styles.imageContainer} ${className || ""}`}>
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
};

export default ImageZoom;
