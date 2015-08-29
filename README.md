fslog - a light node.js logging API 
===========================

Similar to `console.log`, `fslog` logs message to both "files" and "stdout". The logs within the same day will be written in the same file by default. Also, `fslog` is able to automatically perform log rotation to remove expired logs (disabled by default).

Install with:

    npm install fslog 

## Usage

A simple example to use `fslog.log`.

```js
    // Apply default settings of fslog
    var fslog = require("fslog")();

    // Use fslog.log like console.log
    // Use fslog.error like console.error
    // Not support format specifier (such as %s, %d ...)
    var obj = {a:1};
    var arr = [1,'2',3];
    var num = 1;
    var str = '1'
    fslog.log(str,num,arr,obj);
    fslog.error(str,num,arr,obj);
```

This will display:

    '1' 1 [ 1, '2', 3 ] { a: 1 }

A log file with date-formatted name will be generated. For example, logs are written to the file "fslog-20150803.0" is generated. Its content will be:

    '1' 1 [ 1, '2', 3 ] { a: 1 }

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
<br>
___
<br>

# API
## log
   Interface is similar to `console.log`. It writes logs to both "files" and "stdout".

## error 
   Interface is similar to `console.error`. It writes logs to both "files" and "stderr".

## debuglog
   Interface is similar to `util.debuglog`. If environment variable "NODE_DEBUG" matches the specified section, it will write logs to files and stdout. If not, it is a no-op function.

## destroy
   This will destroy automatical log removal processes.

<br>
___
<br>

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

### "destination"
   Specify the way to store logs. Three values are available to be set:
   <br>
   1. "*file*": output logs only to files.
   2. "*console*": output logs only to console such as "stderr" or "stdout".
   3. "*both*": output logs to both files and console.

<br>Default: "*both*"

### "retentionCheck"
   If true, periodically remove expired logs.
   If false, logs will be kept forever.
<br>Note that, if this is set to **true**, it is possible to remove non-log files in the same directory. Be careful to turn retention checking on with a proper `logdir` to ensure only logs will be removed from file system. 
   <br>Default: **false**.

### "retentionGranularity"
   Specify the period which all the logs in this time range will be written in the same file.
   By default, all logs in the same day will be wriiten in the same file.
   Users can customize this granulariy by the following time units:
   1. **d**: separated files by days. For example, "2d" means two days and "7d" means one week.
   2. **h**: separated files by hours. For example, "3h" means three hours and "24h" means one day.
   3. **m**: separated files by minutes. For example, "10m" means ten minutes and "60m" means one hour.
   <br>
 
Note that the dated-formatted file names depend on the specified granularity. If the granularity is less than one hour, the corresponding file name will display minute information of logging time. Simiarly, if the granularity is less than one day but more than one hour, the file name shows only hour information but hides minutes. 
   <br> Default: "1d" (one log file per day)

### "retentionMinutes"
   Specify the lifetime to keep each log. Unit is in "minutes".
   This takes effect when `retention` is set to true.
   <br>Default: 10080 (minutes) (= 7 days).

### "retentionCheckInterval"
   Specify the interval in minutes to check expired logs under `logdir`. 
   This takes effect when `retention` is set to true.
   <br>Default: 1440 (minutes) (= 1 day).

### "logdir"
   Specify the directory to store log files. If the directory does not exist, `fslog` will automatically create the directory. It is strongly suggested to specify your own proper directory to store and manage logs. **DO NOT** put important files (such as source codes) under the specified directory. 
   <br>Default: "**fslog**"

### "withtime"
   If it is set to true, a timestamp will be embedded into the head of each log message when logging.
   <br>Default: **false**.

### "logname"
   Specify the naming of log files. 
   For example, if `logname` is specified as "example", log files will be named with an incremental counter:
   "example.0", "example.1", "example.2", ...
   Otherwise, date-formatted names "fslog-YYYYMMDD-HH:MM.x" ("fslog-" is a prefix) are applied to write logs according to the retention granularity (per day by default). 
   <br>Default: (Use date-formatted string "fslog-YYYYMMDD-HH:MM.x").

<br>

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
