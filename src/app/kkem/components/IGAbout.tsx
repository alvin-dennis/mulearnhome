"use client";

import styles from "./IGAbout.module.css";
import { cdnUrl } from "@/services/cdn";

export default function MulearnAbout() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.text}>
        <h1 className={styles.title}>Interest Groups?</h1>
        <p className={styles.description}>
          Discover your passion, collaborate with like-minded individuals, and
          embark on a transformative learning journey.
        </p>
        <p className={styles.description}>
          Join our vibrant community of students and explore a wide range of
          interest areas, from coding to design, entrepreneurship to data
          science
        </p>
      </div>

      <div className={styles.imgc}>
        <img
          className={styles.image}
          src={cdnUrl("src/modules/Public/KKEM/assets/astronaut.webp")}
          alt="Astronaut"
        />
        <p className={styles.dc2}>Curated by</p>
        <div className={styles.curated}>
          <img
            src={cdnUrl("src/modules/Public/KKEM/assets/im7.webp")}
            alt="Curator 1"
          />
          <img
            src={cdnUrl("src/modules/Public/KKEM/assets/im9.webp")}
            alt="Curator 2"
          />
          <img
            src={cdnUrl("src/modules/Public/KKEM/assets/im10.webp")}
            alt="Curator 3"
          />
          <p>and more...</p>
        </div>
      </div>
    </section>
  );
}
