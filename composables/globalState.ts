// Use useState for SSR-compatible global state in Nuxt
export const useGlobalState = () => {
  const currentPageImages = useState<string[]>('currentPageImages', () => []);
  const currentPageBildtexter = useState<string[]>('currentPageBildtexter', () => []);
  const currentPagePlant = useState<any>('currentPagePlant', () => null);

  return {
    currentPageImages,
    currentPageBildtexter,
    currentPagePlant,
  };
};
