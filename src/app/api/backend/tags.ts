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

export type TagReferenceInfo = [string, string];
export interface TagReferences {
  tags_id: string,
  tags_name: string,
  tags_colour: string,
  portfolio: TagReferenceInfo[],
  blog: TagReferenceInfo[],
  event: TagReferenceInfo[],
  resource: TagReferenceInfo[],
  sponsorship: TagReferenceInfo[],
  job: TagReferenceInfo[],
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
  colour: string
}

const create: (tag: CreateTag) => Promise<Tag> = async (tag: CreateTag) => {
  return await callFetch({
    method: "POST",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify({ ...tag}),
  });
};

const update: (updateData: Tag) => Promise<Tag> = async (updateData: Tag) => {
  return await callFetch({
    method: "PUT",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify(updateData),
  });
};

const deleteTag = async (tagId: string): Promise<void> => {
  const response = await callFetch({
    method: "DELETE",
    route: `/tag?id=${tagId}`, 
    authRequired: true,
  });
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
  
  const references: () => Promise<TagReferences[]> = async () => {
    return await callFetch({
      method: "GET",
      route: "/tag/references",
      authRequired: false,
    });
  };

export const tags = {
  getAll,
  create,
  update,
  deleteTag,
  attachments,
  references,
  attach,
  detach
};
