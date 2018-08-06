# webvsc-ui

[![npm](https://flat.badgen.net/npm/license/@visbot/webvsc-ui)](https://www.npmjs.org/package/@visbot/webvsc-ui)
[![npm](https://flat.badgen.net/npm/v/@visbot/webvsc-ui)](https://www.npmjs.org/package/@visbot/webvsc-ui)
[![Travis CI](https://flat.badgen.net/travis/idleberg/webvsc-ui/gh-pages)](https://travis-ci.org/idleberg/webvsc-ui)
[![David](https://flat.badgen.net/david/dep/idleberg/webvsc-ui)](https://david-dm.org/idleberg/webvsc-ui)
[![David](https://flat.badgen.net/david/dev/idleberg/webvsc-ui)](https://david-dm.org/idleberg/webvsc-ui?type=dev)

## Description

Web frontend for [webvsc](https://www.npmjs.com/package/@visbot/webvsc), a converter for [Winamp AVS](http://www.wikiwand.com/en/Advanced_Visualization_Studio) presets.

[Demo Time](https://idleberg.github.io/webvsc-ui/) 🙌

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the mode

```sh
yarn add @visbot/webvsc-ui || npm install @visbot/webvsc-ui
```

## Usage

Embedding the converter into a website is easy

```html
<head>
    <!-- Import the style-sheet -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@visbot/webvsc-ui@latest/dist/webvsc-ui.css">
</head>
<body>
    <!-- Add a droparea -->
    <div id="drop-area"></div>

    <!-- Import the script -->
    <script src="https://cdn.jsdelivr.net/npm/@visbot/webvsc-ui@latest/dist/webvsc-ui.js"></script>

    <!-- Initialize the script -->
    <script>
      var ui = new Webvsc(document.getElementById('drop-area'));
    </script>
</body>
</html>
```

#### Options

Pass options in an object to configure the appearance

```js
var element = document.getElementById('drop-area');
var options = {
  innerHTML: "<p>Drop it like it's hot</p>",
  width: '800px',
  height: '600px'
};

var ui = new Webvsc(element, options);
```

#### Parameters

Advanced users can tweak some of the defaults using URL parameters

URL Parameter | Description
--------------|-----------------------------
`verbose=<n>` | adjust output level (0-2)
`level=<n>`   | adjust ZIP compression (0-9)
`minify`      | minify output JSON

## Support

The converter has been only been tested on most recent browsers at the time of its first release. These include the following, but might extend to older versions.

Browser                      | Known Issues
-----------------------------|----------------------------
💀 Android Browser (Nougat)  | fails to upload
💯 Chrome 62                 | -
💯 Firefox 56                | -
💀 Edge (Windows 10.0.15063) | fails on upload
💯 Opera 49                  | -
💯 Safari 11                 | -
🤔 Mobile Chrome 62          | single upload
🤔 Mobile Safari (iOS 11)    | single upload, saves ZIP as `untitled.zip`
💯 Vivaldi 1.12              | -

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
