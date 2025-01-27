import { PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const bucket = process.env.S3_AWS_BUCKET;
const region = process.env.S3_AWS_BUCKET_REGION;

const client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadMedia(data: {
  Key: string;
  Body: PutObjectCommandInput["Body"];
  ContentType: string;
}) {
  const command = new Upload({
    client,
    params: { Bucket: bucket, ...data },
  });

  await command.done();

  const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(
    data.Key
  )}` as const;

  console.log(url);

  return url;
}
