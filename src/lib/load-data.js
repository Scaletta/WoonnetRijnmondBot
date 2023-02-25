import path from "path";
import fsPromises from "fs/promises";

export async function loadData() {
    const filePath = path.join(process.cwd(), 'data/data.json');
    const jsonData = await fsPromises.readFile(filePath);
    return JSON.parse(jsonData)
}