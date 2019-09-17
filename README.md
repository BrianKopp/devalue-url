# Devalue URl

[![Actions Status](https://github.com/briankopp/devalue-url/workflows/npmpublish/badge.svg)](https://github.com/briankopp/devalue-url/actions)

Friendly, typed package used to strip values out of URLs, leaving only the
URL template, as it might appear in an express app, for example.

## Installing

`npm install devalue-url`

## Usage

```js
import { UrlDevaluer } from 'devalue-url';
const urlDevaluer = new UrlDevaluer();
urlDevaluer.devalueUrl('www.example.com/hello/123');
// www.example.com/hello/:intId
```

### Custom Patterns

```js
import { UrlDevaluer } from 'devalue-url';
const urlDevaluer = new UrlDevaluer({
    extraTemplatePatterns: {
        'abcReplacementName': RegExp('abc'),
        'defReplacementName': 'def'
    }
});
urlDevaluer.devalueUrl('www.example.com/hello/abc/def');
// www.example.com/hello/:abcReplacementName/:defReplacementName
```

## Local Setup

```bash
git clone https://github.com/briankopp/devalue-url
cd devalue-url
npm install
npm run build
npm run test
```
