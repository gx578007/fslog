var fs = require('fs'); 
var util = require('util');
var path = require('path');

/**
 * options: { 
 *   section:'...', 
 *   retentionMinutes: in minutes,
 *   retentionCheckInterval: 
 *   retention: true|false
 *   logdir: directory,
 *   logname: file name (%DATE: use date string as log name),
 *   withtime: true|false
 * }
 */
function fslog(options){
  this.log = log;
  this.error = error;
  this.debuglog = debuglog;
  this.destroy = destroy;

  var _now = _nowAlignToDay();
  var _cnt = 0;
  var _fileMapping = {};

  var _oneday = 1000*60*60*24;

  var noop = function(){};

  options = options || {};
  var _section = options.section || null;
  var _retentionCheck = options.retentionCheck || false;
  var _retentionMinutes = options.retentionMinutes || 60*24*7;
  var _retentionCheckInterval = options.retentionCheckInterval || _oneday; 
  var _logname = options.logname || '%DATE';
  var _logdir = options.logdir || '';
  var _withtime = options.withtime || false;
  var _debugMode = process.env.NODE_DEBUG && process.env.NODE_DEBUG.indexOf(_section)>=0;

  if (_debugMode) this.debuglog = noop; 


  var _cleanHdl = null;
  if (_retentionCheck){
     _cleanHdl = setInterval(function(){
       _removeOutdatedLogs();
     },_retentionCheckInterval);
  }

  function log(){
     var rst = _generateOutputString(arguments); 
     fs.appendFile(_filename(),rst+'\n',function(err){ if (err) console.error(err)} );
     console.log.apply(null,[rst]); 
  }

  function error(){
     var rst = _generateOutputString(arguments); 
     fs.appendFile(_filename(),rst+'\n',function(err){ if (err) console.error(err)} );
     console.error.apply(null,[rst]); 
  }

  function debuglog(){
    if (_debugMode)
      log.apply(this,arguments);
  }
  function destroy(){
     if (_cleanHdl)
       clearInterval(_cleanHdl);
     _cleanHdl = null;
  }

  function _generateOutputString(inputs){
     var rst = ''; 
     rst = _withtime ? ('[[' + _timeStr() + ']] ') : '';
     for (var i=0; i<inputs.length; i++){
        var arg = inputs[i];
        var sep = ' ';
        if (i===inputs.length-1) sep = '';
        rst += util.inspect(arg)+sep;
     }
     return rst;
  }

  function _removeOutdatedLogs(){
    var now = Date.now();
    var tsarr = Object.keys(_fileMapping);
    tsarr.forEach(function(ts,i,arr){
      if (now-ts>_retentionMinutes*60*1000){
        fs.unlink(_fileMapping[ts],function(err){
          if (err) return console.error('[Error] Failed to remove outdated log\n',err);
        });
      }
    });
  }

  function _nowAlignToDay(){
    var now = Date.now();
    return now-now%(_oneday)+_oneday;
  }
  function _getCurrentFile(){
    var now = _nowAlignToDay();
    var file = _fileMapping[now];
    if (!file){
      ++_cnt;
      _fileMapping[now] = _filename(); 
    }
    return _fileMapping[now]; 
  }
  function _filename(){ 
    if (_logname==='%DATE')
      return path.join(_logdir,'fslog-'+_dateStr()+'.'+_cnt);
    return path.join(_logdir,_logname+'.'+_cnt); 
  }

  function _dateStr(){
     var cur = new Date();
     var year = cur.getFullYear();
     var month = _twoDigits(cur.getMonth()+1);
     var day = _twoDigits(cur.getDay());
     return ''+year+month+day;
  }
  function _timeStr(){
     var cur = new Date();
     var hour = _twoDigits(cur.getHours());
     var minute = _twoDigits(cur.getMinutes());
     var second = _twoDigits(cur.getSeconds());
     return ''+hour+':'+minute+':'+second;
  }
  function _twoDigits(input){
     if (input<10) return '0'+input;
     return ''+input;
  }
}

function fslogInstance(options){
   return new fslog(options);
}

module.exports = fslogInstance;
