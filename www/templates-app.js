angular.module('templates-app', ['login/login.tpl.html']);

angular.module("login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/login.tpl.html",
    "<div>\n" +
    "	This will be login form!\n" +
    "</div>");
}]);
