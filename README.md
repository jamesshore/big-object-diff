# Big Object Diff

A tool for visualizing the differences between large JavaScript objects.

This tool provides the ability to compare large objects and output the results to the console. The main difference between it and other tools is that:

1. It's rigorously tested.

2. Elements that haven't changed aren't displayed.

## Example output

```
{
  ...
  c: {
    ...
    c1: {
      ...
      c1d: [ 1, 2, 4 ]  // was [ 1, 2, 3 ]
      ...
    }
    ...
  }
  ...
}



## Version History

TBD

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

