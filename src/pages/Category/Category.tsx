import React, { useCallback, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import useProducts from "../../hooks/useProducts/useProducts";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";
import { Category as CategoryType } from "../../types/product.type";
import ProductsList from "../../components/ProductsList/ProductsList";
import Pagination from "../../components/Pagination/Pagination";
import { calculateTotalPages } from "../../utils/pagination.utils";
import useProductRoute from "../../hooks/useProductRoute/useProductRoute";
import CategoryBanner from "./components/CategoryBanner/CategoryBanner";

const Category: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(
    null,
  );
  const {
    fetchCategories,
    fetchProductsFromCategory,
    onUpdatePage,
    categories,
    productsFromCategory,
    pagination,
    page,
    defaultLimit,
    isProductsFromCategoryLoading,
  } = useProducts();
  const { goToProductDetails } = useProductRoute();

  const onCategoryClick = useCallback((category: CategoryType) => {
    setCurrentCategory(category);
    onUpdatePage(1);
    fetchProductsFromCategory({ category: category.slug, page: 1 });
  }, []);

  const handlePageChange = (page: number) => {
    onUpdatePage(page);
    if (currentCategory) {
      fetchProductsFromCategory({
        category: currentCategory?.slug,
        page,
      });
    }
  };

  const onProductClick = (productId: number) => {
    goToProductDetails(productId);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories?.length) {
      setCurrentCategory(categories[0]);
      fetchProductsFromCategory({
        category: categories[0].slug,
      });
    }
  }, [categories]);

  return (
    <>
      <CategoryBanner name={currentCategory?.name} />
      <div className="container pt-60 pb-60">
        <section>
          <div className="flex gap-25">
            <CategoryMenu
              activeCategory={currentCategory?.slug}
              categories={categories || []}
              onCategoryClick={onCategoryClick}
            />
            <div className="category-list-container">
              {isProductsFromCategoryLoading ? (
                <div className="text-center">
                  <ClipLoader
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <>
                  <div className="category-list-box mb-30">
                    <ProductsList
                      products={productsFromCategory?.products}
                      onProductClick={onProductClick}
                    />
                  </div>
                  {pagination && (
                    <Pagination
                      currentPage={page}
                      totalPages={calculateTotalPages(
                        pagination?.total,
                        defaultLimit,
                      )}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Category;
