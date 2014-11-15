(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['player'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;
  return "<div class=\"jumbotron\">\n    <h1>Now playing</h1>\n    <h3>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.track : depth0)) != null ? stack1.title : stack1), depth0))
    + " - "
    + escapeExpression(((helpers.time || (depth0 && depth0.time) || helperMissing).call(depth0, (depth0 != null ? depth0.tick : depth0), {"name":"time","hash":{},"data":data})))
    + " of "
    + escapeExpression(((helpers.time || (depth0 && depth0.time) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.track : depth0)) != null ? stack1.duration : stack1), {"name":"time","hash":{},"data":data})))
    + "</h3>\n</div>";
},"useData":true});
})();