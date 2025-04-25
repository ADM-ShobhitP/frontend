// __mocks__/react-native-gesture-handler.js
export const Swipeable = jest.fn();
export const DrawerLayout = jest.fn();
export const State = {};
export const PanGestureHandler = jest.fn();
export const TapGestureHandler = jest.fn();
export const FlingGestureHandler = jest.fn();
export const LongPressGestureHandler = jest.fn();
export const NativeViewGestureHandler = jest.fn();
export const gestureHandlerRootHOC = jest.fn((component) => component);
export const Directions = {};
export const GestureHandlerRootView = ({ children }) => children;
