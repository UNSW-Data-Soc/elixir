import { BACKEND_URL, callFetch } from "./endpoints";

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
  

export const file = {
    getCoverPhoto,
    uploadCoverPhoto,
};
