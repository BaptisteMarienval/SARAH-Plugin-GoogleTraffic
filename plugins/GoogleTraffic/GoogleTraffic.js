exports.action = function(data, callback, config, SARAH){

 // CONFIG
  config = config.modules.googletraffic;
  if (!config.home){
    console.log("Missing Google Traffic config");
    callback({ 'tts': 'Configuration invalide' });
    return;
  }
  
  var end = config.office;
  var begin = config.home;
  
  var url = 'http://maps.google.fr/maps?saddr='+begin+'&daddr='+end;
  
  if (data.locomotion=='marche') {
  url = url+'&dirflg=w';
  }
    if (data.locomotion=='bike') {
  url = url+'&dirflg=b';
  }
  console.log(url);
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
  if (err || response.statusCode != 200) {
    callback({'tts': "Je n'arrive pas à accéder aux informations du trafic"});
    return;
  }
    
  var $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
  var traffic = $('li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-aux span').text() ;
  traffic = traffic.replace('min', 'minutes');
  
  if (traffic) {
// ne rien faire : on a le temps avec l'info trafic actualisée sous la forme "Dans les conditions actuelles de circulation ..."
  }
  else {
  // on retourne la distance + temps "normal"
  var traffic = $('li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-rcol span').text();
  traffic = traffic.replace('km', 'km. ');
  traffic = traffic.replace('min', 'minutes');
  
  }

    callback({ 'tts': traffic});
  
  });
}