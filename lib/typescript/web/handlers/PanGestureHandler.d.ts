/// <reference types="react" />
import { AdaptedEvent, Config, StylusData } from '../interfaces';
import GestureHandler from './GestureHandler';
export default class PanGestureHandler extends GestureHandler {
    private readonly customActivationProperties;
    velocityX: number;
    velocityY: number;
    private minDistSq;
    private activeOffsetXStart;
    private activeOffsetXEnd;
    private failOffsetXStart;
    private failOffsetXEnd;
    private activeOffsetYStart;
    private activeOffsetYEnd;
    private failOffsetYStart;
    private failOffsetYEnd;
    private minVelocityX;
    private minVelocityY;
    private minVelocitySq;
    private minPointers;
    private maxPointers;
    private startX;
    private startY;
    private offsetX;
    private offsetY;
    private lastX;
    private lastY;
    private stylusData;
    private activateAfterLongPress;
    private activationTimeout;
    private enableTrackpadTwoFingerGesture;
    private endWheelTimeout;
    private wheelDevice;
    init(ref: number, propsRef: React.RefObject<unknown>): void;
    updateGestureConfig({ enabled, ...props }: Config): void;
    protected resetConfig(): void;
    protected transformNativeEvent(): {
        translationX: number;
        translationY: number;
        velocityX: number;
        velocityY: number;
        stylusData: StylusData | undefined;
    };
    private getTranslationX;
    private getTranslationY;
    private clearActivationTimeout;
    protected onPointerDown(event: AdaptedEvent): void;
    protected onPointerAdd(event: AdaptedEvent): void;
    protected onPointerUp(event: AdaptedEvent): void;
    protected onPointerRemove(event: AdaptedEvent): void;
    protected onPointerMove(event: AdaptedEvent): void;
    protected onPointerOutOfBounds(event: AdaptedEvent): void;
    private scheduleWheelEnd;
    protected onWheel(event: AdaptedEvent): void;
    private shouldActivate;
    private shouldFail;
    private tryBegin;
    private checkBegan;
    activate(force?: boolean): void;
    protected onCancel(): void;
    protected onReset(): void;
    protected resetProgress(): void;
}