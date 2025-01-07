import React from "react";
import { Category } from "../../types/product.type";
import styles from "./CategoryMenu.module.scss";

interface CategoryMenuProps {
  categories: Category[];
  activeCategory: string | undefined;
  onCategoryClick: (category: Category) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  return (
    <div className={`${styles.categoryMenu} text-right`}>
      {categories.map((cat) => (
        <span
          key={cat.slug}
          className={`nav-link block mb-20 pointer ${
            activeCategory === cat.slug ? "fw-bold text-primary" : ""
          }`}
          onClick={() => onCategoryClick(cat)}
        >
          {cat.name}
        </span>
      ))}
    </div>
  );
};

export default CategoryMenu;
