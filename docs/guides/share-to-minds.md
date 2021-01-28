---
id: share-to-minds
title: Share to Minds
---

If you wish to add a Minds share button to your website, see the example below.

HTML

```html
<a
  class="minds-share-button"
  target="_blank"
  title="Share to Minds"
  href="https://www.minds.com/newsfeed/subscribed?intentUrl=[YOUR ENCODED URL GOES HERE]"
>
  <img
    src="https://cdn-assets.minds.com/front/dist/en/assets/logos/bulb.svg"
    alt="Minds"
    height="40"
  />
</a>
```

CSS

```css
.minds-share-button {
  display: block;
  max-width: 50px;
  max-height: 60px;
  padding: 10px 5px 5px;
  text-align: center;
  background-color: #242a30;
  border: 1px solid #414c57;
  border-radius: 3px;
  box-shadow: 5px 5px 8px -4px rgba(0, 0, 0, 0.4);
}
```

This will create a button that looks like this:

![Share button](assets/share-to-minds-button.png 'Example share button')

We are using `bulb.svg` for our logo image source in this example, though if it doesn't match the styles of your existing social share buttons, you might choose to use a different logo image from our [assets folder](https://gitlab.com/minds/front/-/tree/master/src/assets/logos) instead.

### Formatting your url

Notice that the `href` above points to a url with the following syntax:

```
https://www.minds.com/newsfeed/subscribed?intentUrl=[YOUR ENCODED URL GOES HERE]
```

This will open a Minds page with a post composer that is pre-populated with the link of your choice.

> Note: Ensure your url is URI encoded by running it through `encodeURI()` before appending it to the Minds link
