import styles from "./Card.module.css";
import { cardProps } from "@/lib/types";

const Card = ({
  name,
  image,
  link,
  description,
  largeImg,
  date,
}: cardProps) => {
  return (
    <a target="_blank" rel="rel noreferrer" href={link}>
      <div className={styles.card + " " + (largeImg && styles.largeImg)}>
        <div className={styles.card_image}>
          <img src={image} alt="domain images" className={styles.card_img} />
        </div>
        <p className={styles.card_heading}>{name}</p>
        <p className={styles.card_description}>{date}</p>
        <p className={styles.card_description}>{description}</p>

        {link !== "#" ? (
          <a target="_blank" rel="rel noreferrer" href={link}>
            <div className={styles.card_link}>
              <span className={styles.explore_more}>Explore More </span>
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                <path
                  d="M12.1711 3.983L2.12965 14.0245L0.47998 12.3748L10.5203 2.33333H1.67115V0H14.5045V12.8333H12.1711V3.983Z"
                  fill="#000738"
                />
              </svg>
            </div>
          </a>
        ) : (
          <span className={styles.explore_more}>Coming Soon!</span>
        )}
      </div>
    </a>
  );
};

export default Card;
