import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import styles from "./StarReview.module.scss";

interface StarReviewProps {
  score: number; // Score between 0 and 10
}

const StarReview: React.FC<StarReviewProps> = ({ score }) => {
  const stars = Math.round(score / 2);
  const fiveStars = [...Array(5)];

  return (
    <div className={`${styles.starReview} flex fs-16`}>
      {fiveStars.map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < stars ? solidStar : regularStar}
          className={styles.star}
        />
      ))}
    </div>
  );
};

export default StarReview;
