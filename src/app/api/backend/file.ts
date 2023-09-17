import z from "zod";

import { BACKEND_URL, callFetch } from "./endpoints";
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

async function uploadCoverPhoto(photo: Blob): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append("photo", photo);
  
    return await callFetch({
      route: `/file/coverphoto`,
      method: "POST",
      authRequired: true,
      body: formData
    }, false) as { id: string };
}

function getCoverPhoto(): string {
    return `${BACKEND_URL}/file/coverphoto`;
  }
  
export const image = {
  upload,
}

export const file = {
    getCoverPhoto,
    uploadCoverPhoto,
};
