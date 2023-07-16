import z from "zod";

import { BACKEND_URL } from "./endpoints";
import { getSession } from "next-auth/react";

const upload = async ({ blogId, file }: { blogId: string; file: File }) => {
  const session = await getSession();

  const formData = new FormData();
  formData.append("blog_id", blogId);
  formData.append("photo", file);

  const res = await fetch(`${BACKEND_URL}/file/blog`, {
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    },
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const content = await res.json();
  const responseSchema = z.object({
    id: z.string(),
  });
  return responseSchema.parse(content);
};

export const image = {
  upload,
};
