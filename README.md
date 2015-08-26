fslog - a light node.js logging API 
===========================

Unlike `console.log`, `fslog` output message to both log files and stdout. Also, `fslog` automatically performs log rotation to remove outdated logs.

Install with:

    npm install fslog 

## Usage

Simple example

```js
    // Apply default setting of fslog
    var fslog = require("fslog")(),

    // Use fslog.log like console.log
    // Not support format specifier (such as %s, %d ...)
    var obj = {a:1};
    var arr = [1,'2',3];
    var num = 1;
    var str = '1'
    fslog.log(str,num,arr,obj);
```

This will display:

    1 '1' [ 1, '2', 3 ] { a: 1 }

Note that the API is entire asynchronous. To get data back from the server,
you'll need to use a callback. The return value from most of the API is a
backpressure indicator.

### 

## Configurations 

### "namespace"
### "retention"
### "logdir"
### "logname"

## Contributors
Bo-Han Wu (researchgary@gmail.com)

## LICENSE - "MIT License"

Copyright (c) 2010 Matthew Ranney, http://ranney.com/

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
