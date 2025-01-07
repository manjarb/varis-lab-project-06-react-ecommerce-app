import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/swiper-bundle.css";

const Banner: React.FC = () => {
  const banners = [
    {
      id: 1,
      image: "/images/banners/01.png",
      alt: "Banner 1",
    },
    {
      id: 2,
      image: "/images/banners/02.png",
      alt: "Banner 2",
    },
  ];

  return (
    <div className="banner-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img src={banner.image} alt={banner.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
