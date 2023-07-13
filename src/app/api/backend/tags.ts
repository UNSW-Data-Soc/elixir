import { randomUUID } from "crypto";
import { callFetch } from "./endpoints";

export interface Tag {
  id: string;
  name: string;
  colour: string    //hexcode 
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

/*const update: (tag: UpdateTag) => Promise<Tag> = async (tag: UpdateTag) => {
  const { id, ...updateData } = tag;
  console.log("went intodo update function")
  console.log(tag);
  return await callFetch({
    method: "PUT",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify(updateData),
  });
};
*/

const update: (updateData: Partial<UpdateTag>) => Promise<Tag> = async (updateData: Partial<UpdateTag>) => {
  return await callFetch({
    method: "PUT",
    route: "/tag",
    authRequired: true,
    body: JSON.stringify(updateData),
  });
};
export const tags = {
  getAll,
  create,
  update,
};



