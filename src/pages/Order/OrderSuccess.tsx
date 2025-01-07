import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const OrderSuccess: React.FC = () => {
  return (
    <div>
      <div className="bg-grey01 pt-45 pb-45 text-center">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="fs-72 text-primary mb-20"
        />
        <h2 className="fs-28 mb-15 text-uppercase fw-bold">
          Order Placed Successfully!
        </h2>
        <p className="fs-18 text-muted">
          Your order has been successfully placed and is on its way.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
