import { env } from "@/env";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: env.S3_USER,
    secretAccessKey: env.S3_PASSWORD,
  },
  region: env.S3_REGION_NAME,
});
