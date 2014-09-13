/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

 var CommonController = {
   localConfig:"",
   getParametersFromQuery: function() {
     var parameters = {};
     var url = window.location.href;
     var indexOfQ = url.indexOf("?");
     if (indexOfQ >= 0) {
       var queryString = url.substring(indexOfQ+1);
       var params = queryString.split("&");
       for (var i = 0, n = params.length; i < n; i++) {
         var param = params[i];
         var keyvalue = param.split("=");
         parameters[keyvalue[0]] = keyvalue[1];
       }
       parameters["QueryString"] = queryString;
     }
     return parameters;
   },

   getJSON: function(url, callback) {
     $.getJSON(url, function(result) {
         if (result["error"]) {
           callback(null, result["error"]);
         } else {
           callback(result);
         }
     })
     .error(function(xhr, textStatus, errorThrown) {
         callback(null, textStatus+":"+xhr.responseText);
     })
   },

   getContents: function(url) {
     var parameter = {url: url, type:"GET"};
     var deferred = new $.Deferred();
     parameter.cache = false;

     parameter.success = function(result) {
       deferred.resolve(result);
     };

     parameter.error = function(xhr, textStatus, errorThrown) {
       deferred.reject(xhr);
     };

     $.ajax(parameter);
     return deferred.promise();
   },

   setLocalData: function(key,jsonData,isAddMode){
     var data = {};
     if(isAddMode){
       data["add"] = jsonData;
       var res = CommonController.getLocalData(key);
       console.log(res);
       if(res && res.hasOwnProperty("play"))data["play"] = res.play;
     } else {
       data["play"] = jsonData;
       var res = CommonController.getLocalData(key);
       if(res && res.hasOwnProperty("add"))data["add"] = res.add;
     }
     var d = data.toSource();

     console.log(data);
     localStorage.setItem(key,d);
   },

   getLocalData: function(key){
     var data = localStorage.getItem(key);
     return eval(data);
   },

   getLocalConfig: function(id){
     var res = CommonController.getLocalData(id);
     res = res || "";
     if(__MODE__ == "play"){
       CommonController.localConfig = res.play || "";
     } else {
       CommonController.localConfig = res.add || "";
      }
   },

   setLocalConfig: function(id){
     if(CommonController.localConfig == ""){
       alert("there is no config");
       return false;
     }
     CommonController.setLocalData(id,CommonController.localConfig,__MODE__ != "play");
   }
 }
