/** Hands the learner a file, built in the page — nothing is uploaded or fetched. */
export const downloadText = (filename: string, text: string, type = 'application/json'): void => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
