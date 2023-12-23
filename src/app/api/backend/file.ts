import { getSession } from "next-auth/react";

import { BACKEND_URL, callFetch } from "./endpoints";

import z from "zod";

const upload = async ({ blogId, file }: { blogId: string; file: Blob }) => {
  return {} as any;
};

async function uploadCoverPhoto(photo: Blob): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("photo", photo);

  return (await callFetch(
    {
      route: `/file/coverphoto`,
      method: "POST",
      authRequired: true,
      body: formData,
    },
    false,
  )) as { id: string };
}

function getCoverPhoto(): string {
  return `${BACKEND_URL}/file/coverphoto`;
}

export const image = {
  upload,
};

export const file = {
  getCoverPhoto,
  uploadCoverPhoto,
};
