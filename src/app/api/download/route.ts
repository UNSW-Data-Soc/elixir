import { env } from "@/env";

import { GetObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "../s3";

const getFile = async (key: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });
  const res = await s3.send(getCommand);
  return res.Body;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) return new Response("No key provided", { status: 400 });

    // * technically incorrect typecast haha but it works so
    const blob = (await getFile(key)) as BodyInit;
    const headers = new Headers();
    headers.set("Content-Type", "image/*");
    return new Response(blob, {
      status: 200,
      statusText: "OK",
      headers,
    });
  } catch (err) {
    return new Response("Error getting file", { status: 500 });
  }
}
