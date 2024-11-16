export const useWidth = () => {
  const windowSize = useState('windowSize', () => ({
    width: 0,
  }));

  const updateWindowSize = () => {
    windowSize.value = {
      width: window.innerWidth,
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
