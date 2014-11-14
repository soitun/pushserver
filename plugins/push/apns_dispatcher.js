/**
 * Dispatcher to send notifications to clients via APNS.
 */

var apn = require('apn');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');
var util = require('util');

var APNSResponseLogger = require('./apns_response_logger');
var ChannelDispatcher = require('./channel_dispatcher');


var APNSDispatcher = function(config) {
  ChannelDispatcher.call(this, 'APNS', config);

  this.feedbackBuffer_ = [];
  this.config = config;

  this.configureFeedbackService_(this.config);
};

util.inherits(APNSDispatcher, ChannelDispatcher);


/**
 * Register the feedback handler and clear any buffered feedback notifications.
 * @param feedbackHandler
 */
APNSDispatcher.prototype.registerChannelFeedbackHandler = function(feedbackHandler) {
  APNSDispatcher.super_.prototype.registerChannelFeedbackHandler.call(this, feedbackHandler);

  // TODO(leah): No idea what this is supposed to do?
  lodash.forEach(this.feedbackBuffer_, this.feedbackHandler);
};


APNSDispatcher.prototype.dispatch = function(notificationIds, notification, done) {
  APNSDispatcher.super_.prototype.dispatch.call(this, notificationIds, notification);

  var emptyStats = {total: this.getEmptyStatsObject()};
  //  var connection = this.getConnection_();
  //  connection.pushNotification(notification, notificationIds);

  setTimeout(function() {
    done(null, emptyStats);
  }, 200);
};


/**
 * Configure the APNS feedback service.
 * @param options An object describing the options to use for feedback.
 * @private
 */
APNSDispatcher.prototype.configureFeedbackService_ = function(options) {

  var options = {
    'key': options.key,
    'cert': options.cert,
    'batchFeedback': true,
    'interval': options.feedbackInterval
  };

  var feedback = new apn.Feedback(options);
  feedback.on('feedback', this.handleAPNSFeedback_);
};


/**
 * Internal handler for APNS feedback.
 * @param notificationIds An array of notification IDs returned by the feedback service to prune.
 * @private
 */
APNSDispatcher.prototype.handleAPNSFeedback_ = function(notificationIds) {

  lodash.forEach(notificationIds, function(notificationId) {
    if (this.feedbackHandler_ !== null) {
      this.feedbackHandler_(notificationId);
    } else {
      this.feedbackBuffer_.push(notificationId);
    }
  });

};


/**
 * Creates a new APNS connection and response logger.
 * @param function() done The function to call once notifications complete.
 */
APNSDispatcher.prototype.getConnection_ = function(done) {
  // TODO(leah): Update this.
  var options = {
    production: false
  };
  var service = new apn.connection(options);

  var responseLogger = new APNSResponseLogger();

  service.on('transmitted', responseLogger.handleTransmitted);
  service.on('transmissionError', responseLogger.handleTransmissionError);
  service.on('disconnected', function() {
    // TODO(leah): Create + resolve a promise
  });
  service.on('socketError', function() {
    // TODO(leah): Create + resolve a promise
  });
};


module.exports = APNSDispatcher;
