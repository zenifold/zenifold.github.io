// Build-time values. Kept out of site.json because that file is hand-edited
// content and this is generated.
export default () => {
  const now = new Date();
  return {
    time: now.toISOString(),
    year: now.getUTCFullYear(),
  };
};
