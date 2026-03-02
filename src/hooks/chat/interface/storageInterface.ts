export interface UploadResult {
    publicUrl: string;
    storagePath: string;
}

export interface StorageInterface {
    uploadImage(file: File): Promise<UploadResult>;
}
