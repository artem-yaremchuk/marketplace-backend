import fse from "fs-extra";

const removeFiles = async (files) => {
  if (!files) return;

  const filePaths = Array.isArray(files)
    ? files.map((file) => file.path)
    : [files.path];

  await Promise.all(
    filePaths.map(async (path) => {
      if (!path) return;

      try {
        await fse.remove(path);
      } catch (err) {
        console.log(`Failed to remove file: ${path}`, err);
      }
    }),
  );
};

export default removeFiles;