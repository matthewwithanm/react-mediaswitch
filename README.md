react-mediaswitch
=================

Choose your DOM based on media queries


```
<MediaSwitch>
  <MediaCase media="screen and (max-width: 400px)">
    <div>So tiny!</div>
  </MediaCase>
  <MediaCase media="screen and (max-width: 800px)" default={true}>
    <div>A little bigger</div>
  </MediaCase>
  <MediaCase media="screen and (min-width: 800px)">
    <div>So big!</div>
  </MediaCase>
</MediaSwitch>
```

Mark a default case for environments that don't support [matchMedia]:

```
<MediaCase ... default={true}>
  ...
</MediaCase>
```

Using server rendering? Mark a case as "initial":

```
<MediaCase ... initial={true}>
  ...
</MediaCase>
```

You can also provide a `handler` to cases instead of children:

```
<MediaSwitch>
  <MediaCase media="screen and (max-width: 400px)" handler={SmallThing} />
  <MediaCase media="screen and (max-width: 800px)" handler={MediumThing} default={true} />
  <MediaCase media="screen and (min-width: 800px)" handler={BigThing} />
</MediaSwitch>
```

Handlers can be React classes or any function that returns a component.


[matchMedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia
