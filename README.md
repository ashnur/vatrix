vatrix
======


#**UNDER HEAVY DEVELOPMENT. NOT FINISHED and NOT USABLE** (yet :)

vectors, matrices and vatrices. :D


inspiration [WildLinAlg26: Change of basis and Taylor coefficient vectors](http://www.youtube.com/watch?v=iz41Ut-ffJ0)

## Why
There isn't a good, performant vectorn, matrixn library for javascript. And I need it.

## Example

The goal is to have a conviently usable general vector tool. This means that some of the functions can take arguments with various types.

I've decided not to check for arguments which doesn't make sense (like providing numbers instead of arrays to vectorAddition()).
If you get exceptions complaining about something related to arrays, chances are you've given a number somewhere where it doesn't make sense.

### Scalar multiplication


```javascript
var vatrix = require('vatrix');

vatrix.vectorMultiply([1,3,5,7,11,13], 13); //[13,39,65,91,143,169]


```

For more examples, see tests/vatrix-test.js.

## Install

### npm

```bash
npm install vatrix
```

### browser

Download src/delve.js, and include it as a script tag.

