import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery } from "@tanstack/react-query";
import CategoryBanner from "./components/CategoryBanner/CategoryBanner";
import CategoryMenu from "@/features/products/components/CategoryMenu/CategoryMenu";
import ProductsList from "@/features/products/components/ProductsList/ProductsList";
import Pagination from "@/shared/components/Pagination/Pagination";
import { calculateTotalPages } from "@/shared/utils/pagination.utils";
import useProductRoute from "@/shared/hooks/useProductRoute";
import { productQueries } from "@/features/products/queries";
import { Category as CategoryType } from "@/features/products/types";

const PAGE_LIMIT = 20;

const Category: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const { goToProductDetails } = useProductRoute();

  const { data: categories } = useQuery(productQueries.categories());
  const currentCategory = selectedCategory ?? categories?.[0] ?? null;

  const { data, isLoading } = useQuery({
    ...productQueries.byCategory({
      category: currentCategory?.slug ?? "",
      page,
      limit: PAGE_LIMIT,
    }),
    enabled: currentCategory !== null,
  });

  const totalPages = data ? calculateTotalPages(data.total, PAGE_LIMIT) : 0;

  const onCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const onProductClick = (productId: number) => {
    goToProductDetails(productId);
  };

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
              {isLoading ? (
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
                      products={data?.products}
                      onProductClick={onProductClick}
                    />
                  </div>
                  {totalPages > 0 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
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
