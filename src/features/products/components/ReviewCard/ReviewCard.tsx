import React from "react";
import dayjs from "dayjs";

import styles from "./ReviewCard.module.scss";
import StarReview from "@/shared/components/StarReview/StarReview";

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
        <div className={`${styles.avatar} flex-center font-bold flex fs-40`}>
          {name[0]}
        </div>

        <div>
          {/* User Information */}
          <div className="flex align-item-center mb-5">
            <span className="fw-bold fs-18 mr-5">{name}</span>
            <span className="text-muted fs-14">
              {dayjs(date).format("DD MMMM YYYY")}
            </span>
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
