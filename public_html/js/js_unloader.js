/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * set of functions for unloading java script references
 */
function unloadJS(scriptName) {
    console.log("unloading script:= " + scriptName);
      var head = document.getElementsByTagName('head').item(0);
    //console.log("head");
    //console.log(head);
      var js = document.getElementById(scriptName);
    //console.log("js");
    //console.log(js);
      js.parentNode.removeChild(js);
    //vs js.remove();
}

$(function unloadAllJS() {
    return;
    console.log(
            "             _                 _ _                 _                                  _       _    \n" +
            " _   _ _ __ | | ___   __ _  __| (_)_ __   __ _    (_) __ ___   ____ _   ___  ___ _ __(_)_ __ | |_  \n" +
            "| | | | '_ \\| |/ _ \\ / _` |/ _` | | '_ \\ / _` |   | |/ _` \\ \\ / / _` | / __|/ __| '__| | '_ \\| __| \n" +
            "| |_| | | | | | (_) | (_| | (_| | | | | | (_| |   | | (_| |\\ V / (_| | \\__ \\ (__| |  | | |_) | |_  \n" +
            " \\__,_|_| |_|_|\\___/ \\__,_|\\__,_|_|_| |_|\\__, |  _/ |\\__,_| \\_/ \\__,_| |___/\\___|_|  |_| .__/ \\__| \n" +
            "                                         |___/  |__/                                   |_|         ");
      var jsArray = new Array();
      jsArray = document.getElementsByTagName('script');
    console.log("found " + jsArray.length + " script in the page");
      for (i = 0; i < jsArray.length; i++) {

            if (jsArray[i].id) {
            console.log("script has an id:= " + jsArray[i].id);
              unloadJS(jsArray[i].id);
            } else {
            console.log("script seems to be empty := " + jsArray[i].id);
            //console.log(jsArray[i]);
            //console.log("id:= " + jsArray[i].id);
              jsArray[i].parentNode.removeChild(jsArray[i]);
            }
      }       
});


