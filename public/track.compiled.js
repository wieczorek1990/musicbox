(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['track'] = template({"1":function(depth0,helpers,partials,data) {
  return "        <h2 class=\"text-center\">Queue is empty. Upload something!</h2>\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "        <h2 class=\"text-center\">Queue</h2>\n\n        <div class=\"col-lg-6 col-lg-offset-3\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tracks : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </div>\n";
},"4":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                <h4>"
    + escapeExpression(((helpers.plusOne || (depth0 && depth0.plusOne) || helperMissing).call(depth0, (data && data.index), {"name":"plusOne","hash":{},"data":data})))
    + ". "
    + escapeExpression(((helpers.description || (depth0 && depth0.description) || helperMissing).call(depth0, depth0, {"name":"description","hash":{},"data":data})))
    + "</h4>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"row\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.tracksEmpty : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
})();