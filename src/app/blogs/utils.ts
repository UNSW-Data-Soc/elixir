import { BlogBody } from "@/trpc/types";

import { getBlogImageRoute } from "../utils/s3";

const DEFAULT_BLOG_IMAGE = "/logo.png";

export function getFirstImageUrl(
  body: BlogBody,
  defaultImageUrl = DEFAULT_BLOG_IMAGE,
): { url: string; found: boolean } {
  const imageNode = body.content.find((node) => node.type === "image");

  // blog has no images
  if (!imageNode || imageNode.type !== "image")
    return { url: defaultImageUrl, found: false };

  // S3 image
  if (imageNode.attrs.src === null) {
    return {
      url: getBlogImageRoute(imageNode.attrs.blogId, imageNode.attrs.imageId),
      found: true,
    };
  }

  // url image
  return { url: imageNode.attrs.src, found: true };
}

export function getBlogExcerpt(body: BlogBody): string {
  console.log(JSON.stringify(body, null, 2));
  const firstParagraph = body.content.find(
    (node) => node.type === "paragraph" && (node.content ?? []).length > 0,
  );

  if (
    !firstParagraph ||
    firstParagraph.type !== "paragraph" ||
    !firstParagraph.content ||
    (firstParagraph.content ?? []).length < 0
  )
    return "";

  return firstParagraph.content
    .map((node) => {
      if (node.type === "text") return node.text;
      if (node.type === "image") return "";
      return "";
    })
    .join(" ");
}
