"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPointerInBounds = isPointerInBounds;
exports.calculateViewScale = calculateViewScale;
exports.tryExtractStylusData = tryExtractStylusData;
exports.isRNSVGElement = isRNSVGElement;
exports.coneToDeviation = exports.degToRad = exports.PointerTypeMapping = void 0;

var _PointerType = require("../PointerType");

function isPointerInBounds(view, {
  x,
  y
}) {
  const rect = view.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

const PointerTypeMapping = new Map([['mouse', _PointerType.PointerType.MOUSE], ['touch', _PointerType.PointerType.TOUCH], ['pen', _PointerType.PointerType.STYLUS], ['none', _PointerType.PointerType.OTHER]]);
exports.PointerTypeMapping = PointerTypeMapping;

const degToRad = degrees => degrees * Math.PI / 180;

exports.degToRad = degToRad;

const coneToDeviation = degrees => Math.cos(degToRad(degrees / 2));

exports.coneToDeviation = coneToDeviation;

function calculateViewScale(view) {
  var _RegExp$exec;

  const styles = getComputedStyle(view);
  const resultScales = {
    scaleX: 1,
    scaleY: 1
  }; // Get scales from scale property

  if (styles.scale !== undefined && styles.scale !== 'none') {
    const scales = styles.scale.split(' ');

    if (scales[0]) {
      resultScales.scaleX = parseFloat(scales[0]);
    }

    resultScales.scaleY = scales[1] ? parseFloat(scales[1]) : parseFloat(scales[0]);
  } // Get scales from transform property


  const matrixElements = (_RegExp$exec = new RegExp(/matrix\((.+)\)/).exec(styles.transform)) === null || _RegExp$exec === void 0 ? void 0 : _RegExp$exec[1];

  if (matrixElements) {
    const matrixElementsArray = matrixElements.split(', ');
    resultScales.scaleX *= parseFloat(matrixElementsArray[0]);
    resultScales.scaleY *= parseFloat(matrixElementsArray[3]);
  }

  return resultScales;
}

function tryExtractStylusData(event) {
  const pointerType = PointerTypeMapping.get(event.pointerType);

  if (pointerType !== _PointerType.PointerType.STYLUS) {
    return;
  } // @ts-ignore This property exists (https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent#instance_properties)


  const eventAzimuthAngle = event.azimuthAngle; // @ts-ignore This property exists (https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent#instance_properties)

  const eventAltitudeAngle = event.altitudeAngle;

  if (event.tiltX === 0 && event.tiltY === 0) {
    // If we are in this branch, it means that either tilt properties are not supported and we have to calculate them from altitude and azimuth angles,
    // or stylus is perpendicular to the screen and we can use altitude / azimuth instead of tilt
    // If azimuth and altitude are undefined in this branch, it means that we are either perpendicular to the screen,
    // or that none of the position sets is supported. In that case, we can treat stylus as perpendicular
    if (eventAzimuthAngle === undefined || eventAltitudeAngle === undefined) {
      return {
        tiltX: 0,
        tiltY: 0,
        azimuthAngle: Math.PI / 2,
        altitudeAngle: Math.PI / 2,
        pressure: event.pressure
      };
    }

    const {
      tiltX,
      tiltY
    } = spherical2tilt(eventAltitudeAngle, eventAzimuthAngle);
    return {
      tiltX,
      tiltY,
      azimuthAngle: eventAzimuthAngle,
      altitudeAngle: eventAltitudeAngle,
      pressure: event.pressure
    };
  }

  const {
    altitudeAngle,
    azimuthAngle
  } = tilt2spherical(event.tiltX, event.tiltY);
  return {
    tiltX: event.tiltX,
    tiltY: event.tiltY,
    azimuthAngle,
    altitudeAngle,
    pressure: event.pressure
  };
} // `altitudeAngle` and `azimuthAngle` are experimental properties, which are not supported on Firefox and Safari.
// Given that, we use `tilt` properties and algorithm that converts one value to another.
//
// Source: https://w3c.github.io/pointerevents/#converting-between-tiltx-tilty-and-altitudeangle-azimuthangle


function tilt2spherical(tiltX, tiltY) {
  const tiltXrad = tiltX * Math.PI / 180;
  const tiltYrad = tiltY * Math.PI / 180; // calculate azimuth angle

  let azimuthAngle = 0;

  if (tiltX === 0) {
    if (tiltY > 0) {
      azimuthAngle = Math.PI / 2;
    } else if (tiltY < 0) {
      azimuthAngle = 3 * Math.PI / 2;
    }
  } else if (tiltY === 0) {
    if (tiltX < 0) {
      azimuthAngle = Math.PI;
    }
  } else if (Math.abs(tiltX) === 90 || Math.abs(tiltY) === 90) {
    // not enough information to calculate azimuth
    azimuthAngle = 0;
  } else {
    // Non-boundary case: neither tiltX nor tiltY is equal to 0 or +-90
    const tanX = Math.tan(tiltXrad);
    const tanY = Math.tan(tiltYrad);
    azimuthAngle = Math.atan2(tanY, tanX);

    if (azimuthAngle < 0) {
      azimuthAngle += 2 * Math.PI;
    }
  } // calculate altitude angle


  let altitudeAngle = 0;

  if (Math.abs(tiltX) === 90 || Math.abs(tiltY) === 90) {
    altitudeAngle = 0;
  } else if (tiltX === 0) {
    altitudeAngle = Math.PI / 2 - Math.abs(tiltYrad);
  } else if (tiltY === 0) {
    altitudeAngle = Math.PI / 2 - Math.abs(tiltXrad);
  } else {
    // Non-boundary case: neither tiltX nor tiltY is equal to 0 or +-90
    altitudeAngle = Math.atan(1.0 / Math.sqrt(Math.pow(Math.tan(tiltXrad), 2) + Math.pow(Math.tan(tiltYrad), 2)));
  }

  return {
    altitudeAngle: altitudeAngle,
    azimuthAngle: azimuthAngle
  };
} // If we are on a platform that doesn't support `tiltX` and `tiltY`, we have to calculate them from `altitude` and `azimuth` angles.
//
// Source: https://w3c.github.io/pointerevents/#converting-between-tiltx-tilty-and-altitudeangle-azimuthangle


function spherical2tilt(altitudeAngle, azimuthAngle) {
  const radToDeg = 180 / Math.PI;
  let tiltXrad = 0;
  let tiltYrad = 0;

  if (altitudeAngle === 0) {
    // the pen is in the X-Y plane
    if (azimuthAngle === 0 || azimuthAngle === 2 * Math.PI) {
      // pen is on positive X axis
      tiltXrad = Math.PI / 2;
    }

    if (azimuthAngle === Math.PI / 2) {
      // pen is on positive Y axis
      tiltYrad = Math.PI / 2;
    }

    if (azimuthAngle === Math.PI) {
      // pen is on negative X axis
      tiltXrad = -Math.PI / 2;
    }

    if (azimuthAngle === 3 * Math.PI / 2) {
      // pen is on negative Y axis
      tiltYrad = -Math.PI / 2;
    }

    if (azimuthAngle > 0 && azimuthAngle < Math.PI / 2) {
      tiltXrad = Math.PI / 2;
      tiltYrad = Math.PI / 2;
    }

    if (azimuthAngle > Math.PI / 2 && azimuthAngle < Math.PI) {
      tiltXrad = -Math.PI / 2;
      tiltYrad = Math.PI / 2;
    }

    if (azimuthAngle > Math.PI && azimuthAngle < 3 * Math.PI / 2) {
      tiltXrad = -Math.PI / 2;
      tiltYrad = -Math.PI / 2;
    }

    if (azimuthAngle > 3 * Math.PI / 2 && azimuthAngle < 2 * Math.PI) {
      tiltXrad = Math.PI / 2;
      tiltYrad = -Math.PI / 2;
    }
  }

  if (altitudeAngle !== 0) {
    const tanAlt = Math.tan(altitudeAngle);
    tiltXrad = Math.atan(Math.cos(azimuthAngle) / tanAlt);
    tiltYrad = Math.atan(Math.sin(azimuthAngle) / tanAlt);
  }

  const tiltX = Math.round(tiltXrad * radToDeg);
  const tiltY = Math.round(tiltYrad * radToDeg);
  return {
    tiltX,
    tiltY
  };
}

const RNSVGElements = ['Circle', 'ClipPath', 'Ellipse', 'ForeignObject', 'G', 'Image', 'Line', 'Marker', 'Mask', 'Path', 'Pattern', 'Polygon', 'Polyline', 'Rect', 'Svg', 'Symbol', 'TSpan', 'Text', 'TextPath', 'Use']; // This function helps us determine whether given node is SVGElement or not. In our implementation of
// findNodeHandle, we can encounter such element in 2 forms - SVG tag or ref to SVG Element. Since Gesture Handler
// does not depend on SVG, we use our simplified SVGRef type that has `elementRef` field. This is something that is present
// in actual SVG ref object.
//
// In order to make sure that node passed into this function is in fact SVG element, first we check if its constructor name
// corresponds to one of the possible SVG elements. Then we also check if `elementRef` field exists.
// By doing both steps we decrease probability of detecting situations where, for example, user makes custom `Circle` and
// we treat it as SVG.

function isRNSVGElement(viewRef) {
  const componentClassName = Object.getPrototypeOf(viewRef).constructor.name;
  return RNSVGElements.indexOf(componentClassName) >= 0 && Object.hasOwn(viewRef, 'elementRef');
}
//# sourceMappingURL=utils.js.map