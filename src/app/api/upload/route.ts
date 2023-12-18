import { isModerator } from "@/app/utils";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { zfd } from "zod-form-data";
import { s3 } from "../s3";

const uploadFile = async (file: Blob, key: string) => {
  const putCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: (await file.arrayBuffer()) as any, // * dumb typecast to make it not complain
  });
  try {
    const res = await s3.send(putCommand);
    return res;
  } catch (err) {
    throw new Error("Error uploading file");
  }
};

const schema = zfd.formData({
  file: zfd.file(),
  key: zfd.text(),
});

// TODO: more accurate error messages / statuses
export async function POST(req: Request) {
  const session = await getServerAuthSession();

  if (!session || !isModerator(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const r = await req.formData();
    try {
      const { file, key } = schema.parse(r);
      await uploadFile(file, key);
    } catch (err) {
      return new Response("Invalid form data", { status: 400 });
    }
  } catch (err) {
    return new Response("Error uploading file", { status: 500 });
  }

  return Response.json({});
}
