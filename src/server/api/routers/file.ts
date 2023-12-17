import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

/** CONSTANTS + PARAMETERS **/
const s3 = new S3Client({
  credentials: {
    accessKeyId: env.S3_USER,
    secretAccessKey: env.S3_PASSWORD,
  },
  region: env.S3_REGION_NAME,
});

/** HELPER FUNCTIONS **/
export const uploadFile = async (file: Blob, key: string) => {
  const putCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: file,
  });
  try {
    const res = await s3.send(putCommand);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error uploading file",
    });
  }
};

/** ROUTER **/
const uploadRouter = createTRPCRouter({
  test: moderatorProcedure.mutation(async ({ ctx }) => {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: "dev/hello-s3.txt",
      Body: "Hello S3!",
    });
    const a = await s3.send(command);
    console.log(a);
  }),
});

export const fileRouter = createTRPCRouter({
  upload: uploadRouter,
});
