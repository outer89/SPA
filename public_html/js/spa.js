/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var spa = (function() {
    var initModule = function($container) {
        spa.shell.initModule($container);
    };
    return {initModule: initModule};
}());