import React from "react";
import styles from "./Olympus-event.module.css";

interface OlympusEventButtonProps {
  onClick?: () => void;
}

export default function OlympusEventButton({ onClick }: OlympusEventButtonProps) {
  return (
    <button
      className={`${styles.button} px-5 sm:px-6 text-sm sm:text-lg md:text-lg`}
      onClick={onClick}
    >
      <span>Explore Olympus</span>
      <div className={`${styles.topAnnotation} ${styles.hide}`}>
        <span className={styles.topLabel}>Flagship HR Experience</span>
      </div>
      <div className={`${styles.bottomAnnotation} ${styles.hide}`}>
        <span className={styles.bottomLabel}>Expert-Led Sessions</span>
      </div>
      <div className={`${styles.rightAnnotation} ${styles.hide}`}>
        <span className={styles.rightLabel}>Industry Practice</span>
      </div>
    </button>
  );
}
