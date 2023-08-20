import { callFetch } from "./endpoints";

export interface Tag {
  id: string;
  name: string;
  colour: string    //hexcode 
}

export type Bearer = "blog" | "event" | "resource" | "sponsorship" | "job" | "portfolio";
export interface Attachment {
  attach_to: Bearer;
  bearer_id: string; 
  tag_id: string;
}

export interface Detachment {
  detach_from: Bearer;
  attachment_id: string; 
}

export interface AttachmentInfo {
  attachment_id: string,
  bearer_id: string,
  tag_id: string,
  name: string, // tag name
  colour: string, // tag colour
}

const getAll: () => Promise<Tag[]> = async () => {
  return (await callFetch({
    route: "/tags",
    method: "GET",
    authRequired: false,
  })) as Tag[];
};


interface CreateTag {
  name: string;
  colour: string    //hexcode \
}
const create: (tag: CreateTag) => Promise<Tag> = async (tag: CreateTag) => {
  return await callFetch({
    method: "POST",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify({ ...tag, public: true }),
  });
};

interface UpdateTag {
 // id: string;
  name?: string;
  color?: string;
}

const update: (updateData: Partial<UpdateTag>) => Promise<Tag> = async (updateData: Partial<UpdateTag>) => {
  return await callFetch({
    method: "PUT",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify(updateData),
  });
};

const deleteTag = async (tagId: string): Promise<void> => {

  if (!tagId) {
    throw new Error('Invalid tag ID');
  }

  const response = await callFetch({
    method: "DELETE",
    route: `/tag?id=${tagId}`, 
    authRequired: true,
  });

  console.log("response status" + response.status); 
};

const attachments: (bearer: Bearer) => Promise<AttachmentInfo[]> = async (bearer: Bearer) => {
  return await callFetch({
    method: "GET",
    route: `/tag/attachments?bearer=${bearer}`,
  });
};

const attach: (attachment: Attachment) => Promise<AttachmentInfo> = async (
  attachment: Attachment
) => {
  return await callFetch({
    method: "POST",
    route: "/tag/attach",
    authRequired: true,
    body: JSON.stringify(attachment),
  });
};

const detach: (detachment: Detachment) => Promise<{id: string}> = async (
  detachment: Detachment
) => {
  return await callFetch({
    method: "DELETE",
    route: "/tag/detach",
    authRequired: true,
    body: JSON.stringify(detachment),
  });
};

export const tags = {
  getAll,
  create,
  update,
  deleteTag,
  attachments,
  attach,
  detach
};
