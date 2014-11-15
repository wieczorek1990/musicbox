(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['player'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"jumbotron\">\n    <h1>Now playing</h1>\n    <h3>"
    + escapeExpression(((helpers.description || (depth0 && depth0.description) || helperMissing).call(depth0, (depth0 != null ? depth0.track : depth0), {"name":"description","hash":{},"data":data})))
    + "</h3>\n    <audio autoplay=\"autoplay\">\n        <source src=\"/stream\">\n        Your browser does not support the audio element.\n    </audio>\n    <button id='mute' type=\"button\" class=\"btn btn-default\" data-state=\"on\">Mute</button>\n</div>";
},"useData":true});
})();