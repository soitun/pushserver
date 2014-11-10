/**
 * Tests for the message adapters.
 */

var assert = require('assert');
var lodash = require('lodash');

var MessageAdapter = require('../message_adapters/message_adapter');


describe('MessageAdapters', function() {

  var notification = {
    notificationId: 1,
    title: 'title',
    message: 'message',
    sound: null,
    data: null,
    channels: ['APNS', 'GCM'],
    mode: 'prod',
    deviceIds: null
  };
  var groupedSubs = {
    APNS: [
      {subscriptionId: 2, language: 'en', deviceId: '4rLI0szVmUa6'},
      {subscriptionId: 3, language: 'en', deviceId: 'ZNthkc20cnS1'}
    ],
    GCM: [
      {subscriptionId: 4, language: 'en', deviceId: '9PYHNoxx3BJb'},
      {subscriptionId: 5, language: 'en', deviceId: 'zx0vqxrrWEm0'}
    ]
  };

  var expectedMessages = {
    APNS: {

    },
    GCM: {
      'data': {
        'message': 'message',
        'title': 'title'
      }
    }
  };

  it('should adapt the notification into channel specific messages', function() {
    // TODO(leah): Implement this test.
    var messageAdapter = new MessageAdapter(notification, groupedSubs);

    lodash.forEach(expectedMessages, function(expectedMessage, channel) {
      assert.deepEqual(messageAdapter.adapters[channel].message, expectedMessage);
    });

  });

});
