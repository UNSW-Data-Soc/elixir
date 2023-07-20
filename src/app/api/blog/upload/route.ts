"use server";

import { imgbox } from "imgbox-js";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const reqBodySchema = z.object({
    fileName: z.string(),
    filePath: z.string(),
  });

  try {
    const reqBody = reqBodySchema.parse(req);
    const res = await imgbox(
      [
        {
          source: reqBody.filePath,
          filename: reqBody.fileName,
        },
      ],
      {
        content_type: "safe",
        comments_enabled: false,
      }
    );

    const imageUrl = res.data.success[0].original_url;

    console.log(imageUrl);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }
  //   console.log(body);
}
