export async function displayAppIcon(iconBlob : Blob): Promise<string> {
    try {
        return URL.createObjectURL(iconBlob);

    } catch (error) {
        console.error('Failed to display app icon:', error);
        return "";
    }
}

