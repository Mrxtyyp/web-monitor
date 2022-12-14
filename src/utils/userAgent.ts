
 /**
  * Parse the given user-agent string into an object of usable data.
  *
  * Example:
  *      import userAgent from 'user-agent'
  *      userAgent.parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; en) AppleWebKit/526.9 (KHTML, like Gecko) Version/4.0dp1 Safari/526.8')
  *      // => { name: 'safari', version: '4.0dp1', os: 'Windows XP', full: '... same string as above ...' }
  *
  * @param  {String} str
  * @return {Object}
  * @api public
  */
 
const parse = function(str: string) {
   var agent = { full: str, name: name(str), version: '', fullName: '', os: '' };
   agent.version = version(str, agent.name);
   agent.fullName = agent.name + ' ' + agent.version;
   agent.os = os(str);
   return agent;
 };
 
 /**
  * Get the browser version based on the given browser name.
  *
  * @param  {String} str
  * @param  {String} name
  * @return {String}
  * @api private
  */
 
 function version(str: string, name: string) {
   if (name === 'safari') name = 'version';
   if (name){
       return new RegExp(name + '[\\/ ]([\\d\\w\\.-]+)', 'i').exec(str) && RegExp.$1 || '';
   }else{
       var m=str.match(/version[\/ ]([\d\w\.]+)/i);
       return m && m.length>1 ? m[1] : '';
   }  
 }
 
 /**
  * Supported operating systems.
  */
 
 const operatingSystems: Record<string, any> = {
     'iPad': /ipad/i
   , 'iPhone': /iphone/i
   , 'Windows Vista': /windows nt 6\.0/i
   , 'Windows 7': /windows nt 6\.\d+/i
   , 'Windows 2003': /windows nt 5\.2+/i
   , 'Windows XP': /windows nt 5\.1+/i
   , 'Windows 2000': /windows nt 5\.0+/i
   , 'OS X $1.$2': /os x (\d+)[._](\d+)/i
   , 'Linux': /linux/i
   , 'Googlebot': /googlebot/i
 };
 
 const osNames = Object.keys(operatingSystems);
 
 /**
  * Get operating system from the given user-agent string.
  *
  * @param  {String} str
  * @return {String}
  * @api private
  */
 
 function os(str: string) {
   var captures: any;
   for (var i = 0, len = osNames.length; i < len; ++i) {
     if (captures = operatingSystems[osNames[i]].exec(str)) {
       return ~osNames[i].indexOf('$1')
         ? osNames[i].replace(/\$(\d+)/g, function(_, n){
           return captures[n]
         }) : osNames[i];
     }
   }
   return '';
 }
 
 /**
  * Supported browser names.
  */
 
 const names = [
    'opera'
  , 'konqueror'
  , 'firefox'
  , 'chrome'
  , 'epiphany'
  , 'safari'
  , 'msie'
  , 'curl'
 ];
 
 function name(str: string) {
   str = str.toLowerCase();
   for (var i = 0, len = names.length; i < len; ++i) {
     if (str.indexOf(names[i]) !== -1) return names[i];
   }
   return '';
 }

 export default {
    parse
 }