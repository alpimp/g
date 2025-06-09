var pixelType="generic";$(function(){var click_outs=$("a");for(var i=0;i<click_outs.length;i++){let loc=click_outs[i].href
let query=location.search
var params=getQueryParameters();if(query!==null)
{if(loc.includes("?"))
{query=query.replace("?","&")}
if(params["os"]){if(params["os"]=="ios"){base_clickout="https://app.appsflyer.com/id886492891?af_prt=takoomi";query=query.replace("?","&")
click_outs[i].href=base_clickout+query;}
else{click_outs[i].href=click_outs[i].href+query;}}
else{click_outs[i].href=click_outs[i].href+query;}}}
try{$.getScript("https://www.libcdn.xyz/js/retargeting.js",function(data,textStatus,jqxhr){});}
catch(error){console.log(error);}});function get_click_url_t()
{let query=location.search
return "https://ukoffzeh.com/path/out.php"+query;}
function getQueryParameters(str){return(str||document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n=n.split("="),this[n[0]]=n[1],this}.bind({}))[0];}