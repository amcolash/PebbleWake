/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var url = "pi.amcolash.com";
var port = 4000;

var computers = [
  {
    title: 'Andrew PC',
    mac: 'FC:AA:14:96:01:E7',
    ip: 'pi.amcolash.com',
    port: '9'
  }
];

var menu = new UI.Menu({
  sections: [{
    items: computers
  }]
});

menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  var computer = computers[e.itemIndex];
  console.log(JSON.stringify(computer));
  
  var card = new UI.Card({
    title: 'Attempting to wake up...'
  });
  card.show();
  
  ajax(
    {
      url: url + ":" + port,
      type: 'json',
      medthod: 'put',
      headers: computer
    },
    function(success) {
      // Success!
      console.log('Successfully sent wake up!');
      card.title('Successfully sent wake up');
    },
    function(error) {
      // Failure!
      console.log('Failed waking somewhere: ' + error);
      card.title('Something went wrong :(');
      card.body(error);
    }
  );
});

menu.show();