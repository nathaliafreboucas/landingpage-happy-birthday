import Image from "next/image";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { wrapper: string; sizes: string }> = {
  sm: { wrapper: "w-20 h-20 sm:w-24 sm:h-24", sizes: "(max-width: 640px) 80px, 96px" },
  md: { wrapper: "w-28 h-28 sm:w-32 sm:h-32", sizes: "(max-width: 640px) 112px, 128px" },
  lg: { wrapper: "w-32 h-32 sm:w-40 sm:h-40", sizes: "(max-width: 640px) 128px, 160px" },
};

export default function HelenaSticker({
  src,
  size = "md",
  rotate = 0,
  delay = "0s",
  priority = false,
}: {
  src: string;
  size?: Size;
  rotate?: number;
  delay?: string;
  priority?: boolean;
}) {
  const { wrapper, sizes } = sizeMap[size];


  return (
    <div
      className="pointer-events-none select-none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className={`relative ${wrapper} rounded-full overflow-hidden border-[3px] border-white animate-float`}
        style={{
          animationDelay: delay,
          boxShadow:
            "0 8px 24px rgba(35,77,64,0.25), 0 2px 8px rgba(35,77,64,0.12), 0 0 0 1px rgba(200,186,168,0.3)",
        }}
      >
        <Image src={src} alt="Helena 🎉" fill className="object-cover" sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}
