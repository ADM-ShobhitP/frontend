export const loadAsync = jest.fn(() => Promise.resolve());

export const isLoaded = jest.fn(() => true); // ✅ Add this line

export default {
  loadAsync,
  isLoaded,
};
