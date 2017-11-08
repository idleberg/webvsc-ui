# webvsc-ui

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/release/idleberg/webvsc-ui.svg?style=flat-square)](https://github.com/idleberg/webvsc-ui/releases)
[![Travis CI](https://img.shields.io/travis/idleberg/webvsc-ui/gh-pages.svg?style=flat-square)](https://travis-ci.org/idleberg/webvsc-ui)
[![David](https://img.shields.io/david/idleberg/webvsc-ui.svg?style=flat-square)](https://david-dm.org/idleberg/webvsc-ui)
[![David](https://img.shields.io/david/dev/idleberg/webvsc-ui.svg?style=flat-square)](https://david-dm.org/idleberg/webvsc-ui?type=dev)

## Description

Web frontend for [webvsc](https://www.npmjs.com/package/@visbot/webvsc), a converter for [Winamp AVS](http://www.wikiwand.com/en/Advanced_Visualization_Studio) presets.

[Demo Time](https://idleberg.github.io/webvsc-ui/) 🙌

## Installation

```sh
# Clone repository
git clone https://github.com/idleberg/webvsc-ui && cd webvsc-ui

# Install dependencies
yarn || npm install

# Build
yarn build || npm run build

# Run server at localhost:8080
yarn start || npm start
```

*“That's all Folks!”*

## Usage

Point your browser to `http://localhost:8080` and upload presets. See the console output if you run into problems.

Advanced users can tweak some of the defaults using URL parameters:

URL Parameter | Description
--------------|-----------------------------
`verbose=<n>` | adjust output level (0-2)
`level=<n>`   | adjust ZIP compression (0-9)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
