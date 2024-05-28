// Create debounced function
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;

  // Return a debounced function
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);

    // Set a new timeout to call the function after the specified delay
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
