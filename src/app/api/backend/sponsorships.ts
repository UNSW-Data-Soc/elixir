import { BACKEND_URL, callFetch } from "./endpoints";

export type SponsorshipType = "major" | "partner" | "other";

export interface Sponsorship {
  message: string,
  sponsorship_type: SponsorshipType,
  company: string,
  expiration: string,
  id: string
}

export interface CreateSponsorship {
  message: string,
  sponsorship_type: SponsorshipType,
  company: string,
  expiration: string,
}

export function isOfTypeSponsorshipType (s: string): s is SponsorshipType {
  return ["major", "partner", "other"].includes(s);
}

async function getAll(authRequired: boolean): Promise<Sponsorship[]> {
  return (await callFetch({
    route: "/sponsorships",
    method: "GET",
    authRequired: authRequired,
  })) as Sponsorship[];
};


async function create(sponsorship: CreateSponsorship): Promise<Sponsorship> {
  return await callFetch({
    method: "POST",
    route: "/sponsorship",
    authRequired: true,
    body: JSON.stringify(sponsorship),
  });
};

const remove: (id: string) => Promise<{id: string}> = async (id: string) => {
  return await callFetch({
    method: "DELETE",
    route: `/sponsorship?id=${id}`,
    authRequired: true,
  });
};

// async function updateVisibility(id: string, visible: boolean) {
//   return await callFetch({
//     method: "PUT",
//     route: "/company",
//     authRequired: true,
//     body: JSON.stringify({id: id, public: visible})
//   })
// }

export const sponsorships = {
  getAll,
  create,
  remove,
};
