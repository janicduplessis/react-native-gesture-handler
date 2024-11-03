function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Similarily to the DrawerLayout component this deserves to be put in a
// separate repo. Although, keeping it here for the time being will allow us to
// move faster and fix possible issues quicker
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { GestureObjects as Gesture } from '../handlers/gestures/gestureObjects';
import { GestureDetector } from '../handlers/gestures/GestureDetector';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { I18nManager, StyleSheet, View } from 'react-native';
const DRAG_TOSS = 0.05;
var SwipeDirection;

(function (SwipeDirection) {
  SwipeDirection["LEFT"] = "left";
  SwipeDirection["RIGHT"] = "right";
})(SwipeDirection || (SwipeDirection = {}));

const Swipeable = /*#__PURE__*/forwardRef(function Swipeable(props, ref) {
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
  const rowState = useSharedValue(0);
  const userDrag = useSharedValue(0);
  const appliedTranslation = useSharedValue(0);
  const rowWidth = useSharedValue(0);
  const leftWidth = useSharedValue(0);
  const rightWidth = useSharedValue(0);
  const rightOffset = useSharedValue(null);
  const showLeftProgress = useSharedValue(0);
  const showRightProgress = useSharedValue(0);
  const swipeableMethods = useRef({
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
    appliedTranslation.value = interpolate(offsetDrag, [-rightWidth.value - 1, -rightWidth.value, leftWidth.value, leftWidth.value + 1], [-rightWidth.value - (overshootRight ? 1 / overshootFriction : 0), -rightWidth.value, leftWidth.value, leftWidth.value + (overshootLeft ? 1 / overshootFriction : 0)]);
    showLeftProgress.value = leftWidth.value > 0 ? interpolate(appliedTranslation.value, [-1, 0, leftWidth.value], [0, 0, 1]) : 0;
    showRightProgress.value = rightWidth.value > 0 ? interpolate(appliedTranslation.value, [-rightWidth.value, 0, 1], [1, 0, 0]) : 0;
  };

  const dispatchImmediateEvents = useCallback((fromValue, toValue) => {
    if (toValue > 0) {
      onSwipeableWillOpen === null || onSwipeableWillOpen === void 0 ? void 0 : onSwipeableWillOpen(SwipeDirection.RIGHT);
    } else if (toValue < 0) {
      onSwipeableWillOpen === null || onSwipeableWillOpen === void 0 ? void 0 : onSwipeableWillOpen(SwipeDirection.LEFT);
    } else {
      onSwipeableWillClose === null || onSwipeableWillClose === void 0 ? void 0 : onSwipeableWillClose(fromValue > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT);
    }
  }, [onSwipeableWillClose, onSwipeableWillOpen]);
  const dispatchEndEvents = useCallback((fromValue, toValue) => {
    if (toValue > 0) {
      onSwipeableOpen === null || onSwipeableOpen === void 0 ? void 0 : onSwipeableOpen(SwipeDirection.RIGHT, swipeableMethods.current);
    } else if (toValue < 0) {
      onSwipeableOpen === null || onSwipeableOpen === void 0 ? void 0 : onSwipeableOpen(SwipeDirection.LEFT, swipeableMethods.current);
    } else {
      onSwipeableClose === null || onSwipeableClose === void 0 ? void 0 : onSwipeableClose(fromValue > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT, swipeableMethods.current);
    }
  }, [onSwipeableClose, onSwipeableOpen]);
  const animationOptionsProp = animationOptions;
  const animateRow = useCallback((toValue, velocityX) => {
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
      velocity: velocityX && interpolate(velocityX, [-usedWidth, usedWidth], [-1, 1])
    };
    const frozenRowState = rowState.value;
    appliedTranslation.value = withSpring(toValue, translationSpringConfig, isFinished => {
      if (isFinished) {
        runOnJS(dispatchEndEvents)(frozenRowState, toValue);
      }
    });
    const progressTarget = toValue === 0 ? 0 : 1;
    showLeftProgress.value = leftWidth.value > 0 ? withSpring(progressTarget, progressSpringConfig) : 0;
    showRightProgress.value = rightWidth.value > 0 ? withSpring(progressTarget, progressSpringConfig) : 0;
    runOnJS(dispatchImmediateEvents)(frozenRowState, toValue);
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
  const leftElement = renderLeftActions && /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.leftActions]
  }, renderLeftActions(showLeftProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/React.createElement(View, {
    onLayout: ({
      nativeEvent
    }) => leftWidth.value = nativeEvent.layout.x
  }));
  const rightElement = renderRightActions && /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.rightActions]
  }, renderRightActions(showRightProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/React.createElement(View, {
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

  const tapGesture = Gesture.Tap().onStart(() => {
    if (rowState.value !== 0) {
      close();
    }
  });
  const dragStarted = useSharedValue(false);
  const panGesture = Gesture.Pan().onUpdate(event => {
    userDrag.value = event.translationX;
    const direction = rowState.value === -1 ? SwipeDirection.RIGHT : rowState.value === 1 ? SwipeDirection.LEFT : event.translationX > 0 ? SwipeDirection.RIGHT : SwipeDirection.LEFT;

    if (!dragStarted.value) {
      dragStarted.value = true;

      if (rowState.value === 0 && onSwipeableOpenStartDrag) {
        runOnJS(onSwipeableOpenStartDrag)(direction);
      } else if (rowState.value !== 0 && onSwipeableCloseStartDrag) {
        runOnJS(onSwipeableCloseStartDrag)(direction);
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
  useImperativeHandle(ref, () => swipeableMethods.current, [swipeableMethods]);
  panGesture.enabled(enabled !== false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: appliedTranslation.value
    }],
    pointerEvents: rowState.value === 0 ? 'auto' : 'box-only'
  }), [appliedTranslation, rowState]);
  const swipeableComponent = /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: panGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/React.createElement(Animated.View, _extends({}, remainingProps, {
    onLayout: onRowLayout,
    style: [styles.container, containerStyle]
  }), leftElement, rightElement, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: tapGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [animatedStyle, childrenContainerStyle]
  }, children))));
  return testID ? /*#__PURE__*/React.createElement(View, {
    testID: testID
  }, swipeableComponent) : swipeableComponent;
});
export default Swipeable;
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  leftActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  rightActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  }
});
//# sourceMappingURL=ReanimatedSwipeable.js.map