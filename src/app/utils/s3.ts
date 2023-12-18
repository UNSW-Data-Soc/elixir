export async function upload(file: Blob, key: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  return await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
}

function getImageRoute(key: string) {
  return `/api/download?key=${key}`;
}

export function getEventImageKey(eventId: string, imageId: string) {
  return `events/${eventId}/${imageId}`;
}

export function getEventImageRoute(eventId: string, imageId: string) {
  return getImageRoute(getEventImageKey(eventId, imageId));
}

export function getBlogImageKey(blogId: string, imageId: string) {
  return `blogs/${blogId}/${imageId}`;
}

export function getBlogImageRoute(blogId: string, imageId: string) {
  return getImageRoute(getBlogImageKey(blogId, imageId));
}
