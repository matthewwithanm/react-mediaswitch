React = require 'react'

{PropTypes} = React
{div} = React.DOM


MediaCase = React.createClass
  displayName: 'MediaCase'
  getDefaultProps: ->
    default: false
    initial: false
  propTypes:
    media: PropTypes.string.isRequired
    default: PropTypes.bool
    initial: PropTypes.bool
    handler: PropTypes.func
  render: ->
    # This isn't actually used. Since I don't want to limit MediaCases to a
    # single child or to wrap them in a wrapper (and `render()` can't return an
    # array), MediaSwitch just "steals" the children. Basically, MediaCase isn't
    # used as a component at all, but rather an argument list for MediaSwitch.
    # We could pass these as a prop other than children, but we want to take
    # advantage of the pretty syntax JSX gives us for children.

module.exports = MediaCase
