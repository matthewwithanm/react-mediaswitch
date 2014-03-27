React = require 'react'
{addons: {cloneWithProps}} = require 'react/addons'
eq = require './eq'
extend = require 'xtend'

{div} = React.DOM
{PropTypes} = React


MediaSwitch = React.createClass
  displayName: 'MediaSwitch'

  propTypes:
    component: PropTypes.func.isRequired

  getDefaultProps: ->
    component: div

  getInitialState: ->
    wasMounted: false
    mediaMatches: {}

  componentWillMount: -> @updateMqls()

  # Update the MediaQueryLists for the component and their listeners.
  updateMqls: ->
    # Remove all existing listeners.
    @removeMqlListeners()

    mqls = {}
    listeners = []
    for mcase in @props.children
      {media} = mcase.props
      throw new Error 'Missing media prop' unless media
      unless mqls[media]?
        if mql = window?.matchMedia? media
          mqls[media] = mql
          mql.addListener @handleMqlChange
    @mqls = mqls

    # Since the MQLs have changed, we need to update their results.
    @updateMediaMatches()

  removeMqlListeners: ->
    if @mqls
      mql.removeListener @handleMqlChange for own media, mql of @mqls
    return

  # Update the state of a single media query, taking care to only call
  # `setState` if the value has changed. This allows us to avoid the check in
  # `shouldComponentUpdate` if there hasn't been a change.
  setMqlState: (media, matches) ->
    if @state.mediaMatches[media] isnt matches
      newValue = extend @state.mediaMatches
      newValue[media] = matches
      @setState mediaMatches: newValue

  handleMqlChange: (changedMql) ->
    # The MQL's `media` string isn't necessarily exactly what the user entered.
    # (For example, whitespace gets normalized.) So we find the matching *user*
    # media string by finding which one corresponds to an MQL that has a media
    # string that matches the changed MQL's. (We could probably compare the MQL
    # objects directly, but I'm not sure if there's a guarantee that it's the
    # same object.)
    for own media, mql of @mqls
      if mql.media is changedMql.media
        @setMqlState mql.media, mql.matches
    return

  shouldComponentUpdate: (nextProps, nextState) ->
    return true if nextProps.children isnt @props.children
    return true if nextState.wasMounted isnt @state.wasMounted
    return true unless eq nextState.mediaMatches, @state.mediaMatches
    return false

  componentDidMount: ->
    # Since the chosen case depends on whether the component was mounted (see
    # `MediaCase.props.initial`), we update the state to reflect that it's been
    # mounted.
    @setState wasMounted: true

  componentWillUnmount: -> @removeMqlListeners()

  # Update this.state.mediaMatches
  updateMediaMatches: ->
    mediaMatches = {}
    for own media, mql of @mqls
      mediaMatches[media] = mql.matches
    @setState {mediaMatches}

  componentDidUpdate: (prevProps, prevState) ->
    # If the children changed, we need to update our media query lists.
    if prevProps.children isnt @props.children then @updateMqls()

  # Determine the matching MediaCase based on the current state of the
  # component.
  getMatchingCase: ->
    defaultCase = null
    matchingCase = null
    wasMounted = @state.wasMounted
    for mcase in @props.children
      if mcase.props.initial and not wasMounted then return mcase
      if @state.mediaMatches[mcase.props.media]
        if wasMounted then return mcase
        else matchingCase ?= mcase # We need to wait to see if we find an initial case.
      if mcase.props.default then defaultCase = mcase
    matchingCase or defaultCase

  render: -> @props.component null, @renderChildren()
  renderChildren: ->
    mcase = @getMatchingCase()
    handler = mcase.props.handler
    if handler then handler() else mcase.props.children


module.exports = MediaSwitch
