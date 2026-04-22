import axios from "axios";
import { clientEnv } from "@/lib/env/env.client";
import { profileRoutes } from "./urls";

export const fetchProfileImage = async (muid: string) => {
  try {
    const res = await axios.get(
      `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${profileRoutes.userProfile}${muid}/`,
    );
    const profilePic = res.data.response.profile_pic;

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
