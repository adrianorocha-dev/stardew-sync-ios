import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function createPresignedUploadURL(key: string) {
  const presignedPost = await createPresignedPost(s3Client, {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Conditions: [{ bucket: process.env.S3_BUCKET_NAME! }, { key }],
    Expires: 60,
  });

  return presignedPost;
}

export async function createPresignedDownloadURL(key: string) {
  const presignedURL = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    }),
    {
      expiresIn: 30 * 60,
    },
  );

  return presignedURL;
}
