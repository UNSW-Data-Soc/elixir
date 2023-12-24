/* uploads a file to the S3 key given */
export async function upload(file: Blob, key: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  return await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
}

/* the backend route to get a photo */
function getImageRoute(key: string) {
  return `/api/download?key=${key}`;
}

/* EVENT CPs */
export function getEventImageKey(eventId: string, imageId: string) {
  return `events/${eventId}/${imageId}`;
}

export function getEventImageRoute(eventId: string, imageId: string) {
  return getImageRoute(getEventImageKey(eventId, imageId));
}

/* BLOG IMAGES */
export function getBlogImageKey(blogId: string, imageId: string) {
  return `blogs/${blogId}/${imageId}`;
}

export function getBlogImageRoute(blogId: string, imageId: string) {
  return getImageRoute(getBlogImageKey(blogId, imageId));
}

/* COMPANY LOGO */
export function getCompanyImageKey(companyId: string, imageId: string) {
  return `companies/${companyId}/${imageId}`;
}

export function getCompanyImageRoute(companyId: string, imageId: string) {
  return getImageRoute(getCompanyImageKey(companyId, imageId));
}

/* COVER PHOTO */
export function getCoverPhotoKey(imageId: string) {
  return `coverphoto/${imageId}`;
}

export function getCoverPhotoRoute(imageId: string) {
  return getImageRoute(getCoverPhotoKey(imageId));
}

/* USER PROFILE PICTURES */
export function getUserProfilePicKey(userId: string, imageId: string) {
  return `users/${userId}/${imageId}`;
}

export function getUserProfilePicRoute(userId: string, imageId: string) {
  return getImageRoute(getUserProfilePicKey(userId, imageId));
}

/* RESOURCE FILES */
export function getResourceFileKey(resourceId: string, fileId: string) {
  return `resources/${resourceId}/${fileId}`;
}

export function getResourceFileRoute(resourceId: string, fileId: string) {
  return getImageRoute(getResourceFileKey(resourceId, fileId));
}
