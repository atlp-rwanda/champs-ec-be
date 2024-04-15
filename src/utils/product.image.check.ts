export const isImageExist = (
  images: Array<{ url: string; imgId: string }>,
  id: string
) => {
  const singleObject: number = images.findIndex((obj) => obj.imgId === id);

  return singleObject;
};
