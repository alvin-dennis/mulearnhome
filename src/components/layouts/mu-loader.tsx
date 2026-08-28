import { MuImage } from "@/components/layouts";

export function MuLoader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <MuImage
        src="/assets/loader/MuLoader.gif"
        alt="Loader"
        height={400}
        width={400}
        unoptimized
      />
    </div>
  );
}
