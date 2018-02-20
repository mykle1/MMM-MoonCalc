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
		this.Lune = {};
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
		var Lune = this.Lune;
		

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
		
		
		
		// spacer
        var spacer = document.createElement("div");
        spacer.classList.add("small", "bright", "spacer");
        spacer.innerHTML = " ~ ~ ~ ~ ~ ";
        wrapper.appendChild(spacer);
		
		
		
		// Lune Phase
        var phase = document.createElement("div");
        phase.classList.add("small", "bright", "lunePhase");
        phase.innerHTML = "Lune Phase " + Number(Math.round(Lune.phase+'e2')+'e-2') + " %";
        wrapper.appendChild(phase);
		
		
		// Lune illuminated
        var illuminated = document.createElement("div");
        illuminated.classList.add("small", "bright", "illuminated");
        illuminated.innerHTML = "The moon is " + Number(Math.round(Lune.illuminated+'e2')+'e-2') + "% illuminated";
        wrapper.appendChild(illuminated);
		
		
		// luneAge
        var luneAge = document.createElement("div");
        luneAge.classList.add("small", "bright", "luneAge");
        luneAge.innerHTML = "Lunar cycle is " + Number(Math.round(Lune.age+'e2')+'e-2') + " days old";
        wrapper.appendChild(luneAge);
		
		
		// luneDistance
        var luneDistance = document.createElement("div");
        luneDistance.classList.add("small", "bright", "luneDistance");
        luneDistance.innerHTML = "Distance from Earth is " + Number(Math.round(Lune.distance+'e2')+'e-2') + " km";
        wrapper.appendChild(luneDistance);
		
		
		// angular_diameter
        var angular_diameter = document.createElement("div");
        angular_diameter.classList.add("small", "bright", "angular_diameter");
        angular_diameter.innerHTML = "Angular diameter of moon is " + Number(Math.round(Lune.angular_diameter+'e2')+'e-2') + " &deg";
        wrapper.appendChild(angular_diameter);
		
		
		// sun_distance
        var sun_distance = document.createElement("div");
        sun_distance.classList.add("small", "bright", "sun_distance");
        sun_distance.innerHTML = "Distance to the sun is " + Number(Math.round(Lune.sun_distance+'e2')+'e-2') + " km";
        wrapper.appendChild(sun_distance);
		
		
		// sun_angular_diameter
        var sun_angular_diameter = document.createElement("div");
        sun_angular_diameter.classList.add("small", "bright", "sun_angular_diameter");
        sun_angular_diameter.innerHTML = "Angular diameter of sun is " + Number(Math.round(Lune.sun_angular_diameter+'e2')+'e-2') + " &deg";
        wrapper.appendChild(sun_angular_diameter);
		
		
		
		
		
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
	
	processLune: function(data) {
        this.Lune = data; 
	//	console.log(this.Lune); // for checking in dev console
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
		if (notification === "LUNE_RESULT") {
            this.processLune(payload);
            this.updateDom(this.config.fadeSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
