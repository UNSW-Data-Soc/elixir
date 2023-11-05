"use client";

import { Image } from "@nextui-org/react";

const BLOG_POST_IMAGE_HEIGHT = 200;
const BLOG_POST_IMAGE_WIDTH = 300;

export default function BlogImageHomePage(props: { imgSrc: string }) {
  return (
    <Image
      removeWrapper
      alt="Blog post picture"
      className="h-full rounded-xl object-cover"
      src={props.imgSrc} // TODO: change this to a default image
      height={BLOG_POST_IMAGE_HEIGHT}
      width={BLOG_POST_IMAGE_WIDTH}
    />
  );
}
