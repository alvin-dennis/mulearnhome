import React from "react";
import Image, { ImageProps } from "next/image";

/**
 * MuImage: A wrapper for Next.js Image that ensures aspect ratio is preserved.
 * If only width or height is set, sets the other to 'auto' via style prop.
 */
const MuImage = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { width, height, style, ...rest } = props;
  const newStyle = { ...style } as React.CSSProperties;

  // grab className early so we can detect Tailwind tokens before deciding
  // whether to set pixel inline styles below.
  const className = (rest as any)?.className as string | undefined;

  // Preserve aspect ratio when either dimension is modified via props or CSS.
  // If the component receives a width but not a height, set height to auto.
  // If it receives a height but not a width, set width to auto.
  if (width && !height) {
    newStyle.height = newStyle.height ?? "auto";
  } else if (height && !width) {
    newStyle.width = newStyle.width ?? "auto";
  }

  // If the caller provided an explicit style that changes one dimension
  // (e.g. `style={{ height: 'auto' }}`), ensure the complementary
  // dimension is set to 'auto' when a numeric prop exists. This handles
  // cases like the Navbar logo where both width/height props are provided
  // but style overrides one side.
  const incomingStyle = style as React.CSSProperties | undefined;
  if (incomingStyle) {
    if (incomingStyle.height != null && width) {
      newStyle.width = newStyle.width ?? "auto";
    }
    if (incomingStyle.width != null && height) {
      newStyle.height = newStyle.height ?? "auto";
    }
  }

  // detect tailwind tokens if className present
  let hasH = false;
  let hasW = false;
  try {
    if (className) {
      const tokens = className.split(/\s+/);
      hasH = tokens.some((t) => t.startsWith("h-"));
      hasW = tokens.some((t) => t.startsWith("w-"));
    }
  } catch (e) {
    /* ignore */
  }

  // Decide whether CSS (incoming style or className) modifies width/height
  const cssModifiesHeight = !!(incomingStyle && incomingStyle.height != null) || hasH;
  const cssModifiesWidth = !!(incomingStyle && incomingStyle.width != null) || hasW;

  // If both numeric width and height are provided, handle three cases:
  // 1) CSS modifies height -> set complementary width to 'auto'
  // 2) CSS modifies width -> set complementary height to 'auto'
  // 3) CSS modifies neither -> set inline pixel styles to preserve exact sizing
  const isWidthNumber = typeof width === "number";
  const isHeightNumber = typeof height === "number";
  if (width && height) {
    if (cssModifiesHeight && cssModifiesWidth) {
      // CSS changes both dimensions (e.g. Tailwind `w-32 h-32`) — ensure
      // both inline styles are 'auto' so aspect ratio is preserved.
      newStyle.width = newStyle.width ?? "auto";
      newStyle.height = newStyle.height ?? "auto";
    } else if (cssModifiesHeight) {
      newStyle.width = newStyle.width ?? "auto";
    } else if (cssModifiesWidth) {
      newStyle.height = newStyle.height ?? "auto";
    } else {
      if (!newStyle.width) newStyle.width = isWidthNumber ? `${width}px` : String(width);
      if (!newStyle.height) newStyle.height = isHeightNumber ? `${height}px` : String(height);
    }
  }

  // Additionally, if a `className` is provided (common with Tailwind classes
  // like `max-w-full h-auto`), CSS may change one dimension. In that case
  // ensure the complementary dimension is set to 'auto' to avoid Next.js warnings.
  if (className) {
    // If className present and fill, ensure both dims default to auto
    const isFill = (props as any).fill === true;
    if (isFill) {
      newStyle.width = newStyle.width ?? "auto";
      newStyle.height = newStyle.height ?? "auto";
    }
    // Other className-based adjustments already handled above via hasH/hasW
  }

  // If `fill` is used without a className, still ensure default auto dims
  // to avoid warnings when parent container controls sizing.
  const isFillOnly = (props as any).fill === true && !className;
  if (isFillOnly) {
    newStyle.width = newStyle.width ?? "auto";
    newStyle.height = newStyle.height ?? "auto";
  }

  const alt = rest.alt ?? "";
  // If the src is a remote CDN that may resolve to private IPs from the
  // dev server, skip Next's image optimizer and let the browser fetch the
  // image directly. This avoids server-side DNS resolution that triggers
  // the "resolved to private ip" logs and fetch failures.
  let shouldUnoptimized = false;
  try {
    const srcVal = (props as any).src;
    if (typeof srcVal === "string" && srcVal.startsWith("http")) {
      const url = new URL(srcVal);
      const host = url.hostname;
      // Determine host patterns from env var `NEXT_PUBLIC_UNOPTIMIZED_HOSTS`
      // (comma-separated) so you can update hosts without editing code.
      const envList = (process.env.NEXT_PUBLIC_UNOPTIMIZED_HOSTS || "").split(",").map((s) => s.trim()).filter(Boolean);
      const defaultList = [
        "s3.ap-south-1.amazonaws.com",
        "cdn.mulearn",
        "i.ibb.co",
        "propeers.in",
      ];
      const patterns = envList.length ? envList : defaultList;
      if (patterns.some((p) => host.includes(p))) {
        shouldUnoptimized = true;
      }
    }
  } catch (e) {
    // noop - fall back to default behavior
  }

  const finalUnoptimized = (rest as any).unoptimized || shouldUnoptimized;

  // If `fill` is used, Next.js requires that the image uses width:100%/height:100%
  // and forbids overriding `width` or `height` via inline style. Remove any
  // inline width/height to avoid the runtime warning/error.
  const isFillProp = (props as any).fill === true;
  if (isFillProp) {
    if ((newStyle as any).width != null) delete (newStyle as any).width;
    if ((newStyle as any).height != null) delete (newStyle as any).height;
  }

  return (
    <Image
      ref={ref}
      width={width}
      height={height}
      style={newStyle}
      {...rest}
      unoptimized={finalUnoptimized}
      alt={alt}
    />
  );
});

MuImage.displayName = "MuImage";

export default MuImage;
