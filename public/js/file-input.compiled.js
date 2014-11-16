(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['file-input'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<input id=\"file\" type=\"file\" accept=\".mp3,.ogg\" class=\"form-control\" name=\"track\" title=\"Choose track\"\n       data-filename-placement=\"inside\">";
  },"useData":true});
})();