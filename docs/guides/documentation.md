---
id: documentation
title: Documentation
---

The source code for this site can be found at the [Docs and Developer Site repository](https://gitlab.com/minds/docs).

## Get started in 5 minutes

1. Make sure all the dependencies for the website are installed. In `docs/website/`:

```sh
# Install dependencies
$ yarn
```

2. Run your dev server:

```sh
# Start the site
$ yarn start
```

## Documentation is the single source of truth (SSOT)

The docs are the SSOT for information about how to configure, use, and troubleshoot Minds products and features.

### Docs-first methodology

- If the answer to a question exists in documentation, share the link to the docs instead of rephrasing the information.

- When you encounter new information not available in GitLab’s documentation (for example, when working on a support case or testing a feature), your first step should be to create a merge request to add this information to the docs. You can then share the MR in order to communicate this information.

### Link instead of summarize

There is a temptation to summarize the information on another page. This will cause the information to live in two places. Instead, link to the SSOT and explain why it is important to consume the information.

## Formatting

Use [GitHub flavored markdown](https://help.github.com/en/articles/basic-writing-and-formatting-syntax).

#### Headers

The largest tier of headers should have _two_ hashes, e.g. `## My h1 primary header`. If you use one hash, it won't work with the navigation sidebar.

Only capitalize the _first letter_ of your header, unless it includes a proper noun:

- `### My cool subheader with many words`
- `### My cool Minds subheader that contains a proper noun`

## Adding images

- Add the image file to `docs/assets/`
- Add a "Click to enlarge" link below images that depict small details/text

```md
![My cool diagram](assets/my-cool-diagram.png "My cool diagram's alt text")
[Click to enlarge](assets/my-cool-diagram.png)
```

## Editing an existing docs page

Edit by clicking the "edit" button at the top of the docs site page, or by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

For more information about docs, click [here](https://docusaurus.io/docs/en/navigation)

## Editing an existing blog post

Edit blog posts by clicking the "edit" button at the top of the docs site page, or by navigating to `website/blog` and editing the corresponding post:

`website/blog/post-to-be-edited.md`

```markdown
---
id: post-needs-edit
title: This Blog Post Needs To Be Edited
---

Edit me...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

## Adding Content

### Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

2. Refer to that doc's ID in an existing sidebar in `website/sidebars.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
{
  "docs": {
    "Getting Started": [
      "quick-start",
      "newly-created-doc" // new doc here
    ],
    ...
  },
  ...
}
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)

### Adding a new blog post

1. Make sure there is a header link to your blog in `website/siteConfig.js`:

`website/siteConfig.js`

```javascript
headerLinks: [
    ...
    { blog: true, label: 'Blog' },
    ...
]
```

2. Create the blog post with the format `YYYY-MM-DD-My-Blog-Post-Title.md` in `website/blog`:

`website/blog/2018-05-21-New-Blog-Post.md`

```markdown
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: New Blog Post
---

Lorem Ipsum...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

### Adding items to the top navigation bar

1. Add links to docs, custom pages or external links by editing the headerLinks field of `website/siteConfig.js`:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    /* you can add docs */
    { doc: 'my-examples', label: 'Examples' },
    /* you can add custom pages */
    { page: 'help', label: 'Help' },
    /* you can add external links */
    { href: 'https://github.com/facebook/Docusaurus', label: 'GitHub' },
    ...
  ],
  ...
}
```

For more information about the navigation bar, click [here](https://docusaurus.io/docs/en/navigation)

### Adding custom pages

1. Docusaurus uses React components to build pages. The components are saved as .js files in `website/pages/en`:
1. If you want your page to show up in your navigation header, you will need to update `website/siteConfig.js` to add to the `headerLinks` element:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    { page: 'my-new-custom-page', label: 'My New Custom Page' },
    ...
  ],
  ...
}
```

For more information about custom pages, click [here](https://docusaurus.io/docs/en/custom-pages).

## Full docusaurus documentation

Full documentation can be found on the [docusaurus website](https://docusaurus.io/).

## Credits

A portion of this guide's content is taken from GitLab's excellent [documentation styleguide](https://git.causal.ch/help/development/documentation/styleguide.md).
