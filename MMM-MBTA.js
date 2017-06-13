Module.register("MMM-MBTA", {
    defaults: {
        apikey: "",
        updateInterval: 60, // In seconds
        baseUrl: "https://realtime.mbta.com/developer/api/v2/",
        stations: [ "Northeastern University Station" ],
    },
    
    getStyles: function() {
        return ["font-awesome.css"];
    },
    
    getHeader: function() {
        return this.data.header + " " + this.config.stations[0];
    },
    
    start: function() {
        if (this.config.updateInterval < 10) {
            this.config.updateInterval = 10;
        }
        
        this.loaded = false;
        // Dictionary sincerely stolen from https://github.com/mbtaviz/mbtaviz.github.io/
        // and green line dictionary data taken from https://github.com/mbtaviz/green-line-release/
        var stationDict = {"Airport":"place-aport","Aquarium":"place-aqucl","Beachmont":"place-bmmnl","Bowdoin":"place-bomnl","Government Center":"place-gover","Maverick":"place-mvbcl","Orient Heights":"place-orhte","Revere Beach":"place-rbmnl","Suffolk Downs":"place-sdmnl","Wonderland":"place-wondl","Wood Island":"place-wimnl","Back Bay":"place-bbsta","Chinatown":"place-chncl","Community College":"place-ccmnl","Forest Hills":"place-forhl","Green Street":"place-grnst","Haymarket":"place-haecl","Jackson Square":"place-jaksn","Malden Center ":"place-mlmnl","Mass Ave":"place-masta","North Station":"place-north","Oak Grove":"place-ogmnl","Roxbury Crossing":"place-rcmnl","Ruggles":"place-rugg","Stony Brook":"place-sbmnl","Sullivan Square":"place-sull","Tufts Medical Center":"place-tumnl","Wellington ":"place-welln","State Street":"place-state","Alewife":"place-alfcl","Andrew Square":"place-andrw","Ashmont":"place-asmnl","Braintree":"place-brntn","Broadway":"place-brdwy","Central Square":"place-cntsq","Charles MGH":"place-chmnl","Davis Square":"place-davis","Fields Corner":"place-fldcr","Harvard":"place-harsq","JFK/U Mass":"place-jfk","Kendall Square":"place-knncl","North Quincy":"place-nqncy","Park Street":"place-pktrm","Porter Square":"place-portr","Quincy Adams":"place-qamnl","Quincy Center":"place-qnctr","Savin Hill":"place-shmnl","Shawmut":"place-smmnl","South Station":"place-sstat","Wollaston":"place-wlsta","Downtown Crossing":"place-dwnxg","Lechmere Station":"place-lech","Science Park Station":"place-spmnl","North Station":"place-north","Haymarket Station":"place-haecl","Government Center Station":"place-gover","Park Street":"place-pktrm","Boylston Street Station":"place-boyls","Arlington Station":"place-armnl","Copley Station":"place-coecl","Prudential Station":"place-prmnl","Symphony Station":"place-symcl","Northeastern University Station":"place-nuniv","Museum of Fine Arts Station":"place-mfa","Longwood Medical Area Station":"place-lngmd","Brigham Circle Station":"place-brmnl","Fenwood Road Station":"place-fenwd","Mission Park Station":"place-mispk","Riverway Station":"place-rvrwy","Back of the Hill Station":"place-bckhl","Heath Street Station":"place-hsmnl","Hynes Convention Center":"place-hymnl","Kenmore Station":"place-kencl","Fenway Station":"place-fenwy","Longwood Station":"place-longw","Brookline Village Station":"place-bvmnl","Brookline Hills Station":"place-brkhl","Beaconsfield Station":"place-bcnfd","Reservoir Station":"place-rsmnl","Chestnut Hill Station":"place-chhil","Newton Centre Station":"place-newto","Newton Highlands Station":"place-newtn","Eliot Station":"place-eliot","Waban Station":"place-waban","Woodland Station":"place-woodl","Riverside Station":"place-river","Saint Mary Street Station":"place-smary","Hawes Street Station":"place-hwsst","Kent Street Station":"place-kntst","Saint Paul Street":"place-stpul","Coolidge Corner Station":"place-cool" ,"Summit Avenue Station":"place-sumav","Brandon Hall Station":"place-bndhl","Fairbanks Street Station":"place-fbkst","Washington Square Station":"place-bcnwa","Tappan Street Station":"place-tapst","Dean Road Station":"place-denrd","Englewood Avenue Station":"place-engav","Cleveland Circle Station":"place-clmnl","Blandford Street Station":"place-bland","Boston University East Station":"place-buest","Boston University Central Station":"place-bucen","Boston University West Station":"place-buwst","Saint Paul Street":"place-stplb","Pleasant Street Station":"place-plsgr","Babcock Street Station":"place-babck","Packards Corner Station":"place-brico","Harvard Avenue Station":"place-harvd","Griggs Street Station":"place-grigg","Allston Street Station":"place-alsgr","Warren Street Station":"place-wrnst","Washington Street Station":"place-wascm","Sutherland Road Station":"place-sthld","Chiswick Road Station":"place-chswk","Chestnut Hill Avenue Station":"place-chill","South Street Station":"place-sougr","Boston College Station":"place-lake"};
        
        
        // Convert colloquial names to stop ids
        this.stations = [];
        for (let i = 0; i < this.config.stations.length; i++) {
            this.stations[i] = stationDict[this.config.stations[i]];
        }
        
        this.stationData = [];
        
        Log.info(this.stations);
        
    },
    
    getDom: function() {
        var wrapper = document.createElement("div");
        var returnWrapper = false;
        
        if (!this.loaded) {
            wrapper.innerHTML += "LOADING";
            wrapper.className = "dimmed light small";
            returnWrapper = true;
        }
        
        
        // Check if an API key is in the config
        if (this.config.apikey === "") {
            if (wrapper.innerHTML !== "") {
                wrapper.innerHTML += "<br/>";
            }
            wrapper.innerHTML += "Please set a MBTA api key! This module won't load otherwise!";
            wrapper.className = "dimmed light small";
            return wrapper; // Do not continue updating
        } else if (this.config.apikey === "wX9NwuHnZU2ToO7GmGR9uw") {
            if (wrapper.innerHTML !== "") {
                wrapper.innerHTML += "<br/>";
            }
            wrapper.innerHTML += "Warning! You are using a dev api key!";
            wrapper.className = "dimmed light small";
            returnWrapper = true;
        }
    
        
        var table = document.createElement("table");
        table.className = "small";
        for (let i = 0; i < this.stationData.length; i++) {
            var row = document.createElement("tr");
            table.appendChild(row);
            
            var symbolCell = document.createElement("td");
            switch (this.stationData[i].routeType) {
                case "0":
                    symbolCell.className = "fa fa-subway";
                    break;
                case "3":
                    symbolCell.className = "fa fa-bus";
                    break;
                default:
                    symbolCell.className = "fa fa-question-circle-o";
                    
            }
            row.appendChild(symbolCell);
            
            var descCell = document.createElement("td");
            descCell.innerHTML = this.stationData[i].tripSign;
            descCell.className = "align-left bright";
            row.appendChild(descCell);
    
            var preAwayCell = document.createElement("td");
            var preAwayTime = this.stationData[i].preAway;
            if (parseInt(preAwayTime) < 10) {
                preAwayCell.innerHTML = "Now";
            } else {
                preAwayCell.innerHTML = this.stationData[i].preAway;
            }
            row.appendChild(preAwayCell);
        }
        
        this.scheduleUpdate();
        
        if (returnWrapper) {
            var div = document.createElement("div");
            div.appendChild(wrapper);
            div.appendChild(table);
            return div;
        }
        
        return table;
    },
    
    // Note to self: This is called by getDom(), which this eventually calls...
    // Shouldn't be a problem... right? 
    scheduleUpdate: function(amt) {
        var interval;
        if (amt !== undefined) {
            interval = amt;
        } else {
            interval = this.config.updateInterval;
        }
        
        var self = this;
        
        setTimeout(function() {
            self.fetchData();
            self.updateDom();
        }, interval * 1000);
    },
    
    fetchData: function() {
        for (let stop in this.stations) {
            var url = this.formUrl(this.stations[stop]);
            var MBTARequest = new XMLHttpRequest();
            MBTARequest.open("GET", url, true);
            
            var self = this;
            MBTARequest.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        self.processData(JSON.parse(this.response));
                    }
                }
            };
            
            MBTARequest.send();
        }
        
    },
    
    // Gets API URL based off user settings
    formUrl: function(stopId) {
        var url = this.config.baseUrl;
        
        // query goes here
        url += "predictionsbystop";
        
        url += "?api_key=" + this.config.apikey; 
        url += "&format=json";
        url += "&stop=" + stopId;
        
        return url;
    },
    
    processData: function(data) {
        /* Nice little list of everything we have
        Each element in this array is an entry on our displayed table.
        Format should be
        {"routeType": int,
         "dirName": string,
         "tripName": string,
         "tripSign": string,
         "preDt": int,
         "preAway": int}
         */
         
        this.stationData = [ ] // clear all data.
        
        // Please, if you know how to simplify this and make this readable, I would love you forever.
        var curDir;
        for (let mode = 0; mode < data["mode"].length; mode++) {
            curDir = data["mode"][mode];
            var routeType = curDir.route_type;
            
            curDir = curDir["route"][0]["direction"];
            for (let direction = 0; direction < curDir.length; direction++) {
                var dirName = curDir[direction].direction_name;
                
                for (let trip = 0; trip < curDir[direction]["trip"].length; trip++) {
                    var tripName = curDir[direction]["trip"][trip].trip_name,
                        tripSign = curDir[direction]["trip"][trip].trip_headsign,
                        preDt = curDir[direction]["trip"][trip].pre_dt;
                        preAway = curDir[direction]["trip"][trip].pre_away;
                    this.stationData.push({
                        routeType: routeType,
                        dirName: dirName,
                        tripName: tripName,
                        tripSign: tripSign,
                        preDt: preDt,
                        preAway: preAway
                    });
                }
            }
        }
        
        this.stationData.sort(function(a, b) {
            return a.preDt - b.preDt;
        });
        this.loaded = true;
        
        Log.info(this.stationData);
    },
});