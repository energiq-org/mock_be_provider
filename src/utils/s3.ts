import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListBucketsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import config from "../config/env.ts";
import logger from "./logging.ts";

/* eslint-disable no-unused-vars */
interface S3Storage {
  listBuckets(): Promise<string[]>;
  uploadFile(bucket: string, key: string, file: Buffer): Promise<string>;
  generatePresignedURL(bucket: string, key: string): Promise<string>;
  generatePublicURL(bucket: string, key: string): string;
  downloadFile(bucket: string, key: string): Promise<Buffer>;
  deleteFile(bucket: string, key: string): Promise<void>;
}

class AWS implements S3Storage {
  private s3Client: S3Client;
  private static instance: AWS;

  private constructor() {
    try {
      this.s3Client = new S3Client({
        region: config.S3_REGION,
        credentials: {
          accessKeyId: config.S3_ACCESS_KEY_ID,
          secretAccessKey: config.S3_SECRET_ACCESS_KEY,
        },
      });
      logger.info("S3 client initialized");
    } catch (error) {
      console.error("Error initializing S3 client:", error);
      throw error;
    }
  }

  public static getInstance(): AWS {
    if (AWS.instance === undefined) {
      AWS.instance = new AWS();
    }
    return AWS.instance;
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer | Uint8Array) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      );
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  async listBuckets(): Promise<string[]> {
    try {
      const command = new ListBucketsCommand({});
      const response = await this.s3Client.send(command);
      if (response.Buckets) {
        return response.Buckets.map((bucket) => bucket.Name as string);
      }
      return [];
    } catch (error) {
      console.error("Error listing buckets:", error);
      return [];
    }
  }

  async uploadFile(bucket: string, key: string, file: Buffer): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
    });
    try {
      await this.s3Client.send(command);
      return this.generatePublicURL(bucket, key);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async generatePresignedURL(bucket: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: config.S3_URL_EXPIRATION });
      return url;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }

  generatePublicURL(bucket: string, key: string): string {
    const url = `https://${bucket}.s3.${config.S3_REGION}.amazonaws.com/${key}`;
    return url;
  }

  async downloadFile(bucket: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const response = await this.s3Client.send(command);
      if (response.Body instanceof Readable) {
        return await this.streamToBuffer(response.Body);
      } else {
        throw new Error("Unexpected response Body type");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      await this.s3Client.send(command);
      console.log(`Deleted ${key} from ${bucket}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

// helper to ease folder names
const awsFolderNames = {
  cars: "cars/",
  carModels: (modelId: string, extension: string): string => `cars/models/${modelId}.${extension}`,
  // carSmallImage: (modelId: string, extension: string): string => `cars/models/${modelId}/small.${extension}`,
  // carFullImage: (modelId: string, extension: string): string => `cars/models/${modelId}/full.${extension}`,
  pfp: "pfp/",
  userProfile: (userId: string, extension: string): string => `pfp/${userId}.${extension}`,
  // userSmallImage: (userId: string, extension: string): string => `pfp/${userId}/small.${extension}`,
  // userFullImage: (userId: string, extension: string): string => `pfp/${userId}/full.${extension}`,
};

const s3Handler = AWS.getInstance();
export { s3Handler, awsFolderNames };
