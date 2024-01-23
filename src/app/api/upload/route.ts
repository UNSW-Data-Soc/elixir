import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth";

import { env } from "@/env";

import { isModerator } from "@/app/utils";

import { Octokit } from "@octokit/core";

import { zfd } from "zod-form-data";

export const config = {};

const octokit = new Octokit({
  auth: env.GITHUB_STATIC_TOKEN,
});

const blobToBase64 = async (blob: Blob) => {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString("base64");
};

const uploadFile = async (file: File, key: string) => {
  try {
    const content = await blobToBase64(file);

    const res = await octokit.request(
      `PUT /repos/unswdata/static/contents/elixir/${key}`,
      {
        owner: "unswdata",
        repo: "static",
        path: `/elixir/${key}`,
        message: `uploaded content to key: ${key} at ${new Date().toISOString()}`,
        content,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    console.log(res);
  } catch (e) {
    console.error(e);
  }
};

const schema = zfd.formData({
  file: zfd.file(),
  key: zfd.text(),
});

export async function POST(req: Request) {
  const session = await getServerAuthSession();

  if (!session || !isModerator(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // get form data
    const r = await req.formData();
    const { file, key } = schema.parse(r);

    try {
      // upload file to github
      await uploadFile(file, key);
    } catch (err) {
      console.log(err);
      return new Response(`Error uploading file: ${err}`, { status: 500 });
    }
  } catch (err) {
    return new Response("Invalid form data", { status: 400 });
  }

  return NextResponse.json({});
}
