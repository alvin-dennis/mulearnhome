import axios from "axios";
import { clientEnv } from "@/lib/env/env.client";
import type { Learner, TopLearner } from "@/lib/types";
import { leaderboardRoutes, profileRoutes } from "./urls";

interface ExtendedTopLearner extends TopLearner {
  email?: string;
  avatar?: string;
}

interface LearnerResponse extends Learner {
  muid?: string;
  profile_pic?: string;
}

export const fetchTopLearners = async (limit: number = 10): Promise<ExtendedTopLearner[]> => {
  try {
    const res = await axios.get(
      `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${leaderboardRoutes.topLearners}`,
    );
    const learners: Learner[] = Array.isArray(res.data.response) ? res.data.response : [];

    return learners.slice(0, limit).map((item) => ({
      name: item.full_name,
      kp: item.total_karma,
      email:
        (item as LearnerResponse).muid ||
        `${item.full_name.toLowerCase().replace(/\s+/g, "")}@mulearn`,
      avatar: (item as LearnerResponse).profile_pic || undefined,
    }));
  } catch (error) {
    console.error("Error fetching learners:", error);
    return [];
  }
};

export const fetchPublicProfileImage = async (muid: string) => {
  try {
    const res = await axios.get(
      `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${profileRoutes.profilePic}${muid}/`,
    );
    const profilePic = res.data.response.image;

    if (profilePic) {
      return profilePic;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
