import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
  icon: IconDefinition;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className={`${styles.featureCard} flex p-20`}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <h4 className="mt-0 mb-10 fs-18">{title}</h4>
        <p className="m-0 fs-14 fw-light">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
