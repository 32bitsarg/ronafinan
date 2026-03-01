import { uploadReceipt } from './src/lib/appwrite';
import { readFileSync } from 'fs';

async function test() {
    try {
        const fileContent = Buffer.from('test content');
        const file = new File([fileContent], 'test.jpg', { type: 'image/jpeg' });
        const url = await uploadReceipt(file);
        console.log("Success! URL:", url);
    } catch (err: any) {
        console.error("Test failed:", err);
    }
}

test();
