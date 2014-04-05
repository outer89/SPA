/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


spa.shell = (function() {
    //----------- BEGIN MODULE SCOPE VARIABLES --------- 
    var configMap = {
        main_html: String() +
                '<div class="spa-shell-head">' +
                '<div class="spa-shell-head-logo"> </div>' +
                '<div class="spa-shell-head-acct"> </div>' +
                '<div class="spa-shell-head-search"> </div>' +
                '</div>' +
                '<div class="spa-shell-main">' +
                '    <div class="spa-shell-main-nav"> </div>' +
                '    <div class="spa-shell-main-content"> </div>' +
                '</div>' +
                '<div class="spa-shell-foot"></div>' +
                '<div class="spa-shell-chat"></div>' +
                '<div class="spa-shell-modal"></div>',
        chat_extend_time: 250,
        chat_retract_time: 300,
        chat_extend_height: 450,
        chat_retract_height: 15,
        chat_extended_title: 'Click to retract',
        chat_retracted_title: 'Click to extend',
        anchor_schema_map: {
            chat: {open: true, closed: true}
        }
    },
    stateMap = {
        $container: null,
        is_chat_retracted: true,
        anchor_map: {}
    },
    jqueryMap = {},
            setJqueryMap, toogleChat, onClickChat,
            copyAnchorMap, changeAnchorPart, onHashchange,
            initModule;

    //----------- END MODULE SCOPE VARIABLES --------- 
    //----------- BEGIN UTILITY METHODS --------- 
    //Return copy of stored anchro map; minimizes overhead
    copyAnchorMap = function() {
        return $.extend(true, {}, stateMap.anchor_map);
    };

    //----------- END UTILITY METHODS --------- 

    //----------- BEGIN DOM METHODS --------- 
    //Begin DOM method /changeAnchorPart/
    //Purpose: Changes part of the URI anchro component
    // Arguments:
    // * arg_map - The map describing what part of the URI anchor
    //   we want changed
    // Returns : boolean
    // * true - the Anchor portion of the URI was updated
    // * false - the Anchor portion of the URI could not be updated
    // Action: 
    //  The current anchro rep stored in stateMap.anchor_map.
    //  See uriAnchor for a discussion of encoding.
    //  This method
    //  * Creates a copy of this map using copyAnchorMap().
    //  * Modifies the key-values using arg_map
    //  * Manages the distinction between independent and dependent 
    //    values in the encoding.
    //  * Attemps to change the URI using uriAnchor.
    //  * Returns true on success, and false on failure.
    //
    //
    changeAnchorPart = function(arg_map) {
        console.log("change anchor part");
        var
                anchor_map_revise = copyAnchorMap(),
                bool_return = true,
                key_name, key_name_dep;
        //BEGIN merge changes into anchor map
        KEYVAL:
                for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {
                //console.log("key_name:= " + key_name);

                //skip dependet keys during iteration
                if (key_name.indexOf('_') === 0) {
                    console.log("key name starts with '_'");
                    continue KEYVAL;
                }
                //update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                //update matching dependent key
                key_name_dep = '_' + key_name;
                //console.log("key_name_dep:= " + key_name_dep);
                if (arg_map[key_name_dep]) {
                    //console.log("if");
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    //console.log("else");
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        //END merge changes into anchor map
        //BEGIN ateempt to update URI; revert if not successful
        try {
            console.log("setting anchor");
            $.uriAnchor.setAnchor(anchor_map_revise);
            console.log("set");
        } catch (error) {
            //replace URI with existing state
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            console.log("changeAnchorPart error :=" + error);
            bool_return = false;
        }
        //END attemp to update URI
        return bool_return;
    };
    //END DOM method /changeAnchorPart/

    //begin DOM method /setJqueryMap/
    setJqueryMap = function() {
        var $container = stateMap.$container;
        jqueryMap = {$container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };
    //end DOM method /setJqueryMap/

    //Begin DOM method /toogleChat/
    //Purpose : Extends or retracts chat slider
    //Arguments: 
    // * do_extend - if true, extends slider; if false retracts
    // * callback - optional function to execture at end of animation
    // Settings :
    // * chat_extend_time, chat retract_time
    // * chat_extend_height, chat_retract_height
    // State:
    // * true - slider is retracted
    // * false - clider is extended
    // Returns : boolean
    // * true - slider animation activated
    // * false - slider animation not activated
    //
    toogleChat = function(do_extend, callback) {
        var px_chat_ht = jqueryMap.$chat.height(),
                is_open = px_chat_ht === configMap.chat_extend_height,
                is_closed = px_chat_ht === configMap.chat_retract_height,
                is_sliding = !is_open && !is_closed;
        //avoid race condition
        if (is_sliding) {
            console.log('avoid race condition');
            return false;
        }
        //begin chat slider
        if (do_extend) {
            jqueryMap.$chat.animate({height: configMap.chat_extend_height},
            configMap.chat_extend_time, function() {
                jqueryMap.$chat.attr('title', configMap.chat_extended_title);
                stateMap.is_chat_retracted = false;
                if (callback) {
                    callback(jqueryMap.$chat);
                }
            });
            return true;
        }
        //End extend chat slider

        //Begin retract chat slider
        jqueryMap.$chat.animate({height: configMap.chat_retract_height},
        configMap.chat_retract_time, function() {
            jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
            stateMap.is_chat_retracted = true;
            if (callback) {
                callback(jqueryMap.$chat)
            }

        });
        return true;
        //End rectract chat slider  
    };
    //end DOM method /toogleChat/

    //----------- END DOM METHODS --------- 
    //
    //----------- BEGIN EVENT HANDLERS --------- 
    onClickChat = function(event) {
        // console.log(stateMap.is_chat_retracted);
        changeAnchorPart({
            chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
        });
        return false;

    };
    //
    // BEGIN event handler /onHashchange/
    // purpose : handles the haschange event
    // arguments : 
    // * event - jquery event object
    // settings : none
    // returns : false
    // action: 
    // * parses the uri anchor component
    // * comparses proposed application state with current
    // * adjust the application only where proposed state differ from existing
    // 
    onHashchange = function(event) {
        console.log("on hash change");
        var
                anchor_map_previous = copyAnchorMap(),
                anchor_map_proposed,
                _s_chat_previous, _s_chat_proposed,
                s_chat_proposed;
        //Attempt to parse anchor
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch (error) {
            console.log("onHashchange error:= " + error)
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;
        //convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        //BEGIN adjust of component if changed
        if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            console.log("adjusting components, chat:= " + s_chat_proposed);
            switch (s_chat_proposed) {
                case 'open':
                    toogleChat(true);
                    break;
                case 'closed':
                    toogleChat(false);
                    break;
                default :
                    toogleChat(false);
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        //END of the adjustment
        return false;
    };
    //END event handler /onHashchange/

    //----------- END EVENT HANDLERS --------- 

    //----------- BEGIN PUBLIC METHODS --------- 
    //Begin Public methods /initModule/
    //
    initModule = function($container) {


        //load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        //initialize chat slider and bind click handler
        stateMap.is_chat_retracted = true;
        jqueryMap.$chat.attr('title', configMap.chat_retracted_title)
                .click(onClickChat);
        //configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });

        //HANDLE URI anchor change events
        //This is done /after/ all features modules are configured
        //and initialized, otherwise they will not be ready to hangle
        //the trigger event, which is used to ensure the anchor 
        //is considered on-load
        //
        if ("onhashchange" in window) {
            console.log('SUPPORTED');
        }

        $(window).bind('hashchange', onHashchange).trigger('hashchange');


    };
    //End PUBLIC methods /initModule/


    return {initModule: initModule};
    //----------- END PUBLIC METHODS --------- 
}());