import crypto from "crypto";

export async function blobToMD5(blobFile: Blob) {
  const fileBuffer = Buffer.from(await blobFile.arrayBuffer());
  const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");

  return hash;
}
