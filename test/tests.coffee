{assert} = chai
{MediaSwitch, MediaCase} = mediaswitch

{span} = React.DOM


renderBad = -> (span null, 'bad')
renderGood = -> (span null, 'good')

describe 'react-mediaswitch', ->
  it 'should match the initial case', ->
    Test1 = React.createClass
      render: ->
        (MediaSwitch null,
          (MediaCase media: 'screen', handler: renderBad)
          (MediaCase media: 'screen', initial: true, handler: renderGood)
          (MediaCase media: 'tv', handler: renderBad)
        )
    assert.include React.renderComponentToString(Test1()), 'good'
    assert.notInclude React.renderComponentToString(Test1()), 'bad'

  it 'should use case children when present', ->
    Test1 = React.createClass
      render: ->
        (MediaSwitch null,
          (MediaCase media: 'screen', renderBad())
          (MediaCase media: 'screen', initial: true, renderGood())
          (MediaCase media: 'tv', renderBad())
        )
    assert.include React.renderComponentToString(Test1()), 'good'
    assert.notInclude React.renderComponentToString(Test1()), 'bad'
