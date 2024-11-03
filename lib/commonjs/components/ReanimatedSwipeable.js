"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _gestureObjects = require("../handlers/gestures/gestureObjects");

var _GestureDetector = require("../handlers/gestures/GestureDetector");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNative = require("react-native");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DRAG_TOSS = 0.05;
var SwipeDirection;

(function (SwipeDirection) {
  SwipeDirection["LEFT"] = "left";
  SwipeDirection["RIGHT"] = "right";
})(SwipeDirection || (SwipeDirection = {}));

const Swipeable = /*#__PURE__*/(0, _react.forwardRef)(function Swipeable(props, ref) {
  const {
    leftThreshold,
    rightThreshold,
    onSwipeableOpenStartDrag,
    onSwipeableCloseStartDrag,
    enableTrackpadTwoFingerGesture,
    enabled,
    containerStyle,
    childrenContainerStyle,
    animationOptions,
    overshootLeft,
    overshootRight,
    onSwipeableWillOpen,
    onSwipeableWillClose,
    onSwipeableOpen,
    onSwipeableClose,
    testID,
    ...remainingProps
  } = props;
  const rowState = (0, _reactNativeReanimated.useSharedValue)(0);
  const userDrag = (0, _reactNativeReanimated.useSharedValue)(0);
  const appliedTranslation = (0, _reactNativeReanimated.useSharedValue)(0);
  const rowWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const leftWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const rightWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const rightOffset = (0, _reactNativeReanimated.useSharedValue)(null);
  const showLeftProgress = (0, _reactNativeReanimated.useSharedValue)(0);
  const showRightProgress = (0, _reactNativeReanimated.useSharedValue)(0);
  const swipeableMethods = (0, _react.useRef)({
    close: () => {
      'worklet';
    },
    openLeft: () => {
      'worklet';
    },
    openRight: () => {
      'worklet';
    },
    reset: () => {
      'worklet';
    }
  });
  const defaultProps = {
    friction: 1,
    overshootFriction: 1
  };
  const {
    friction = defaultProps.friction,
    overshootFriction = defaultProps.overshootFriction
  } = props;
  const overshootLeftProp = overshootLeft;
  const overshootRightProp = overshootRight;

  const updateRightElementWidth = () => {
    'worklet';

    if (rightOffset.value === null) {
      rightOffset.value = rowWidth.value;
    }

    rightWidth.value = Math.max(0, rowWidth.value - rightOffset.value);
  };

  const updateAnimatedEvent = () => {
    'worklet';

    updateRightElementWidth();
    const overshootLeft = overshootLeftProp !== null && overshootLeftProp !== void 0 ? overshootLeftProp : leftWidth.value > 0;
    const overshootRight = overshootRightProp !== null && overshootRightProp !== void 0 ? overshootRightProp : rightWidth.value > 0;
    const startOffset = rowState.value === 1 ? leftWidth.value : rowState.value === -1 ? -rightWidth.value : 0;
    const offsetDrag = userDrag.value / friction + startOffset;
    appliedTranslation.value = (0, _reactNativeReanimated.interpolate)(offsetDrag, [-rightWidth.value - 1, -rightWidth.value, leftWidth.value, leftWidth.value + 1], [-rightWidth.value - (overshootRight ? 1 / overshootFriction : 0), -rightWidth.value, leftWidth.value, leftWidth.value + (overshootLeft ? 1 / overshootFriction : 0)]);
    showLeftProgress.value = leftWidth.value > 0 ? (0, _reactNativeReanimated.interpolate)(appliedTranslation.value, [-1, 0, leftWidth.value], [0, 0, 1]) : 0;
    showRightProgress.value = rightWidth.value > 0 ? (0, _reactNativeReanimated.interpolate)(appliedTranslation.value, [-rightWidth.value, 0, 1], [1, 0, 0]) : 0;
  };

  const dispatchImmediateEvents = (0, _react.useCallback)((fromValue, toValue) => {
    if (toValue > 0) {
      onSwipeableWillOpen === null || onSwipeableWillOpen === void 0 ? void 0 : onSwipeableWillOpen(SwipeDirection.RIGHT);
    } else if (toValue < 0) {
      onSwipeableWillOpen === null || onSwipeableWillOpen === void 0 ? void 0 : onSwipeableWillOpen(SwipeDirection.LEFT);
    } else {
      onSwipeableWillClose === null || onSwipeableWillClose === void 0 ? void 0 : onSwipeableWillClose(fromValue > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT);
    }
  }, [onSwipeableWillClose, onSwipeableWillOpen]);
  const dispatchEndEvents = (0, _react.useCallback)((fromValue, toValue) => {
    if (toValue > 0) {
      onSwipeableOpen === null || onSwipeableOpen === void 0 ? void 0 : onSwipeableOpen(SwipeDirection.RIGHT, swipeableMethods.current);
    } else if (toValue < 0) {
      onSwipeableOpen === null || onSwipeableOpen === void 0 ? void 0 : onSwipeableOpen(SwipeDirection.LEFT, swipeableMethods.current);
    } else {
      onSwipeableClose === null || onSwipeableClose === void 0 ? void 0 : onSwipeableClose(fromValue > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT, swipeableMethods.current);
    }
  }, [onSwipeableClose, onSwipeableOpen]);
  const animationOptionsProp = animationOptions;
  const animateRow = (0, _react.useCallback)((toValue, velocityX) => {
    'worklet';

    const translationSpringConfig = {
      duration: 1000,
      dampingRatio: 0.9,
      stiffness: 500,
      velocity: velocityX,
      overshootClamping: true,
      ...animationOptionsProp
    };
    const isClosing = toValue === 0;
    const moveToRight = isClosing ? rowState.value < 0 : toValue > 0;
    const usedWidth = isClosing ? moveToRight ? rightWidth.value : leftWidth.value : moveToRight ? leftWidth.value : rightWidth.value;
    const progressSpringConfig = { ...translationSpringConfig,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      velocity: velocityX && (0, _reactNativeReanimated.interpolate)(velocityX, [-usedWidth, usedWidth], [-1, 1])
    };
    const frozenRowState = rowState.value;
    appliedTranslation.value = (0, _reactNativeReanimated.withSpring)(toValue, translationSpringConfig, isFinished => {
      if (isFinished) {
        (0, _reactNativeReanimated.runOnJS)(dispatchEndEvents)(frozenRowState, toValue);
      }
    });
    const progressTarget = toValue === 0 ? 0 : 1;
    showLeftProgress.value = leftWidth.value > 0 ? (0, _reactNativeReanimated.withSpring)(progressTarget, progressSpringConfig) : 0;
    showRightProgress.value = rightWidth.value > 0 ? (0, _reactNativeReanimated.withSpring)(progressTarget, progressSpringConfig) : 0;
    (0, _reactNativeReanimated.runOnJS)(dispatchImmediateEvents)(frozenRowState, toValue);
    rowState.value = Math.sign(toValue);
  }, [rowState, animationOptionsProp, appliedTranslation, showLeftProgress, leftWidth.value, showRightProgress, rightWidth.value, dispatchImmediateEvents, dispatchEndEvents]);

  const onRowLayout = ({
    nativeEvent
  }) => {
    rowWidth.value = nativeEvent.layout.width;
  };

  const {
    children,
    renderLeftActions,
    renderRightActions,
    dragOffsetFromLeftEdge = 10,
    dragOffsetFromRightEdge = 10
  } = props;
  swipeableMethods.current = {
    close() {
      'worklet';

      animateRow(0);
    },

    openLeft() {
      'worklet';

      animateRow(leftWidth.value);
    },

    openRight() {
      'worklet';

      animateRow(-rightWidth.value);
    },

    reset() {
      'worklet';

      userDrag.value = 0;
      showLeftProgress.value = 0;
      appliedTranslation.value = 0;
      rowState.value = 0;
    }

  };

  const leftElement = renderLeftActions && /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.leftActions]
  }, renderLeftActions(showLeftProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    onLayout: ({
      nativeEvent
    }) => leftWidth.value = nativeEvent.layout.x
  }));

  const rightElement = renderRightActions && /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.rightActions]
  }, renderRightActions(showRightProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    onLayout: ({
      nativeEvent
    }) => rightOffset.value = nativeEvent.layout.x
  }));

  const leftThresholdProp = leftThreshold;
  const rightThresholdProp = rightThreshold;

  const handleRelease = event => {
    'worklet';

    const {
      velocityX
    } = event;
    userDrag.value = event.translationX;
    updateRightElementWidth();
    const leftThreshold = leftThresholdProp !== null && leftThresholdProp !== void 0 ? leftThresholdProp : leftWidth.value / 2;
    const rightThreshold = rightThresholdProp !== null && rightThresholdProp !== void 0 ? rightThresholdProp : rightWidth.value / 2;
    const translationX = (userDrag.value + DRAG_TOSS * velocityX) / friction;
    let toValue = 0;

    if (rowState.value === 0) {
      if (translationX > leftThreshold) {
        toValue = leftWidth.value;
      } else if (translationX < -rightThreshold) {
        toValue = -rightWidth.value;
      }
    } else if (rowState.value === 1) {
      // Swiped to left
      if (translationX > -leftThreshold) {
        toValue = leftWidth.value;
      }
    } else {
      // Swiped to right
      if (translationX < rightThreshold) {
        toValue = -rightWidth.value;
      }
    }

    animateRow(toValue, velocityX / friction);
  };

  const close = () => {
    'worklet';

    animateRow(0);
  };

  const tapGesture = _gestureObjects.GestureObjects.Tap().onStart(() => {
    if (rowState.value !== 0) {
      close();
    }
  });

  const dragStarted = (0, _reactNativeReanimated.useSharedValue)(false);

  const panGesture = _gestureObjects.GestureObjects.Pan().onUpdate(event => {
    userDrag.value = event.translationX;
    const direction = rowState.value === -1 ? SwipeDirection.RIGHT : rowState.value === 1 ? SwipeDirection.LEFT : event.translationX > 0 ? SwipeDirection.RIGHT : SwipeDirection.LEFT;

    if (!dragStarted.value) {
      dragStarted.value = true;

      if (rowState.value === 0 && onSwipeableOpenStartDrag) {
        (0, _reactNativeReanimated.runOnJS)(onSwipeableOpenStartDrag)(direction);
      } else if (rowState.value !== 0 && onSwipeableCloseStartDrag) {
        (0, _reactNativeReanimated.runOnJS)(onSwipeableCloseStartDrag)(direction);
      }
    }

    updateAnimatedEvent();
  }).onEnd(event => {
    handleRelease(event);
  }).onFinalize(() => {
    dragStarted.value = false;
  });

  if (enableTrackpadTwoFingerGesture) {
    panGesture.enableTrackpadTwoFingerGesture(enableTrackpadTwoFingerGesture);
  }

  panGesture.activeOffsetX([-dragOffsetFromRightEdge, dragOffsetFromLeftEdge]);
  tapGesture.shouldCancelWhenOutside(true);
  (0, _react.useImperativeHandle)(ref, () => swipeableMethods.current, [swipeableMethods]);
  panGesture.enabled(enabled !== false);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateX: appliedTranslation.value
    }],
    pointerEvents: rowState.value === 0 ? 'auto' : 'box-only'
  }), [appliedTranslation, rowState]);

  const swipeableComponent = /*#__PURE__*/_react.default.createElement(_GestureDetector.GestureDetector, {
    gesture: panGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({}, remainingProps, {
    onLayout: onRowLayout,
    style: [styles.container, containerStyle]
  }), leftElement, rightElement, /*#__PURE__*/_react.default.createElement(_GestureDetector.GestureDetector, {
    gesture: tapGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [animatedStyle, childrenContainerStyle]
  }, children))));

  return testID ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    testID: testID
  }, swipeableComponent) : swipeableComponent;
});
var _default = Swipeable;
exports.default = _default;

const styles = _reactNative.StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  leftActions: { ..._reactNative.StyleSheet.absoluteFillObject,
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  rightActions: { ..._reactNative.StyleSheet.absoluteFillObject,
    flexDirection: _reactNative.I18nManager.isRTL ? 'row' : 'row-reverse'
  }
});
//# sourceMappingURL=ReanimatedSwipeable.js.map