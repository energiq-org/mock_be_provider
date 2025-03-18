import { S3Client, GetObjectCommand, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import config from "../config/env.ts";

/* eslint-disable no-unused-vars */
//S3 operations are asynchronous, so we return Promises.
interface S3Storage {
    listBuckets(): Promise<string[]>;
    uploadFile(bucket: string, key: string, file: Buffer): Promise<string>;
    generateFileURL(bucket: string, key: string): Promise<string>;
    downloadFile(bucket: string, key: string): Promise<Buffer>;
}


class AWS implements S3Storage{

    private s3Client: S3Client;
    private static instance: AWS;

    private constructor(){
        try {
            this.s3Client = new S3Client({
                region: config.S3_REGION, 
                credentials: {
                accessKeyId: config.S3_ACCESS_KEY_ID, 
                secretAccessKey: config.S3_SECRET_ACCESS_KEY 
            },
         });
        } catch (error) {
            console.error('Error initializing S3 client:', error);
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
            stream.on('data', (chunk: Buffer | Uint8Array) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    async listBuckets(): Promise<string[]> {
        try {
        const command = new ListBucketsCommand({});
        const response = await this.s3Client.send(command);
        if (response.Buckets) {
            return response.Buckets.map(bucket => bucket.Name as string);
        }
        return [];
        } catch (error) {
        console.error('Error listing buckets:', error);
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
          const url = await this.generateFileURL(bucket, key);
          return url;
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }

    // Generates URL for downloading a file. URL expires in 5 minutes.
   async generateFileURL(bucket: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
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
        throw new Error('Unexpected response Body type');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

}


// helper to ease folder names
const awsFolderNames = {
    cars: 'cars/',
    carModels: (modelId: string): string => `cars/models/${modelId}/`,
    carSmallImage: (modelId: string): string => `cars/models/${modelId}/small.jpg`,
    carFullImage: (modelId: string): string => `cars/models/${modelId}/full.jpg`,
    pfp: 'pfp/',
    userProfile: (userId: string): string => `pfp/${userId}/`,
    userSmallImage: (userId: string): string => `pfp/${userId}/small.jpg`,
    userFullImage: (userId: string): string => `pfp/${userId}/full.jpg`
};

const s3Handler = AWS.getInstance();
export { s3Handler , awsFolderNames };  