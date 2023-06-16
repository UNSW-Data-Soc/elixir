interface Blog {
  id: string;
  title: string;
  datePublished: Date;
  dateEdited: Date;
  author: string;
  body: string;
  public: boolean;
}

export const getBlogs = () => {
  const blogs: Blog[] = [];
  return { blogs };
};
