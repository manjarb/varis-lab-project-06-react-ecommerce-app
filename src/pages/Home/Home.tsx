import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  faTruck,
  faVolumeHigh,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClipLoader from "react-spinners/ClipLoader";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import useProducts from "../../hooks/useProducts/useProducts";
import ImageZoom from "../../components/ImageZoom/ImageZoom";
import { Category } from "../../types/product.type";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";
import { Category as CategoryType } from "../../types/product.type";
import ProductsList from "../../components/ProductsList/ProductsList";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import useProductRoute from "../../hooks/useProductRoute/useProductRoute";
import styles from "./Home.module.scss";
import Banner from "./components/Banner/Banner";

const Home: React.FC = () => {
  const productsListLimit = 12;
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(
    null,
  );
  const {
    fetchBestProducts,
    fetchProductsFromCategory,
    fetchCategories,
    isProductsFromCategoryLoading,
    bestProducts,
    categories,
    productsFromCategory,
  } = useProducts();
  const { goToProductDetails } = useProductRoute();

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Add 1 days

    return date.toISOString();
  }, []);

  const onCategoryClick = useCallback((category: Category) => {
    setCurrentCategory(category);
    fetchProductsFromCategory({
      category: category.slug,
      limit: productsListLimit,
    });
  }, []);

  const onProductClick = (productId: number) => {
    goToProductDetails(productId);
  };

  useEffect(() => {
    fetchBestProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories?.length) {
      setCurrentCategory(categories[0]);
      fetchProductsFromCategory({
        category: categories[0].slug,
        limit: productsListLimit,
      });
    }
  }, [categories]);

  return (
    <>
      <div className="container">
        <Banner />
        <section className={`${styles.featureCardBox} pt-35 flex`}>
          <FeatureCard
            icon={faTruck}
            title="Free Shipping"
            description="Free Shipping World Wide"
          />
          <FeatureCard
            icon={faClock}
            title="24 X 7 service"
            description="Online service for 24 X 7"
          />
          <FeatureCard
            icon={faVolumeHigh}
            title="Festival offer"
            description="New online special festival offer"
          />
          <FeatureCard
            icon={faCreditCard}
            title="Online payment"
            description="New online special festival offer"
          />
        </section>

        <section className="pt-55">
          <div className="flex align-item-center mb-20">
            <h2 className="fs-24 m-0 mr-15">
              <FontAwesomeIcon icon={faBolt} className="mr-5" /> DEALS OF THE
              DAY
            </h2>
            <CountdownTimer targetDate={targetDate} />
          </div>
          <div className="flex gap-25">
            {isProductsFromCategoryLoading ? (
              <div className="text-center">
                <ClipLoader
                  size={40}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <ProductsList
                products={bestProducts}
                onProductClick={onProductClick}
              />
            )}
          </div>
        </section>

        <section className="pt-65">
          <div className="flex gap-25">
            <div className={styles.mainDealBox}>
              <ImageZoom src="/images/deals/01.png" alt="deal 1" />
            </div>
            <div className={styles.secondDealBox}>
              <ImageZoom
                src="/images/deals/02.png"
                alt="deal 2"
                className="mb-20"
              />
              <ImageZoom src="/images/deals/03.png" alt="deal 3" />
            </div>
            <div className={styles.thirdDealBox}>
              <ImageZoom src="/images/deals/04.png" alt="deal 4" />
            </div>
          </div>
        </section>

        <section className="pt-65">
          <div className="flex gap-25">
            <CategoryMenu
              activeCategory={currentCategory?.slug}
              categories={categories || []}
              onCategoryClick={onCategoryClick}
            />
            <div className="category-list-container category-list-box">
              <ProductsList
                products={productsFromCategory?.products}
                onProductClick={onProductClick}
              />
            </div>
          </div>
        </section>

        <section className="pt-60 pb-30">
          <ImageZoom
            src="/images/banners/03.png"
            alt="banner long"
            className="mb-20 "
          />
        </section>
      </div>
    </>
  );
};

export default Home;
