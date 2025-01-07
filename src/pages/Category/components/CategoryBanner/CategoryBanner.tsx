import React from "react";

interface CategoryBannerProps {
  name?: string | null;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ name }) => {
  return (
    <div className="bg-grey01 pt-30 pb-30">
      <h2 className="fs-32 text-center">{name ? name : "Category"}</h2>
    </div>
  );
};

export default CategoryBanner;
