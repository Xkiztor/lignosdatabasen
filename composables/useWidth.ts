export const useWidth = () => {
  // Use a default value that matches your CSS breakpoint for SSR consistency
  // This assumes desktop-first, adjust if needed
  const windowSize = useState('windowSize', () => ({
    width: 1024, // Default to desktop width for SSR
    isClient: false,
  }));

  const updateWindowSize = () => {
    windowSize.value = {
      width: window.innerWidth,
      isClient: true,
    };
  };

  onMounted(() => {
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
  });

  return windowSize;
};
