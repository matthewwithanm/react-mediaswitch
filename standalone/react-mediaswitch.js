!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mediaswitch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var MediaCase, PropTypes, React, div;

React = (window.React);

PropTypes = React.PropTypes;

div = React.DOM.div;

MediaCase = React.createClass({
  displayName: 'MediaCase',
  getDefaultProps: function() {
    return {
      "default": false,
      initial: false
    };
  },
  propTypes: {
    media: PropTypes.string.isRequired,
    "default": PropTypes.bool,
    initial: PropTypes.bool,
    handler: PropTypes.func
  },
  render: function() {}
});

module.exports = MediaCase;

},{}],2:[function(_dereq_,module,exports){
var MediaSwitch, PropTypes, React, cloneWithProps, div, eq, extend,
  __hasProp = {}.hasOwnProperty;

React = (window.React);

cloneWithProps = (window.React).addons.cloneWithProps;

eq = _dereq_('./eq');

extend = _dereq_('xtend');

div = React.DOM.div;

PropTypes = React.PropTypes;

MediaSwitch = React.createClass({
  displayName: 'MediaSwitch',
  propTypes: {
    component: PropTypes.func.isRequired
  },
  getDefaultProps: function() {
    return {
      component: div
    };
  },
  getInitialState: function() {
    return {
      wasMounted: false,
      mediaMatches: {}
    };
  },
  componentWillMount: function() {
    return this.updateMqls();
  },
  updateMqls: function() {
    var listeners, mcase, media, mql, mqls, _i, _len, _ref;
    this.removeMqlListeners();
    mqls = {};
    listeners = [];
    _ref = this.props.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mcase = _ref[_i];
      media = mcase.props.media;
      if (!media) {
        throw new Error('Missing media prop');
      }
      if (mqls[media] == null) {
        if (mql = typeof window !== "undefined" && window !== null ? typeof window.matchMedia === "function" ? window.matchMedia(media) : void 0 : void 0) {
          mqls[media] = mql;
          mql.addListener(this.handleMqlChange);
        }
      }
    }
    this.mqls = mqls;
    return this.updateMediaMatches();
  },
  removeMqlListeners: function() {
    var media, mql, _ref;
    if (this.mqls) {
      _ref = this.mqls;
      for (media in _ref) {
        if (!__hasProp.call(_ref, media)) continue;
        mql = _ref[media];
        mql.removeListener(this.handleMqlChange);
      }
    }
  },
  setMqlState: function(media, matches) {
    var newValue;
    if (this.state.mediaMatches[media] !== matches) {
      newValue = extend(this.state.mediaMatches);
      newValue[media] = matches;
      return this.setState({
        mediaMatches: newValue
      });
    }
  },
  handleMqlChange: function(changedMql) {
    var media, mql, _ref;
    _ref = this.mqls;
    for (media in _ref) {
      if (!__hasProp.call(_ref, media)) continue;
      mql = _ref[media];
      if (mql.media === changedMql.media) {
        this.setMqlState(mql.media, mql.matches);
      }
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextProps.children !== this.props.children) {
      return true;
    }
    if (nextState.wasMounted !== this.state.wasMounted) {
      return true;
    }
    if (!eq(nextState.mediaMatches, this.state.mediaMatches)) {
      return true;
    }
    return false;
  },
  componentDidMount: function() {
    return this.setState({
      wasMounted: true
    });
  },
  componentWillUnmount: function() {
    return this.removeMqlListeners();
  },
  updateMediaMatches: function() {
    var media, mediaMatches, mql, _ref;
    mediaMatches = {};
    _ref = this.mqls;
    for (media in _ref) {
      if (!__hasProp.call(_ref, media)) continue;
      mql = _ref[media];
      mediaMatches[media] = mql.matches;
    }
    return this.setState({
      mediaMatches: mediaMatches
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.children !== this.props.children) {
      return this.updateMqls();
    }
  },
  getMatchingCase: function() {
    var defaultCase, matchingCase, mcase, wasMounted, _i, _len, _ref;
    defaultCase = null;
    matchingCase = null;
    wasMounted = this.state.wasMounted;
    _ref = this.props.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mcase = _ref[_i];
      if (mcase.props.initial && !wasMounted) {
        return mcase;
      }
      if (this.state.mediaMatches[mcase.props.media]) {
        if (wasMounted) {
          return mcase;
        } else {
          if (matchingCase == null) {
            matchingCase = mcase;
          }
        }
      }
      if (mcase.props["default"]) {
        defaultCase = mcase;
      }
    }
    return matchingCase || defaultCase;
  },
  render: function() {
    return this.props.component(null, this.renderChildren());
  },
  renderChildren: function() {
    var handler, mcase;
    mcase = this.getMatchingCase();
    handler = mcase.props.handler;
    if (handler) {
      return handler();
    } else {
      return mcase.props.children;
    }
  }
});

module.exports = MediaSwitch;

},{"./eq":3,"xtend":6}],3:[function(_dereq_,module,exports){
var kvPairsAreEqual,
  __hasProp = {}.hasOwnProperty;

kvPairsAreEqual = function(a, b) {
  var k, v;
  for (k in a) {
    if (!__hasProp.call(a, k)) continue;
    v = a[k];
    if (b[k] !== v) {
      return false;
    }
  }
  return true;
};

module.exports = function(a, b) {
  return kvPairsAreEqual(a, b) && kvPairsAreEqual(b, a);
};

},{}],4:[function(_dereq_,module,exports){
var MediaCase, MediaSwitch;

MediaSwitch = _dereq_('./MediaSwitch');

MediaCase = _dereq_('./MediaCase');

module.exports = {
  MediaSwitch: MediaSwitch,
  MediaCase: MediaCase
};

},{"./MediaCase":1,"./MediaSwitch":2}],5:[function(_dereq_,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],6:[function(_dereq_,module,exports){
var hasKeys = _dereq_("./has-keys")

module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        if (!hasKeys(source)) {
            continue
        }

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{"./has-keys":5}]},{},[4])
(4)
});