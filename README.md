fslog - a light node.js logging API 
===========================

Unlike `console.log`, `fslog` output message to both log files and stdout. Also, `fslog` automatically performs log rotation to remove outdated logs.

Install with:

    npm install fslog 

## Usage

A simple example to use `fslog.log`.

```js
    // Apply default settings of fslog
    var fslog = require("fslog")();

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

A log file with date-formatted name will be generated. For example, file `20150803.0` is generated. Its content will be:

    1 '1' [ 1, '2', 3 ] { a: 1 }

A simple example to use `fslog.debuglog`.

```js
    // Apply user-specified settings of fslog
    // Log messages only when environment variable `NODE_DEBUG` contains `example`.
    // Automatically remove logs of seven days before.
    // Logs will be put under the directory `logs`.
    // The prefix of each log file will be `exampleLog`.
    var fslog = require("fslog")({
      section: 'example',
      retentionCheck: true, 
      retentionMinutes: 60*24*7,
      logdir: 'logs',
      logname: 'exampleLog'
    });

    // Use `fslog.debuglog` like `util.debuglog`
    // Do log messages only when environment variable `NODE_DEBUG` contains `example`. 
    fslog.debuglog(str,num,arr,obj);
```

# API
## log
   Interface is similar to `console.log`. It write logs to both files and stdout.

## debuglog
   Interface is similar to `util.debuglog`. If a `NODE_DEBUG` environment variable matches the specified section, it will write logs to files and stdout. If not, it is a no-op function.

## destroy
   This will destroy automatical log removal processes.

## Configurations 

Configurations can be passed by the following way:
```js
   var config = {section:'example'};
   var fslog = require('fslog')(config);     
```

Available fields of configuration are listed as follows.

### "section"
   Specify a section for `fslog.debuglog` to conditionally writes logs and stdout. 
   If this is not specified, `fslog.debug` is a no-op function.
   Default: ''

### "retentionCheck"
   If true, periodically remove expired logs.
   If false, logs will be kept forever.
   Default: false 

### "retentionMinutes"
   Specify the lifetime to keep each log. Unit is in `minutes`.
   This takes effect when `retention` is set to true.
   Default: 60*24*7 minutes (7 days)

### "retentionCheckInterval"
   Specify the interval to check expired logs. 
   This takes effect when `retention` is set to true.
   Default: 60*24*7 minutes (7 days)

### "logdir"
   Specify the directory to put log files.
   Default: ''

### "logname"
   Specify the naming of log files. 
   For example, if `logname` is specified as `example`, log files will be named with a incremental counter:
   `example.0`, `example.1`, `example.2`, ...
   Default: '' (Use date as names)

## Contributors
Bo-Han Wu (researchgary@gmail.com)

## LICENSE - "MIT License"

Copyright (c) 2015 Bo-Han Wu (researchgary@gmail.com)

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
