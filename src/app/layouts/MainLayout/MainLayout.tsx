import React from "react";
import { Outlet } from "react-router";
import styles from "./MainLayout.module.scss";
import Header from "@/shared/components/Header/Header";
import Footer from "@/shared/components/Footer/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
