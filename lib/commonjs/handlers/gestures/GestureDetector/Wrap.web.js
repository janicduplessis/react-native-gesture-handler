"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimatedWrap = exports.Wrap = void 0;

var _react = _interopRequireWildcard(require("react"));

var _utils = require("../../../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrap = /*#__PURE__*/(0, _react.forwardRef)(({
  children
}, ref) => {
  try {
    // I don't think that fighting with types over such a simple function is worth it
    // The only thing it does is add 'collapsable: false' to the child component
    // to make sure it is in the native view hierarchy so the detector can find
    // correct viewTag to attach to.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = _react.default.Children.only(children);

    const clone = /*#__PURE__*/_react.default.cloneElement(child, {
      collapsable: false
    }, // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    child.props.children);

    return /*#__PURE__*/_react.default.createElement("div", {
      ref: ref,
      style: {
        display: 'contents'
      }
    }, clone);
  } catch (e) {
    throw new Error((0, _utils.tagMessage)(`GestureDetector got more than one view as a child. If you want the gesture to work on multiple views, wrap them with a common parent and attach the gesture to that view.`));
  }
}); // On web we never take a path with Reanimated,
// therefore we can simply export Wrap

exports.Wrap = Wrap;
const AnimatedWrap = Wrap;
exports.AnimatedWrap = AnimatedWrap;
//# sourceMappingURL=Wrap.web.js.map