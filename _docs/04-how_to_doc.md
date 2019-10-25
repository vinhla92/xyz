---
title: How to Document
subtitle: This document covers the Introduction of Creating Documentation
author: rob
tags: [root]
layout: root.html
---

## Pre-Requirements

Please ensure you have [ruby](https://www.ruby-lang.org/en/downloads/) installed on your local development enviornment. And that you have bundler installed

```bash
$ gem install bundler
```

## Installation

Install the dependencies with [Bundler](http://bundler.io/):

```bash
bundle install
```
## Development

Install [UIkit](https://getuikit.com/) font end framework dependency via Npm:
```bash
npm install
```
Run the following to generate to serve your site locally:
```bash
bundle exec jekyll serve
```

Run the following to generate the sites static files:
```bash
bundle exec jekyll build
```

## Key Concepts

### Liquid Templating

Jekyll uses the Liquid templating language to process templates.

Generally in Liquid you output content using two curly braces e.g. '{'{ variable }'}' and perform logic statements by surrounding them in a curly brace percentage sign e.g. '{'% if statement %'}' '{'% endif %'}'.

### Front Matter

Front Matter is what we use to give different .md files their properties for the liquid templates to make us of. 
The different kinds of front matter properties are the following:

```yml
---
title: Title
subtitle: Subtitle,
,
layout: doc
tags: [featured, development, bugs, etc]
author: author
---
```


### Creating a Developer Docs Post

To create new developer doc post entries in `_docs` folder, you would create a .md file with the following front matter settings: 

```yml
---
title: Title
subtitle: Subtitle
tags: [featured, development]
author: author
---
```

### Developer Docs Sidebar Navigation

Sidebar navigation on docs post can edited in `_data/navigation_docs.yml`:

```yml
- title: Getting Started    # Section title
  docs:
  - home                    # Doc file name from _docs folder
  - quickstart
  - installation
  - windows
```

### Creating a Infrastructure Docs Post

To create new infrastructure doc post entries in `_Infrastructure` folder, you would create a .md file with the following front matter settings: 

```yml
---
title: Title
subtitle: Subtitle
layout: infrastructure
tags: [featured, development]
author: author
---
```

### Infrastructure Docs Sidebar Navigation

Sidebar navigation on Infrastructure docs post can edited in `_data/navigation_infrastructure.yml`:

```yml
- title: Deployments
  docs:
  - deployments/now
  - deployments/aws
  - deployments/ubuntu
```