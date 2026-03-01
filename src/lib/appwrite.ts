import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

const endpoint = process.env.APPWRITE_ENDPOINT!;
const projectId = process.env.APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;
const bucketId = process.env.APPWRITE_BUCKET_ID!;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const storage = new Storage(client);

export async function uploadReceipt(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const appwriteFile = InputFile.fromBuffer(buffer, file.name || 'receipt.jpg');

        const uploadedFile = await storage.createFile(
            bucketId,
            ID.unique(),
            appwriteFile
        );

        // Retornamos la URL pública o de vista para que el Frontend la muestre
        const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${projectId}&mode=admin`;
        return fileUrl;
    } catch (error: any) {
        console.error('Error subiendo imagen a Appwrite:', error);
        throw new Error('Fallo al subir el comprobante. Inténtalo sin imagen o revisa la red.');
    }
}

export async function deleteReceiptFile(fileUrl: string): Promise<void> {
    try {
        const match = fileUrl.match(/\/files\/([^/]+)\/view/);
        if (match && match[1]) {
            await storage.deleteFile(bucketId, match[1]);
        }
    } catch (error: any) {
        console.error('Error eliminando imagen de Appwrite:', error);
    }
}
