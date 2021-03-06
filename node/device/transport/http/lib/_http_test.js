// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var Message = require('azure-iot-common').Message;
var Http = require('./http.js');

describe('Http', function (){
    var transport = null;
    var receiver = null;
    var testMessage = new Message();
    var testCallback = function () {};
    
    beforeEach(function(){
        var DummyReceiver = function() {
            this.complete = sinon.spy();
            this.reject = sinon.spy();
            this.abandon = sinon.spy();
            this.setOptions = sinon.spy();
        };
        
        receiver = new DummyReceiver();
        
        transport = new Http({ host: 'hub.host.name', hubName: 'hub' , deviceId: 'deviceId', sas: 'sas.key'});
        transport._receiver = receiver;
    });
    
    afterEach(function(){
        transport = null;
        receiver = null;
    });
    
    describe('#setOptions', function(){
    /*Tests_SRS_NODE_DEVICE_HTTP_16_004: [The ‘setOptions’ method shall call the setOptions method of the HTTP Receiver with the options parameter.] */
    /*Tests_SRS_NODE_DEVICE_HTTP_16_005: [The ‘setOptions’ method shall call the ‘done’ callback when finished.] */

        it('calls the receiver `setOptions` method', function(){
            var testOptions = { foo: 42 };
            transport.setOptions(testOptions, function (err, result){
               assert.isNull(err);
               assert.equal(result.constructor.name, 'TransportConfigured');
               assert(receiver.setOptions.calledWith(testOptions)); 
            });
        });
    });
    
    describe('#complete', function(){
        /*Tests_SRS_NODE_DEVICE_HTTP_16_002: [The ‘complete’ method shall call the ‘complete’ method of the receiver object and pass it the message and the callback given as parameters.] */
        it('calls the receiver `complete` method', function () {
            transport.complete(testMessage, testCallback);
            assert(receiver.complete.calledWith(testMessage, testCallback));
        });
    });
    
    describe('#reject', function(){
        /*Tests_SRS_NODE_DEVICE_HTTP_16_003: [The ‘reject’ method shall call the ‘reject’ method of the receiver object and pass it the message and the callback given as parameters.] */
        it('calls the receiver `reject` method', function () {
            transport.reject(testMessage, testCallback);
            assert(receiver.reject.calledWith(testMessage, testCallback));
        });
    });
    
    describe('#abandon', function(){        
        /*Tests_SRS_NODE_DEVICE_HTTP_16_001: [The ‘abandon’ method shall call the ‘abandon’ method of the receiver object and pass it the message and the callback given as parameters.] */
        it('calls the receiver `abandon` method', function () {
            transport.abandon(testMessage, testCallback);
            assert(receiver.abandon.calledWith(testMessage, testCallback));
        });
    });
});