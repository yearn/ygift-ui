export const createDataTestId = (componentName: string) => (primary: string, secondary?: string): string =>
  `${componentName}${secondary ? `-${primary}--${secondary}` : `-${primary}`}`;
