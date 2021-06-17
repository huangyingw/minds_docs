---
id: mobile-styling
title: Mobile Styles and Themes
---

For styling and theme support we use the **ThemedStyles** service. This service provides some frequently used styles, for common layouts, colors, font size, and spacing (padding and margin).

## Using styles
```js
<Text style={ThemedStyles.style.colorWhite} />
<Text style={ThemedStyles.style.colorPrimaryText} />
```


## Combining styles

Before diving into the different styles that the service provides, it is important to understand how to combine them, that it returns a `stable` reference to the styles, and the implications of this.

### Combine

With the method **combine** you can merge many styles into one.

#### Standard styles

```js
const fontStyle = ThemedStyle.combine('colorWhite', 'fontXL', 'marginTop');
```

#### Custom styles

```js
const myStyle = ThemedStyle.combine(
  { heigh: 20 },
  'flexContainer',
  'marginTop',
  'bgBlack'
);
```

### Stable reference to styles

> ThemedStyles returns always a stable reference to the styles, this allows you to use a "global" defined style for a component and still be able to switch themes in runtime. It is optimum because you share the same style with all the instances of the component and you ensure that you are sending always the same style object (preventing unneeded re-renders).

```js
function MyText() {
  return <Text style={fontStyle}>Title</Text>;
}

const fontStyle = ThemedStyle.combine(
  'colorPrimaryText',
  'fontXL',
  'marginTop'
);
```

### useStyle hook

If you need a style based on a runtime value you can use the **useStyle** hook.

```js
function MyText() {
  const inset = useSafeAreaInsets();
  const fontStyle = useStyle('colorPrimaryText', 'fontXL', {
    paddingTop: inset.top,
  });
  return <Text style={fontStyle}>Title</Text>;
}
```

It returns a stable reference to the style object but in this case you will have one style for each instance of the component.

## Styles
### Colors

You can use colors for text, backgrounds, borders and shadows using the following style format:

#### Text

`color[ColorName]`

```js
<Text style={ThemedStyles.style.colorWhite} />
```

#### Background

`bg[ColorName]`

```js
<View style={ThemedStyles.style.bgPrimaryBackground} />
```

#### Border

`bg[ColorName]`

```js
<View style={ThemedStyles.style.bcolorLink} />
```

#### Shadow

`bg[ColorName]`

```js
<View style={ThemedStyles.style.shadowLink} />
```

> You can check the available colors or add new ones on `src/styles/Colors.ts`.

### Spacing

For spacing you can use the margin and padding styles with the following format:

`margin(Top|Bottom|Right|Left|Vertical|Horizontal)(n)x`
`padding(Top|Bottom|Right|LeftVertical|Horizontal)(n)x`

Eg:
| Style | |
|-------------------|---------------------------------------------|
| padding | padding of 5
| margin | margin of 5
| padding2x | padding of 10
| margin4x | margin of 20
| marginTop4x | margin of 20 to top the view
|paddingVertical2x | padding of 10 into the top and bottom
|paddingHorizontal | padding of 5 into left and right

```js
function MyComponent(props) {
  return (
    <View style={containerStyle}>
      <Text style={ThemedStyle.style.marginTop}>{user.me.name}</Text>
      <Text style={ThemedStyle.style.marginTop}>{user.me.username}</Text>
    </View>
  );
}

const containerStyle = ThemedStyle.combine('paddingTop2x', 'marginHorizontal');
```

> For now it uses a multiple of 5 but we will introduce a multiplier based on the screen size.

### Border
The border styles have the following format:
`border(Top|Bottom|Left|Right|Radius)(n)x`


Eg:
```js
function MyComponent(props) {
  return (
    <View style={containerStyle}/>
  );
}

const containerStyle = ThemedStyle.combine('borderTop', 'borderBottom5x', 'borderRadius3x');
```

For hair width: **borderHair**, **borderLeftHair**, **borderRightHair**, **borderTopHair** **borderTopHair**

### Sizes
For width and height percentage you can use the following styles
`fullWidth` `halfWidth` `fullHeight` `halfHeight`

or

`width(n)` `height(n)`

Eg:
```js
function MyComponent(props) {
  return (
    <View style={ThemedStyle.style.width35}/> // width: 35%
    <View style={ThemedStyle.style.height56}/> // height: 56%
    <View style={ThemedStyle.style.fullWidth}/> // width: 100%
    <View style={ThemedStyle.style.fullHeight}/> // height: 100%
  );
}
```
### Font

You can use the following normalized font style for size and weight

#### Sizing

Normalized font size: **fontS` `fontXS` `fontM` `fontL` `fontXL` `fontXXL` `fontXXXL`

#### Weight

Normalized font weight: `fontHairline` `fontThin` `fontLight` `fontNormal` `fontMedium` `fontSemibold` `fontBold`

#### Align

Normalized font weight: `textRight` `textLeft` `textCenter` `textJustify`

#### Other

`strikeThrough`

```js
function MyComponent() {
  return <Text style={fontStyle}>Title</Text>;
}

const fontStyle = ThemedStyle.combine('fontL', 'fontLight', 'colorWhite', 'textCenter');
```

### Layout

Usually, you will use custom styles in your component to define the main layout, but there are some commonly used layout styles that are available for you in the themed styles service.

Eg:
| Style |
|-------------------|
|flexContainer |
|flexContainerCenter |
|flexColumn |
|flexColumnCentered |
|rowJustifyEnd |
|rowJustifyCenter |
|rowJustifySpaceEvenly |
|rowJustifyStart |
|rowJustifySpaceBetween |
|rowStretch |
|justifyCenter |
|justifyEnd |
|alignCenter |
|alignEnd |
|alignSelfEnd |
|alignSelfStart |
|alignSelfCenter |
|centered |
|positionAbsolute |
|positionAbsoluteTopLeft |
|positionAbsoluteTopRight |
|positionAbsoluteBottomLeft |
|positionAbsoluteBottomRight |

> Although the styles for colors, borders, spacing and sizes are dynamically generated they are validated using typescript

## Creating Styled Components
Using the **useStyleFromProps** hook you can easily create component that generate styles from their properties

```js
function MyText(props) {
    const style = useStyleFromProps(props);
    return <Text style={style}>{children}</Text>
}

<MyText colorWhite bgBlack fontXL marginTop2x>
<MyText colorWhite bgBlack fontXL marginTop="2x">
```
Any available style from the ThemedStyle service can be used here.

> Keep in mind that this is only syntax sugar for the **useStyle** hook. Defining the styles as a global constant is more optimal for components that are repeated many times (like list items for example)


## Extending

The dynamic styles are implemented using a Proxy that creates the required styles on-demand. For this it use `generators` functions that convert a style name into a react-native style. Currently we have generators for `spacing`, `colors`, `sizes`, and `borders`.

These generators are located on `styles/generators/` folder and they are called from the proxy handler.