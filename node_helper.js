/* Magic Mirror
 * Module: MMM-MoonCalc
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
var MoonCalc = require('mooncalc');
var lune = require('lune');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getMoonCalc: function(url) {
    //    var self= this;
		// get datas for current day : 
		var date = new Date();
		var moonDatas = MoonCalc.datasForDay(date);
	//	console.log(moonDatas);
    	this.sendSocketNotification("MOONCALC_RESULT", moonDatas);
		
		this.getLune();
    },
	
	
	getLune: function(url) {
    //    var self= this;
		var lune = require('lune');
		var current_phase = lune.phase();
		console.log(current_phase);
    	this.sendSocketNotification("LUNE_RESULT", current_phase);
    },
	

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_MOONCALC') {
            this.getMoonCalc(payload);
        }
		if (notification === 'GET_LUNE') {
            this.getLune(payload);
        }
    }
});
