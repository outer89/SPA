/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * jslint settings
 */

//MODULE /spa/
//provides cha slider capability
//
var spa = (function() {
    //Module scope varibales

    //set constants
    var configmap = {
        extended_height: 434,
        extended_title: 'click to retract',
        retracted_height: 16,
        retracted_title: 'click to extend',
        template_html: '<div class="spa-slider"><\/div>'
    },
    //declare all other scope variables
    $chatSlider, toogleSlider, onClickSlider, initModule;
    //DOM method /toogleSlider/
    //alternate slider height
    toogleSlider = function() {
        var slider_height = $chatSlider.height();
        console.log(slider_height);
        //extend slider if fully retracted
        if (slider_height === configmap.retracted_height) {
            $chatSlider.animate({height: configmap.extended_height}).attr('title', configmap.extended_title);
            return true;
        }
        //retract otherwise
        else if (slider_height === configmap.extended_height) {
            $chatSlider.animate({height: configmap.retracted_height}).attr('title', configmap.retracted_title);
            return true;
        }
        //do not do anything if slider is in action
        return false;

    };
    //Event handler /onClickSlider/
    //receives click event and calls toogleSlider
    onClickSlider = function(event) {
        console.log("click sullo slider");
        toogleSlider();
        return false;
    };
    //Public method /initModule/
    //sets initial state and provides feature
    initModule = function($container) {
        //render html
        $container.html(configmap.template_html);
        $chatSlider = $container.find('.spa-slider');
        //initialize slider height and title
        //bind the user click event to the event handler
        $chatSlider.attr('title', configmap.retracted_title).click(onClickSlider);
        return true;
    };
    return {initModule: initModule};
}(jQuery));

//start SPA once DOM is ready
jQuery(document).ready(
        function() {
            spa.initModule(jQuery('#spa'));
        });