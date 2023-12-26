import Image from "next/image";

const BLOG_POST_IMAGE_HEIGHT = 200;
const BLOG_POST_IMAGE_WIDTH = 300;

export default function BlogImageHomePage(props: { imgSrc: string }) {
  return (
    <Image
      alt="Blog post picture"
      className="h-full w-full rounded-none object-cover"
      src={props.imgSrc}
      height={BLOG_POST_IMAGE_HEIGHT}
      width={BLOG_POST_IMAGE_WIDTH}
    />
  );
}
