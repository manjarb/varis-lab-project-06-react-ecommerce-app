import React from "react";
import { ProductReview } from "../../../types/product.type";
import StarReview from "../../../components/StarReview/StarReview";
import RatingBreakdown from "../../../components/RatingBreakdown/RatingBreakdown";
import ReviewCard from "../../../components/ReviewCard/ReviewCard";

interface ReviewSectionProps {
  rating: number;
  reviews: ProductReview[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ rating, reviews }) => {
  return (
    <div className="flex">
      <div className="width-50">
        <div className="pr-40">
          <div className="flex pt-15">
            <span className="fs-40 fw-bold">{rating}</span>
            <div className="ml-15">
              <div className="mb-10">
                <StarReview score={rating} />
              </div>
              <p className="text-muted">Based on {reviews.length} Reviews</p>
            </div>
          </div>
          <hr className="my-20" />
          <RatingBreakdown reviews={reviews} />
        </div>
      </div>
      <div className="width-50">
        {reviews.map(({ reviewerName, date, comment, rating }, index) => (
          <div key={index} className="mb-15">
            <ReviewCard
              name={reviewerName}
              date={date}
              review={comment}
              rating={rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
