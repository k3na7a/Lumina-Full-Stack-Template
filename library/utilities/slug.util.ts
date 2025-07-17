export const generateUrlSlug = (text?: string): string | undefined =>
  text
    ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .replace(/\W+/g, '-')
    .toLowerCase()
