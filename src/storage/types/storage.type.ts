export type StorageUploadResult = {
  key: string;
  url: string;
};

export type StorageFileInfo = {
  file: Express.Multer.File | undefined;
  folder: string;
  prefix?: string;
};
