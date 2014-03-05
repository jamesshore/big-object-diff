# Big Object Diff

Visualize the differences between large JavaScript objects.

This module provides the ability to compare large objects and output the results to the console. The main advantage of this module is that unchanged elements aren't displayed, making it suitable for comparing objects with hundreds of properties.

## Example output

```
{
  a: 99   // expected 1
  b: {
    // extra properties:
    b2: 3
  }
  // missing properties:
  c: 3
}
```

## API

### `renderDiff(expected, actual)`

Deep compare one object to another and return the differences as a formatted string, or "" if there are no differences.

### `render(obj)`

Render an object or other variable and return the result as a formatted string.

### `match(a, b)`

Deep compare two objects and return `true` if they are the same, `false` if not.


## Version History

* 0.6.0 renderDiff() collapses extra and missing properties when they're objects

* 0.5.0 Initial release

## License

The MIT License (MIT)

Copyright (c) 2012-2014 James Shore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

