var parse = require("url").parse;

/**
 * Return connect heroku redis store
 * @param {int} version
 * @return RedisStore
 * @api public
 */
module.exports = function(express) {
  
  var RedisStore = require('connect-redis')(express);
  
  function ConnectHerokuRedis(options) {
    var redisToGo = process.env.REDISTOGO_URL ? parse(process.env.REDISTOGO_URL) : false; 
    console.log("redisToGoURL", redisToGo);
    options = options || {};

    if (redisToGo) {
      options.host = options.host || redisToGo.host;
      options.port = options.port || redisToGo.port;
      
      if (!options.pass && redisToGo.auth) {
        options.pass = options.pass || redisToGo.auth.split(":")[1];
      }
    }
   options.host="beardfish.redistogo.com";
   options.port="10270";
   options.pass="c9ed2893f0406ef32ef973b45dd3b08f";
      console.log("RedisStore options", options);
    RedisStore.call(this, options);
  }
  
  // Inherit from Connect Redis
  ConnectHerokuRedis.prototype = new RedisStore;
  
  return ConnectHerokuRedis;
}