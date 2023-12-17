import { env } from "@/env";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getFileUrl = async (key: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const preSignedUrl = await getSignedUrl(s3, getCommand, {
      expiresIn: 3600,
    });
    return preSignedUrl;
  } catch (err) {
    throw new Error("Error getting file");
  }
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) return new Response("No key provided", { status: 400 });

    return Response.json({ url: await getFileUrl(key) });
  } catch (err) {
    return new Response("Error getting file", { status: 500 });
  }
}
