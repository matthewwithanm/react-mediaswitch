React = require 'react'
{addons: {cloneWithProps}} = require 'react/addons'

{div} = React.DOM
{PropTypes} = React


MediaSwitch = React.createClass
  displayName: 'MediaSwitch'
  propTypes:
    component: PropTypes.func.isRequired
  getDefaultProps: ->
    component: div
  getInitialState: ->
    mediaQueryLists: @getMqls()
  getMqls: ->
    mqls = {}
    for mcase in @props.children
      {media} = mcase.props
      throw new Error 'Missing media prop' unless media
      unless mqls[media]?
        mql = window?.matchMedia? media
        mqls[media] = mql or false # Store false as a flag to not try again
    mqls
  handleMqlChange: ->
    # TODO: Debounce?
    @forceUpdate()
  componentDidMount: ->
    @addMqlListeners @state.mediaQueryLists
    @forceUpdate()
  componentDidUpdate: (prevProps, prevState) ->
    oldMqls = prevState.mediaQueryLists
    newMqls = @state.mediaQueryLists

    # If the media queries changed, we need to update our listeners.
    if oldMqls isnt newMqls
      @removeMqlListeners oldMqls
      @addMqlListeners newMqls

    # If the children changed, we need to update our media query lists.
    if prevProps.children isnt @props.children
      @setState mediaQueryLists: @getMqls()
  removeMqlListeners: (mqls) ->
    mql.removeListener @handleMqlChange for own media, mql of mqls when mql
    return
  addMqlListeners: (mqls) ->
    mql.addListener @handleMqlChange for own media, mql of mqls when mql
    return
  getMatchingCase: ->
    defaultCase = null
    matchingCase = null
    isMounted = @isMounted()
    for mcase in @props.children
      if mcase.props.initial and not isMounted then return mcase
      if @state.mediaQueryLists[mcase.props.media]?.matches
        if isMounted then return mcase
        else matchingCase ?= mcase # We need to wait to see if we find an initial case.
      if mcase.props.default then defaultCase = mcase
    matchingCase or defaultCase
  render: -> @props.component null, @renderChildren()
  renderChildren: ->
    mcase = @getMatchingCase()
    handler = mcase.props.handler
    if handler then handler() else mcase.props.children


module.exports = MediaSwitch
