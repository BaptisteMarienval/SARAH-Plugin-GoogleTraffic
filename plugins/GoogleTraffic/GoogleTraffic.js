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
 // var url = 'http://www.google.fr/maps/preview?saddr='+begin+'&daddr='+end;

  
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
    callback({'tts': "L'action a échoué"});
    return;
  }
    
  var $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
   
   //var traffic = $('div.altroute-aux span').text() 
  var traffic = $('html.no-maps-mini body.kui div#main.cs div#inner div#page div div#panel.panel-width div#spsizer.cs div div#opanel4.opanel div#panel4.subpanel div#panel_dir.dir div#dir_altroutes.noprint ol#dir_altroutes_body.dir-altroute-mult li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-aux span').text() ;
  traffic = traffic.replace('min', 'minutes');
  
  if (traffic) {
// ne rien faire : on a le temps avec l'info trafic actualisée sous la forme "Dans les conditions actuelles de circulation ..."
  }
  else {
// pas de perturbation de trafic => On fournit distance + durée "normale"
  if (data.locomotion=='marche') {
	var traffic = $('html.no-maps-mini body.kui div#main.cs div#inner div#page div div#panel.panel-width div#spsizer.cs div div#opanel4.opanel div#panel4.subpanel div#panel_dir.dir div#dir_altroutes.noprint ol#dir_altroutes_body.dir-altroute-mult li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-rcol span').text() ;
  }
  
  if (data.locomotion=='bike') {
	var traffic = $('html.no-maps-mini body.kui div#main.cs div#inner div#page div div#panel.panel-width div#spsizer.cs div div#opanel4.opanel div#panel4.subpanel div#panel_dir.dir div#dir_altroutes.noprint ol#dir_altroutes_body.dir-altroute-mult li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-rcol span').text() ;
  }
  else {
    var traffic = $('html.no-maps-mini body.kui div#main.cs div#inner div#page div div#panel.panel-width div#spsizer.cs div div#opanel4.opanel div#panel4.subpanel div#panel_dir.dir div#dir_altroutes.noprint ol#dir_altroutes_body.dir-altroute-sngl li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-rcol span').text() ;

  }
  traffic = traffic.replace('km', 'km. ');
  traffic = traffic.replace('min', 'minutes');
  
  }

    callback({ 'tts': traffic});
  
  });
}