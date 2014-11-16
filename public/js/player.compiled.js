(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['player'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"jumbotron\">\n    <h1>Now playing</h1>\n    <h2>"
    + escapeExpression(((helpers.description || (depth0 && depth0.description) || helperMissing).call(depth0, (depth0 != null ? depth0.track : depth0), {"name":"description","hash":{},"data":data})))
    + "</h2>\n    <h3 id=\"left\">"
    + escapeExpression(((helpers.left || (depth0 && depth0.left) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.track : depth0)) != null ? stack1.duration : stack1), {"name":"left","hash":{},"data":data})))
    + "</h3>\n    <button id='mute' type=\"button\" class=\"btn btn-default\" data-state=\"on\">Mute</button>\n</div>";
},"useData":true});
})();