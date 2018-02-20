/* Magic Mirror
 * Module: MMM-MoonCalc
 *
 * By Mykle1
 * MIT License
 */
Module.register("MMM-MoonCalc", {

    // Module config defaults.
    defaults: {
        useHeader: false,    // true if you want a header      
        header: "",          // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 15 * 1000, // Every minute

    },

    getStyles: function() {
        return ["MMM-MoonCalc.css"];
    },

//    getScripts: function() {
//		
//        return ["moment.js"];
//    },

		
	start: function() {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.MoonCalc = {};
        this.scheduleUpdate();
    },
	

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("Loading . . .");
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var MoonCalc = this.MoonCalc;
		

        var top = document.createElement("div");
        top.classList.add("list-row");

		
		// constellation info
        var constellation = document.createElement("div");
        constellation.classList.add("small", "bright", "constellation");
        constellation.innerHTML = "Constellation is " + MoonCalc.constellation;
        wrapper.appendChild(constellation);
		
		
		// distance
        var distance = document.createElement("div");
        distance.classList.add("small", "bright", "distance");
        distance.innerHTML = "Distance from Earth is " + Number(Math.round(MoonCalc.distance+'e2')+'e-2') + " km";
        wrapper.appendChild(distance);
		
		
		// age of current cycle
        var age = document.createElement("div");
        age.classList.add("small", "bright", "age");
        age.innerHTML = "Current cycle is " + Number(Math.round(MoonCalc.age+'e2')+'e-2') + " days old";
        wrapper.appendChild(age);
		
		
		// ecliptic latitude
        var latitude = document.createElement("div");
        latitude.classList.add("small", "bright", "latitude");
        latitude.innerHTML = "Ecliptic latitude is " + Number(Math.round(MoonCalc.ecliptic.latitude+'e2')+'e-2');
        wrapper.appendChild(latitude);
		
		
		// ecliptic longitude
        var longitude = document.createElement("div");
        longitude.classList.add("small", "bright", "longitude");
        longitude.innerHTML = "Ecliptic longitude is " + Number(Math.round(MoonCalc.ecliptic.longitude+'e2')+'e-2');
        wrapper.appendChild(longitude);
		
		
		// phase
        var phase = document.createElement("div");
        phase.classList.add("small", "bright", "phase");
        phase.innerHTML = "Current phase is " + MoonCalc.phase;
        wrapper.appendChild(phase);
		
		
		// trajectory
        var trajectory = document.createElement("div");
        trajectory.classList.add("small", "bright", "trajectory");
        trajectory.innerHTML = "Trajectory is " + MoonCalc.trajectory;
        wrapper.appendChild(trajectory);
		
		
		
        return wrapper;
		
    }, // closes getDom
    
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_ZODIAC') {
            this.hide();
        }  else if (notification === 'SHOW_ZODIAC') {
            this.show(1000);
        }
            
    },


    processMoonCalc: function(data) {
        this.MoonCalc = data;
	//	console.log(this.MoonCalc); // for checking
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getMoonCalc();
        }, this.config.updateInterval);
        this.getMoonCalc(this.config.initialLoadDelay);
    },

    getMoonCalc: function() {
        this.sendSocketNotification('GET_MOONCALC');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MOONCALC_RESULT") {
            this.processMoonCalc(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
