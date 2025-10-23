"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./IGSection.module.css";
import { Button } from "@/components/ui/button";
import { useRedirectToApp } from "@/lib/utils";
import { cdnUrl } from "@/services/cdn";
import { IGSectionProps } from "@/lib/types";

const IGSection = ({
  cards,
  heading,
  largeImg,
}: IGSectionProps) => {
  const redirect = useRedirectToApp();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  
    useEffect(() => {
      setRefreshToken(localStorage.getItem("refreshToken"));
    }, []);
  return (
    <>
      <div className={styles.main_container}>
          <div className={styles.first_view_container}>
            <div className={styles.first_view}>
              <div className={styles.image_container}>
                <img
                  src={cdnUrl("src/modules/Public/KKEM/assets/IGS/fvimg.webp")}
                  alt="Learning Circles"
                  className={styles.fvimage}
                />
              </div>
              <div className={styles.fv_texts}>
                <p className={styles.fv_heading}>
                  Introducing Learning Circles
                </p>
                <p className={styles.fv_tagline}>
                  An informal mechanism for bringing together learners who are
                  interested in the same topic from across different fields and
                  disciplines. A fantastic way to spend a small amount of time
                  learning about new things with a group of people with same
                  interests!
                </p>
                <Button
                  variant={"mulearn"}
                  className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 sm:text-lg md:text-lg gap-1 hover:shadow-xl hover:scale-105 active:scale-95"
                  onClick={() =>
                    redirect?.(refreshToken ? "/dashboard/home" : "/register")
                  }
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>

        <div className={styles.explore_view_container}>
          <div className={styles.explore_view}>
            <p className={styles.ev_heading}>
              {heading ? heading : "Existing Interest Groups"}
            </p>
          </div>
        </div>

        <div className={styles.cards_view_container}>
          <div id="cards" className={styles.cards_view}>
            {cards.map((card) => (
              <Card
                {...card}
                key={card.name}
                link={card.link}
                largeImg={largeImg}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default IGSection;
