define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        //console.log("dataExtensionName"+dataExtensionName);
        console.log('Save Executed');
        payload['arguments'].execute.inArguments = [
		{"tokens": authTokens},
		{ "Title": "{{Event.ADD999E4-C775-4C55-A254-978FF59DE310.Title}}"},
		   { "Data": "{{Contact.Attribute.Pushy Notification.Data}}"},
		   {"DeviceToken": "{{Contact.Attribute.Pushy Notification.DeviceToken}}"}
            
        ];
        
        
        payload['metaData'].isConfigured = true;

       // console.log("payload"+payload);
        
        //call pushy
        
               var settings = {
          "url": "https://api.pushy.me/push?api_key=e51fd3c0c706749112a38e8060b3e6eda75d92b5d97190470ec669640616f16d",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({"to":"e726da50548bb85ecc63d0","data":{"title":"Hello World Custom Activity 1","body":"Hello World!"},"notification":{"body":"Hello World ✌"}}),
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
            connection.trigger('updateActivity', payload);
        }).fail(function (jqXHR, textStatus) {
            alert('Something went wrong');
        });     
        
        //end call

        
       // connection.trigger('updateActivity', payload);
    }


});
     
