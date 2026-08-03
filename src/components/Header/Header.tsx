import React from "react";
import { Link } from "react-router";
import CartSummary from "../CartSummary/CartSummary";
import useProductRoute from "../../hooks/useProductRoute/useProductRoute";

const Header: React.FC = () => {
  const { goToCartSummary } = useProductRoute();

  return (
    <header className="pt-25 pb-25">
      <div className="container">
        <div className="flex space-between align-item-center">
          <Link className="nav-link fw-bold fs-24" to="/">
            My Store
          </Link>

          <nav>
            <ul className="flex gap-20 m-0 p-0 list-none">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="nav-link">
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <CartSummary onIconClick={goToCartSummary} />
        </div>
      </div>
    </header>
  );
};

export default Header;
