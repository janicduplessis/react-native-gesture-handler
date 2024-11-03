type GestureHandlerRef = {
    viewTag: GestureHandlerRef;
    current: HTMLElement;
};
export default function findNodeHandle(viewRef: GestureHandlerRef | HTMLElement): HTMLElement | number;
export {};
