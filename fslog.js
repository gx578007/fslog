var fs = require('fs'); 
var util = require('util');
var path = require('path');

/**
 * options: { 
 *   section:'...', 
 *   retention: in minutes,
 *   logdir: directory,
 *   logname: file name (%DATE: use date string as log name),
 * }
 */
function fslog(options){
  this.log = log;
  this.debuglog = debuglog;
  this.destroy = destroy;

  var _now = _nowAlignToDay();
  var _cnt = 0;
  var _fileMapping = {};

  options = options || {};
  var _section = options.section || null;
  var _retention = options.retention || 60*24*7;
  var _logname = options.logname || '%DATE';
  var _logdir = options.logdir || '';
  var _debugMode = process.env.NODE_DEBUG && process.env.NODE_DEBUG.indexOf(_section)>=0;
  if (_debugMode) this.debuglog = function(){}; //no-op

  var _oneday = 1000*60*60*24;

  var _cleanHdl = setInterval(function(){
    _removeOutdatedLogs();
  },_retention*60*1000);

  function log(){
     var rst = '[[' + _timeStr() + ']]  ';
     var rst = ''; 
     for (var i=0; i<arguments.length; i++){
        var arg = arguments[i];
        var sep = ' ';
        if (i===arguments.length-1) sep = '\n';
        rst += util.inspect(arg)+sep;
     }
     fs.appendFile(_filename(),rst,function(err){ if (err) console.log(err)} );
     console.log.apply(null,arguments); 
  }
  function debug(){
    if (_debugMode)
      log.apply(this,arguments);
  }
  function destroy(){
    clearInterval(_cleanHdl);
    _cleanHdl = null;
  }

  function _removeOutdatedLogs(){
    var now = Date.now();
    var tsarr = Object.keys(_fileMapping);
    tsarr.forEach(function(ts,i,arr){
      if (now-ts>_retention){
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
      return path.join(_logdir,_dateStr()+'.'+_cnt);
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
