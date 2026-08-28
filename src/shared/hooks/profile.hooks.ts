import { useQuery } from "@tanstack/react-query";
import { fetchPublicProfileImage, fetchTopLearners } from "../api/profile.api";

export const profileKeys = {
  all: ["profile"] as const,
  topLearners: (limit: number) => [...profileKeys.all, "top-learners", limit] as const,
  image: (muid: string) => [...profileKeys.all, "image", muid] as const,
};

export function useTopLearners(limit: number = 10) {
  return useQuery({
    queryKey: profileKeys.topLearners(limit),
    queryFn: () => fetchTopLearners(limit),
  });
}

export function useProfileImage(muid: string | undefined) {
  return useQuery({
    queryKey: profileKeys.image(muid ?? ""),
    queryFn: () => fetchPublicProfileImage(muid as string),
    enabled: Boolean(muid),
  });
}
