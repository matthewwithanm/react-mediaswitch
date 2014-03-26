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
var MediaSwitch, PropTypes, React, cloneWithProps, div,
  __hasProp = {}.hasOwnProperty;

React = (window.React);

cloneWithProps = (window.React).addons.cloneWithProps;

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
      mediaQueryLists: this.getMqls()
    };
  },
  getMqls: function() {
    var mcase, media, mql, mqls, _i, _len, _ref;
    mqls = {};
    _ref = this.props.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mcase = _ref[_i];
      media = mcase.props.media;
      if (!media) {
        throw new Error('Missing media prop');
      }
      if (mqls[media] == null) {
        mql = typeof window !== "undefined" && window !== null ? typeof window.matchMedia === "function" ? window.matchMedia(media) : void 0 : void 0;
        mqls[media] = mql || false;
      }
    }
    return mqls;
  },
  handleMqlChange: function() {
    return this.forceUpdate();
  },
  componentDidMount: function() {
    this.addMqlListeners(this.state.mediaQueryLists);
    return this.forceUpdate();
  },
  componentDidUpdate: function(prevProps, prevState) {
    var newMqls, oldMqls;
    oldMqls = prevState.mediaQueryLists;
    newMqls = this.state.mediaQueryLists;
    if (oldMqls !== newMqls) {
      this.removeMqlListeners(oldMqls);
      this.addMqlListeners(newMqls);
    }
    if (prevProps.children !== this.props.children) {
      return this.setState({
        mediaQueryLists: this.getMqls()
      });
    }
  },
  removeMqlListeners: function(mqls) {
    var media, mql;
    for (media in mqls) {
      if (!__hasProp.call(mqls, media)) continue;
      mql = mqls[media];
      if (mql) {
        mql.removeListener(this.handleMqlChange);
      }
    }
  },
  addMqlListeners: function(mqls) {
    var media, mql;
    for (media in mqls) {
      if (!__hasProp.call(mqls, media)) continue;
      mql = mqls[media];
      if (mql) {
        mql.addListener(this.handleMqlChange);
      }
    }
  },
  getMatchingCase: function() {
    var defaultCase, isMounted, matchingCase, mcase, _i, _len, _ref, _ref1;
    defaultCase = null;
    matchingCase = null;
    isMounted = this.isMounted();
    _ref = this.props.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mcase = _ref[_i];
      if (mcase.props.initial && !isMounted) {
        return mcase;
      }
      if ((_ref1 = this.state.mediaQueryLists[mcase.props.media]) != null ? _ref1.matches : void 0) {
        if (isMounted) {
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

},{}],3:[function(_dereq_,module,exports){
var MediaCase, MediaSwitch;

MediaSwitch = _dereq_('./MediaSwitch');

MediaCase = _dereq_('./MediaCase');

module.exports = {
  MediaSwitch: MediaSwitch,
  MediaCase: MediaCase
};

},{"./MediaCase":1,"./MediaSwitch":2}]},{},[3])
(3)
});