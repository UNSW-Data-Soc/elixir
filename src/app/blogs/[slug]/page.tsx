import BlogContent from "./blogContents";

export default function BlogPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-fit">
      <BlogContent
        slug={params.slug}
      />
    </div>
  );
}