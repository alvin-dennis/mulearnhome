import { publicGateway } from "@/lib/fetcher";
import type { ExtendedTopLearner, Learner, LearnerResponse } from "../types/profile.types";
import { endpoints } from "./endpoints";

export const fetchTopLearners = async (limit: number = 10): Promise<ExtendedTopLearner[]> => {
  try {
    const res = await publicGateway.get(endpoints.profile.topLearners);
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
    const res = await publicGateway.get(`${endpoints.profile.profilePic}${muid}/`);
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
