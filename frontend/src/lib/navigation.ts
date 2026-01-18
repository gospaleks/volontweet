let navigateFn: ((path: string) => void) | null = null;

export function setNavigator(navigate: (path: string) => void) {
  navigateFn = navigate;
}

export const navigateTo = (path: string) => {
  if (!navigateFn) {
    console.warn('Navigator not ready');
    return;
  }

  navigateFn(path);
};
