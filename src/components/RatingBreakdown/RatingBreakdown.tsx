import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./RatingBreakdown.module.scss";

interface RatingBreakdownProps {
  reviews: { rating: number }[]; // Only need the `rating` property
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ reviews }) => {
  const totalReviews = reviews.length;

  // Compute counts for each rating (1-5 stars)
  const ratingCounts = Array(5)
    .fill(0)
    .map((_, index) => {
      const stars = 5 - index; // Descending from 5 to 1
      const count = reviews.filter(
        (review) => Math.round(review.rating / 2) === stars
      ).length;

      const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
      return { stars, count, percentage };
    });

  // Helper function to determine bar style class based on stars
  const getBarStyleClass = (stars: number) => {
    switch (stars) {
      case 5:
      case 4:
        return styles.greenBar; // Class for green
      case 3:
        return styles.orangeBar; // Class for orange
      case 2:
      case 1:
        return styles.redBar; // Class for red
      default:
        return styles.defaultBar; // Default class
    }
  };

  return (
    <div>
      {ratingCounts.map(({ stars, count, percentage }) => (
        <div key={stars} className="flex align-item-center gap-15 mb-10">
          <div className="fw-bold flex align-item-center gap-5">
            <span>{stars}</span>
            <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
          </div>
          <div className={styles.bar}>
            <div
              className={`${styles.fill} ${getBarStyleClass(stars)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-muted">{count}</div>
        </div>
      ))}
    </div>
  );
};

export default RatingBreakdown;
