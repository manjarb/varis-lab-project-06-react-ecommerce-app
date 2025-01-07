import React from "react";
import StarReview from "../StarReview/StarReview";
import styles from "./ReviewCard.module.scss";

interface ReviewCardProps {
  name: string;
  date: string;
  review: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  date,
  review,
  rating,
}) => {
  return (
    <div className={`${styles.reviewCard} p-20 bg-grey05`}>
      <div className="flex align-item-center gap-15">
        {/* User Initial Avatar */}
        <div
          className={`${styles.avatar} flex-center fs-16 font-bold flex flex-center fs-40`}
        >
          <span className="fw-medium">{name[0]}</span>
        </div>

        <div>
          {/* User Information */}
          <div className="flex align-item-center mb-5">
            <span className="fw-bold fs-18 mr-5">{name}</span>
            <span className="text-muted fs-14">{date}</span>
          </div>

          {/* Rating */}
          <StarReview score={rating} />

          {/* Review Text */}
          <p className="fs-14 text-muted lh-1-5 mt-10">{review}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
