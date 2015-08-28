var fs = require('fs'); 
var util = require('util');
var path = require('path');

/**
 * options: { 
 *   section:'...', 
 *   retentionMinutes: in minutes,
 *   retentionGranularity: n+('m'|'h'|'d')
 *   retentionCheckInterval: 
 *   retention: true|false
 *   logdir: directory,
 *   logname: file name (%DATE: use date string as log name),
 *   withtime: true|false
 *   destination: 'file'|'console'|'both'
 * }
 */
function fslog(options){
  this.log = log;
  this.error = error;
  this.debuglog = debuglog;
  this.destroy = destroy;

  var _cnt = 0;

  var _oneday = 1000*60*60*24;
  var _onehour = 1000*60*60;
  var _oneminute = 1000*60;

  var noop = function(){};

  // Check configuration
  options = options || {};
  var _section = options.section || null;
  var _retentionCheck = options.retentionCheck || false;
  var _retentionMinutes = options.retentionMinutes || 60*24*7;
  var _retentionCheckInterval = options.retentionCheckInterval || _oneday; 
  var _retentionGranularity = (options.retentionGranularity || '1d');
  var _logname = options.logname || '%DATE';
  var _logdir = options.logdir || 'fslog';
  var _withtime = options.withtime || false;
  var _destination = (options.destination || 'both').toLowerCase();

  // Setup state variables in terms of configuration
  var _debugMode = process.env.NODE_DEBUG && process.env.NODE_DEBUG.indexOf(_section)>=0;
  if (_debugMode) this.debuglog = noop; 

  var _tofile = (_destination==='both' || _destination==='file') ? fs.appendFile : noop;
  var _console = (_destination==='both' || _destination==='console') ? console : {log:noop,error:noop}; 

  var _retentionGranularityInEpoch = _granularityToEpoch(_retentionGranularity);
  var _logFilter = (_logname==='%DATE') ? (new RegExp(/^fslog-.*/)) : (new RegExp('^'+_logFilter+'.*')); 

  var _cleanHdl = null;
  _mkdirpSync(_logdir);
  if (_retentionCheck){
     _cleanHdl = setInterval(function(){
       _removeExpiredLogs();
     },_retentionCheckInterval*_oneminute);
  }

  function log(){
     var rst = _generateOutputString(arguments); 
     _tofile(_filename(),rst+'\n',function(err){ if (err) console.error(err)} );
     _console.log.apply(null,[rst]); 
  }

  function error(){
     var rst = _generateOutputString(arguments); 
     _tofile(_filename(),rst+'\n',function(err){ if (err) console.error(err)} );
     _console.error.apply(null,[rst]); 
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

  function _removeExpiredLogs(){
    var now = Date.now();
    fs.readdir(_logdir,function(err,files){
      if (err) return console.error(err);
      files.forEach(function(file,idx,arr){
         if ( !file.match(_logFilter) )
            return;
         var completePath = path.join(_logdir,file);
         console.log(completePath);
         fs.stat(completePath,function(err,stats){
            if (err) return console.error(err);
            var lastModTime = new Date(stats.mtime);
            if (now-lastModTime>_retentionMinutes*_oneminute*1.2){
               fs.unlink(completePath,function(err){
                  if (err) return console.error(err);   
               });
            }
         });
      });
    });
  }
  function _filename(){ 
    if (_logname==='%DATE')
      return path.join(_logdir,'fslog-'+_dateStr()+'.'+_cnt);
    return path.join(_logdir,_logname+'.'+_cnt); 
  }

  function _granularityToEpoch(str){
    var n = parseInt(str);
    if (isNaN(n))
       return _oneday;
    var unit = str.replace(n,'').trim().toLowerCase();
    var p = 1000;
    if (unit==='d') p=n*_oneday;
    else if (unit==='h') p=n*_onehour;
    else if (unit==='m') p=n*_oneminute;
    else p=_oneday;
    return p;
  }

  function _dateStr(){
     var now = Date.now();
     var cur = new Date( now-now%_retentionGranularityInEpoch );
     var year = cur.getFullYear();
     var month = _twoDigits(cur.getMonth()+1);
     var day = _twoDigits(cur.getDay());
     var rst = ''+year+month+day;
     if (_retentionGranularityInEpoch>=_oneday) return rst;
     else if (_retentionGranularityInEpoch>=_onehour) rst += ('-'+_twoDigits(cur.getHours()));
     else if (_retentionGranularityInEpoch>=_oneminute) rst += ('-'+_twoDigits(cur.getHours())+':'+_twoDigits(cur.getMinutes())); 
     return rst;
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
  function _mkdirpSync(dir){
     fs.stat(dir,function(err,stats){
       if (err && err.code==='ENOENT')
          fs.mkdirSync(dir);   
       else if (err) return console.error(err);
     }); 
  }
}

function fslogInstance(options){
   return new fslog(options);
}

module.exports = fslogInstance;
