var maxGraphs = 15;


function pushData(){
    var dailyMultGraph = 1 + (countDailyWeight() === 0 ? 0 : getDailyHeliumValue(countDailyWeight()) / 100);

    allSaveData.push({
        //AAHelium: autoTrimpSettings.APValueBoxes.Helium,
        //AAAttack: autoTrimpSettings.APValueBoxes.Attack,
        //AAHealth: autoTrimpSettings.APValueBoxes.Health,
        //AAFluffy: autoTrimpSettings.APValueBoxes.Fluffy,
        //AADG: autoTrimpSettings.APValueBoxes.DG,
        //maxVoids: ATMaxVoids,
        totalPortals: game.global.totalPortals,
        heliumOwned: game.resources.helium.owned,
        currentTime: getGameTime(),
        portalTime: game.global.portalTime,
        world: game.global.world,
        challenge: game.global.challengeActive,
        voids: game.global.totalVoidMaps,
        heirlooms: {"value": game.stats.totalHeirlooms.value, "valueTotal":game.stats.totalHeirlooms.valueTotal},
        nullifium: recycleAllExtraHeirlooms(true),
        gigas: game.upgrades.Gigastation.done,
        gigasleft: game.upgrades.Gigastation.allowed - game.upgrades.Gigastation.done,
        trimps: trimpsRealMax,
        trimpsBase: trimpsRealMax / (Math.pow(1.1, game.portal.Carpentry.level) * (1 + 0.0025 * game.portal.Carpentry_II.level)),
        coord: game.upgrades.Coordination.done,
        lastwarp: game.global.lastWarp,
        essence: getTotalDarkEssenceCount(),
        hehr: dailyMultGraph * game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned))*100,
        helife: game.resources.helium.owned / (game.global.totalHeliumEarned - game.resources.helium.owned)*100,
        overkill: GraphsVars.OVKcellsInWorld,
        zonetime: GraphsVars.ZoneStartTime,
        mapbonus: GraphsVars.MapBonus,
        magmite: game.global.magmite,
        magmamancers: game.jobs.Magmamancer.owned,
        fluffy: game.global.fluffyExp,
        nursery: game.buildings.Nursery.purchased
    });
    //only keep 15 portals worth of runs to prevent filling storage
    if (allSaveData.length >= 9500) maxGraphs--;
    clearData(maxGraphs);
    safeSetItems('allSaveData', JSON.stringify(allSaveData));
}


//Initialize the saved data objects, and load data/grab from browser if found.
var allSaveData = [];
var graphData = [];
var tmpGraphData = JSON.parse(localStorage.getItem('allSaveData'));
if (tmpGraphData !== null){
    console.log('Graphs: Found allSaveData (portal runs data). Yay!');
    allSaveData = tmpGraphData;
}
MODULES["graphs"] = {};
MODULES["graphs"].useDarkAlways = false;    //set this to True to use Dark Graphs always.

//Import the Chart Libraries
var head = document.getElementsByTagName('head')[0];
var chartscript = document.createElement('script');
chartscript.type = 'text/javascript';
chartscript.src = 'https://code.highcharts.com/highcharts.js';
head.appendChild(chartscript);


//Create the graph button and div
var newItem = document.createElement("TD");
newItem.appendChild(document.createTextNode("Graphs"));
newItem.setAttribute("class", "btn btn-default");
newItem.setAttribute("onclick", "autoToggleGraph(); drawGraph();");
var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);
document.getElementById("settingsRow").innerHTML += '<div id="graphParent" style="display: none; height: 600px; overflow: auto;"><div id="graph" style="margin-bottom: 10px;margin-top: 5px; height: 530px;"></div>';
document.getElementById("graphParent").innerHTML += '<div id="graphFooter" style="height: 50px;font-size: 1em;"><div id="graphFooterLine1" style="display: -webkit-flex;flex: 0.75;flex-direction: row; height:30px;"></div><div id="graphFooterLine2"></div></div>';
//Create the buttons in the graph Footer:
var $graphFooter = document.getElementById('graphFooterLine1');
//$graphFooter.innerHTML += '\
//Create the dropdown for what graph to show    (these correspond to headings in setGraph() and have to match)
var graphList = ['Efficiency and Stacks', 'Helium - He/Hr', 'Helium - Total', 'Helium - He/Hr Instant', 'Helium - He/Hr Delta', 'HeHr % / LifetimeHe', 'He % / LifetimeHe', 'Clear Time', 'Cumulative Clear Time', 'Run Time', 'Map Bonus', 'Void Maps', 'Void Map History', 'Loot Sources', 'Coordinations', 'GigaStations', 'Unused Gigas', 'Last Warpstation', 'Trimps', 'Trimps Base', 'Nullifium Gained', 'Dark Essence', 'Dark Essence PerHour', 'OverkillCells', 'Magmite', 'Magmamancers', 'Fluffy XP', 'Fluffy XP PerHour', 'Nurseries'];
var $graphSel = document.createElement("select");
$graphSel.id = 'graphSelection';
$graphSel.setAttribute("style", "");
//$graphSel.setAttribute("onmouseover", 'tooltip(\"Graph\", \"customText\", event, \"What graph would you like to display?\")');
//$graphSel.setAttribute("onmouseout", 'tooltip("hide")');
$graphSel.setAttribute("onchange", "drawGraph()");
for (var item in graphList){
    var $opt = document.createElement("option");
    $opt.value = graphList[item];
    $opt.text = graphList[item];
    $graphSel.appendChild($opt);
}
$graphFooter.appendChild($graphSel);
//just write it in HTML instead of a million lines of DOM javascript.
$graphFooter.innerHTML += '\
<div><button onclick="drawGraph(true,false)" style="margin-left:0.5em; width:2em;">↑</button></div>\
<div><button onclick="drawGraph(false,true)" style="margin-left:0.5em; width:2em;">↓</button></div>\
<div><button onclick="drawGraph()" style="margin-left:0.5em;">Refresh</button></div>\
<div style="flex:0 100 5%;"></div>\
<div><input type="checkbox" id="clrChkbox" onclick="toggleClearButton();"></div>\
<div style="margin-left: 0.5vw;"><button id="clrAllDataBtn" onclick="clearData(null,true); drawGraph();" class="btn" disabled="" style="flex:auto; padding: 2px 6px;border: 1px solid white;">Clear All Previous Data</button></div>\
<div style="flex:0 100 5%;"></div>\
<div style="flex:0 2 3.5vw;"><input style="width:100%;min-width: 40px;" id="deleteSpecificTextBox"></div>\
<div style="flex:auto; margin-left: 0.5vw;"><button onclick="deleteSpecific(); drawGraph();">Delete Specific Portal</button></div>\
<div style="flex:0 100 5%;"></div>\
<div style="float:right; visibility:hidden; margin-right: 0.5vw;"><button onclick="addGraphNoteLabel()">Add Note/Label</button></div>\
<div style="float:right; margin-right: 0.5vw;"><button onclick="toggleSpecificGraphs()">Invert Selection</button></div>\
<div style="float:right; margin-right: 2vw;"><button onclick="toggleAllGraphs()">All Off/On</button></div>';
//TODO: make the overall hover tooltip better and seperate individual help into each button tooltip.
document.getElementById("graphFooterLine2").innerHTML += '\
<span style="float: left;" onmouseover=\'tooltip(\"Tips\", \"customText\", event, \"You can zoom by dragging a box around an area. You can turn portals off by clicking them on the legend. Quickly view the last portal by clicking it off, then Invert Selection. Or by clicking All Off, then clicking the portal on. To delete a portal, Type its portal number in the box and press Delete Specific. Using negative numbers in the Delete Specific box will KEEP that many portals (starting counting backwards from the current one), ie: if you have Portals 1000-1015, typing -10 will keep 1005-1015. There is a browser data storage limitation of 10MB, so do not exceed 20 portals-worth of data.\")\' onmouseout=\'tooltip(\"hide\")\'>Tips: Hover for usage tips.</span>\
<input style="height: 20px; float: right; margin-right: 0.5vw;" type="checkbox" id="rememberCB" checked="true">\
<span style="float: right; margin-right: 0.5vw;">Try to Remember Which Portals are Selected when switching between Graphs:</span>\
<input onclick="toggleDarkGraphs()" style="height: 20px; float: right; margin-right: 0.5vw;" type="checkbox" id="blackCB">\
<span style="float: right; margin-right: 0.5vw;">Black Graphs:</span>';
//handle the locking mechanism checkbox for the Clear all previous data button:
function toggleClearButton(){
    document.getElementById('clrAllDataBtn').disabled=!document.getElementById('clrChkbox').checked;
}

//Dark graphs by Unihedron
//game.options.menu.darkTheme.enabled == 2 (also ok 0==black)
// if (MODULES["graphs"].useDarkAlways)
    // addDarkGraphs();
//Theme Changer is below
function addDarkGraphs(){
    var $oldlink = document.getElementById("dark-graph.css");
    if ($oldlink) return;
    var $link = document.createElement('link');
    $link.rel = "stylesheet";
    $link.type = "text/css";
    $link.id = 'dark-graph.css';
    //basepath ref comes from the userscripts
    $link.href = basepath + 'dark-graph.css';
    document.head.appendChild($link);
    debug("Adding dark-graph.css file","graphs");
}
function removeDarkGraphs(){
    var $link = document.getElementById("dark-graph.css");
    if (!$link) return;
    document.head.removeChild($link);
    debug("Removing dark-graph.css file","graphs");
}
function toggleDarkGraphs(){
    if (game) {
        var $link = document.getElementById("dark-graph.css");
        var blackCB = document.getElementById('blackCB').checked;
        if ((!$link && (game.options.menu.darkTheme.enabled == 0 || game.options.menu.darkTheme.enabled == 2)) || MODULES["graphs"].useDarkAlways || blackCB)
            addDarkGraphs();
        else if ($link && (game.options.menu.darkTheme.enabled == 1 || game.options.menu.darkTheme.enabled == 3 || !blackCB))
            removeDarkGraphs();
    }
}
//Runs once on startup to color the graph footer elements Black.
//Then every time the theme is changed. Called out of updateCustomButtons() loop in SettingsGUI.
var lastTheme=-1;
MODULES["graphs"].themeChanged = function() {
    //Everything else in Settings, (for now: all Inputs, Dropdowns)
    if (game && game.options.menu.darkTheme.enabled != lastTheme) {
        //GRAPHS:
        toggleDarkGraphs();
        debug("Theme change - AutoTrimps styles updating...");
        function color1(el,i,arr) {
            if(game.options.menu.darkTheme.enabled != 2)
                el.style.color = "black";
            else
                el.style.color = "";
        };
        //GRAPHS:
        function color2(el,i,arr) {
            if (el.id == 'graphSelection') {
                if(game.options.menu.darkTheme.enabled != 2)
                    el.style.color = "black";
                return;
            }
        };
        var inpts1 = document.getElementsByTagName("input");
        var drops2 = document.getElementsByTagName("select");
        var footer3 = document.getElementById("graphFooterLine1").children;
        for (let el of inpts1) { color1(el); };
        for (let el of drops2) { color1(el); };
        for (let el of footer3) { color1(el); };
        for (let el of footer3) { color2(el); };
    }
    if (game)
        lastTheme = game.options.menu.darkTheme.enabled;
};
MODULES["graphs"].themeChanged();

//Remember Checkbox
var rememberSelectedVisible = [];
function saveSelectedGraphs() {
    rememberSelectedVisible = [];
    for (var i=0; i < chart1.series.length; i++){
        var run = chart1.series[i];
        rememberSelectedVisible[i] = run.visible;
    }
}
function applyRememberedSelections() {
    for (var i=0; i < chart1.series.length; i++){
        var run = chart1.series[i];
        if (rememberSelectedVisible[i] == false)
            run.hide();
    }
}

//Invert graph selections
function toggleSpecificGraphs() {
    for (var i=0; i < chart1.series.length; i++){
        var run = chart1.series[i];
        run.visible ? run.hide() : run.show();
    }
}

//Turn all graphs on/off (to the opposite of which one we are closer to)
function toggleAllGraphs() {
    var count = 0;
    for (var i=0; i < chart1.series.length; i++){
        var run = chart1.series[i];
        if (run.visible)
            count++;
    }
    for (var i=0; i < chart1.series.length; i++){
        var run = chart1.series[i];
        if (count > chart1.series.length/2)
            run.hide();
        else
            run.show();
    }
}

function clearData(portal,clrall) {
    //clear data of runs with portalnumbers prior than X (15) away from current portal number. (or 0 = clear all)
    if(!portal)
        portal = 0;
    if (!clrall) {
        while(allSaveData[0].totalPortals < game.global.totalPortals - portal) {
            allSaveData.shift();
        }
    } else {
        while(allSaveData[0].totalPortals != game.global.totalPortals) {
            allSaveData.shift();
        }
    }
}

//delete a specific portal number's graphs. use negative numbers to keep that many portals.
function deleteSpecific() {
    var txtboxvalue = document.getElementById('deleteSpecificTextBox').value;
    if (txtboxvalue == "")
        return;
    if (parseInt(txtboxvalue) < 0) {
        clearData(Math.abs(txtboxvalue));
    } else {
        for (var i = allSaveData.length-1; i >= 0; i--) {
            if (allSaveData[i].totalPortals == txtboxvalue)
                allSaveData.splice(i, 1);
        }
    }
}

function addGraphNoteLabel() {
    debug("GOTCHA This feature is not actually written, yet...");
}

function autoToggleGraph() {
    if (game.options.displayed) toggleSettingsMenu();
    var $item = document.getElementById('autoSettings');
    if ($item) {
    if ($item.style.display === 'block') $item.style.display = 'none';
    }
    var $item = document.getElementById('autoTrimpsTabBarMenu');
    if ($item) {
    if ($item.style.display === 'block') $item.style.display = 'none';
    }
    var $graph = document.getElementById('graphParent');
    if ($graph.style.display === 'block') $graph.style.display = 'none';
    else {
        $graph.style.display = 'block';
        setGraph();
    }
}

function escapeATWindows() {
    var $tooltip = document.getElementById("tooltipDiv");
    if ($tooltip.style.display != 'none') {
        cancelTooltip();
        return;
    }
    //Turn off "Settings"/"AutoTrimpsSettings"/"Graphs" Menu on escape.
    if (game.options.displayed) toggleSettingsMenu();
    var $item = document.getElementById('autoSettings');
    if ($item.style.display === 'block') $item.style.display = 'none';
    var $item = document.getElementById('autoTrimpsTabBarMenu');
    if ($item.style.display === 'block') $item.style.display = 'none';
    var $graph = document.getElementById('graphParent');
    if ($graph.style.display === 'block') $graph.style.display = 'none';
}
document.addEventListener("keydown",function (event) {
    //Hotkeys have to be enabled, and all these conditions have to be met or else we cant use the hotkey.
	if (game.options.menu.hotkeys.enabled == 1 && !game.global.preMapsActive && !game.global.lockTooltip && !ctrlPressed && !heirloomsShown && event.keyCode == 27) //27 == escape
            escapeATWindows();
    //TODO this currently escapes out of both tooltips and the settings and its already checking for locked tooltips. Maybe if there IS a tooltip open we should just close that first.
    //Turn off "Settings"/"AutoTrimpsSettings"/"Graphs" Menu on escape.
}, true);


function getTotalDarkEssenceCount() {
    var purchased = 10 * (Math.pow(3, countPurchasedTalents()) - 1) / (3 - 1);
    return game.global.essence + purchased;
}

function initializeData() {
    //initialize fresh with a blank array if needed
    if (allSaveData === null) {
        allSaveData = [];
    }
    //fill the array with the first data point
    if (allSaveData.length === 0) {
        pushData();
    }
}

var GraphsVars = {};
function InitGraphsVars() {
    GraphsVars.currentPortal = 0;
    GraphsVars.OVKcellsInWorld = 0;
    GraphsVars.lastOVKcellsInWorld = 0;
    GraphsVars.currentworld = 0;
    GraphsVars.lastrunworld = 0;
    GraphsVars.aWholeNewWorld = false;
    GraphsVars.lastZoneStartTime = 0;
    GraphsVars.ZoneStartTime = 0;
    GraphsVars.MapBonus = 0;
    GraphsVars.aWholeNewPortal = 0;
    GraphsVars.currentPortal = 0;
}
InitGraphsVars();

//main function of the graphs script - runs every second.
function gatherInfo() {
    //dont push updates if the game is paused. fix import on pause Clear Time problem
    if (game.options.menu.pauseGame.enabled) return;
    //make sure data structures are ready
    initializeData();
    //Track portal.
    GraphsVars.aWholeNewPortal = GraphsVars.currentPortal != game.global.totalPortals;
    if (GraphsVars.aWholeNewPortal){
        GraphsVars.currentPortal = game.global.totalPortals;
        //clear filtered loot data upon portaling. < 5 check to hopefully throw out bone portal shenanigans
        filteredLoot = {
            'produced': {metal: 0, wood: 0, food: 0, gems: 0},
            'looted': {metal: 0, wood: 0, food: 0, gems: 0}
        }
    }
    //Track zone.
    GraphsVars.aWholeNewWorld = GraphsVars.currentworld != game.global.world;
    if (GraphsVars.aWholeNewWorld){
        GraphsVars.currentworld = game.global.world;
        //if we have reached a new zone, push a new data point (main)
        if (allSaveData.length > 0 && allSaveData[allSaveData.length - 1].world != game.global.world)
            pushData();
        
        //reset stuff,prepare tracking variables.
        GraphsVars.OVKcellsInWorld = 0;
        GraphsVars.ZoneStartTime = 0;
        GraphsVars.MapBonus = 0;
    }
    //Overkill cell tracking:
    if (game.options.menu.overkillColor.enabled == 0) toggleSetting('overkillColor');   //make sure the setting is on.
    //Detecting the liquification through liquimp
    if (!game.global.mapsActive && game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name == "Liquimp")
        GraphsVars.OVKcellsInWorld = 100;
    else
        //track how many overkill world cells we have beaten in the current level. (game.stats.cellsOverkilled.value for the entire run)
        GraphsVars.OVKcellsInWorld = document.getElementById("grid").getElementsByClassName("cellColorOverkill").length;
    //track time in each zone for better graphs
    GraphsVars.ZoneStartTime = getGameTime() - game.global.zoneStarted;
    //track MapBonus
    GraphsVars.MapBonus = game.global.mapBonus;
}

var dataBase = {}
var portalExistsArray = [];
var portalRunArray = [];
var portalRunIndex = 0;
var graphsPretty = true;

//////////////////////////////////////
//MAIN GRAPHING FUNCTION - the meat.//
//////////////////////////////////////
function drawGraph(minus,plus) {
    var $item = document.getElementById('graphSelection');
    //Cycle Through Graphs with GUI Up/Down Arrow Buttons
    if (minus) {
        $item.selectedIndex--;
        if ($item.selectedIndex < 0)
            $item.selectedIndex = 0;
    }
    else if (plus) {
        if ($item.selectedIndex != ($item.options.length-1))
            $item.selectedIndex++;
    }
    setGraphData($item.value);
}

function setGraphData(graph) {
    var title, xTitle, yTitle, yTitle2, yType, yType2, names, valueSuffix, series, formatter, xminFloor=1, yminFloor=null, yminFloor2=null;
    
    var precision = 0;
    var graphsPretty = true;
    var oldData = JSON.stringify(graphData);
    valueSuffix = '';

    switch (graph) {
            case 'Efficiency and Stacks':
            var names = [];
            var arr1 = [];
            var arr2 = [];
            if(typeof stanceStats.cmp !== 'undefined')
                for(var i = 0; i < stanceStats.cmp.length; i++){
                    if(!worldArray[i])
                        names.push(i);
                    else if(worldArray[i].corrupted === undefined)
                        names.push(i + "empty");
                    else
                        names.push(i + worldArray[i].corrupted);
                    arr1.push([names[i], stanceStats.cmp[i]]);
                    arr2.push([names[i], stanceStats.stacks[i]]);
                }
            graphData = [];
            graphData[0] = {name: 'He/hr Efficiency', data: arr1};
            graphData[1] = {name: 'Stacks', data: arr2, yAxis: 1};
            var name = (game.global.world == 500 ? "Spire IV" : "Zone " + game.global.world);
            title = name + ' Helium Efficiency and Stacks';
            xTitle = 'Cell';
            yTitle = 'Helium Efficiency';
            yTitle2 = 'Stacks';
            yType2 = 'Linear';
            yminFloor2 = 0;
            //precision = 3;
            break;    
        case 'Helium - He/Hr':
            graphData = allPurposeGraph('heliumhr',true,null,
                    function specialCalc(e1,e2) {
                        return Math.floor(e1.heliumOwned / ((e1.currentTime - e1.portalTime) / 3600000));
                    });
            title = 'Helium/Hour (Cumulative)';
            xTitle = 'Zone';
            yTitle = 'Helium/Hour';
            yType = 'Linear';
            yminFloor=0;
            break;
        case 'Helium - Total':
            graphData = allPurposeGraph('heliumOwned',true,null,
                    function specialCalc(e1,e2) {
                        return Math.floor(e1.heliumOwned);
                    });
            title = 'Helium (Portal Total)';
            xTitle = 'Zone';
            yTitle = 'Helium';
            yType = 'Linear';
            break;     
        case 'Helium - He/Hr Instant':
            var currentPortal = -1;
            var currentZone = -1;
            graphData = [];
            var nowhehr=0;var lasthehr=0;
            var dailyMultGraph = (countDailyWeight() === 0 ? 1 : 1 + getDailyHeliumValue(countDailyWeight()) / 100); //daily mult
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    if(allSaveData[i].world == 1 && currentZone != -1 )
                        graphData[graphData.length -1].data.push(0);

                    if(currentZone == -1 || allSaveData[i].world != 1) {
                        var loop = allSaveData[i].world;
                        while (loop > 0) {
                            graphData[graphData.length -1].data.push(0);
                            loop--;
                        }
                    }
                    nowhehr = 0; lasthehr = 0;
                }
                if(currentZone < allSaveData[i].world && currentZone != -1) {
                    nowhehr = Math.floor((allSaveData[i].heliumOwned - allSaveData[i-1].heliumOwned)*dailyMultGraph / ((allSaveData[i].currentTime - allSaveData[i-1].currentTime) / 3600000));
                    graphData[graphData.length - 1].data.push(nowhehr);
                }
                currentZone = allSaveData[i].world;
            }
            title = 'Helium/Hour Instantaneous - between current and last zone.';
            xTitle = 'Zone';
            yTitle = 'Helium/Hour per each zone';
            yType = 'Linear';
            yminFloor=null;
            break;
        case 'Helium - He/Hr Delta':
            var currentPortal = -1;
            var currentZone = -1;
            graphData = [];
            var nowhehr=0;var lasthehr=0;
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    if(allSaveData[i].world == 1 && currentZone != -1 )
                        graphData[graphData.length -1].data.push(0);

                    if(currentZone == -1 || allSaveData[i].world != 1) {
                        var loop = allSaveData[i].world;
                        while (loop > 0) {
                            graphData[graphData.length -1].data.push(0);
                            loop--;
                        }
                    }
                    nowhehr = 0; lasthehr = 0;
                }
                if(currentZone < allSaveData[i].world && currentZone != -1) {
                    nowhehr = Math.floor(allSaveData[i].heliumOwned / ((allSaveData[i].currentTime - allSaveData[i].portalTime) / 3600000));
                    if (lasthehr == 0)
                        lasthehr = nowhehr;
                    graphData[graphData.length - 1].data.push(nowhehr-lasthehr);
                }
                currentZone = allSaveData[i].world;
                lasthehr = nowhehr;
            }
            title = 'Helium/Hour Delta - between current and last zone.';
            xTitle = 'Zone';
            yTitle = 'Difference in Helium/Hour';
            yType = 'Linear';
            yminFloor=null;
            break;
        case 'HeHr % / LifetimeHe':
            graphData = allPurposeGraph('hehr',true,null);
            title = 'He/Hr % of LifetimeHe';
            xTitle = 'Zone';
            yTitle = 'He/Hr % of LifetimeHe';
            yType = 'Linear';
            graphsPretty = false;
            precision = 4;
            break;
        case 'He % / LifetimeHe':
            graphData = allPurposeGraph('helife',true,null);
            title = 'He % of LifetimeHe';
            xTitle = 'Zone';
            yTitle = 'He % of LifetimeHe';
            yType = 'Linear';
            graphsPretty = false;
            precision = 4;
            break;
        case 'Clear Time':
            graphData = allPurposeGraph('cleartime1',true,null,
                    function specialCalc(e1,e2) {
                        return (((e1.currentTime - e2.currentTime)-(e1.portalTime - e2.portalTime)) / 1000);
                    });     
            title = 'Time to clear zone';
            xTitle = 'Zone';
            yTitle = 'Clear Time';
            yType = 'datetime';
            formatter =  function () {
                var ser = this.series;
                return '<span style="color:' + ser.color + '" >�?</span> ' +
                        ser.name + ': <b>' +
                        Highcharts.dateFormat('%H:%M:%S', 1000*this.y) + '</b><br>';
            };
            yminFloor=0;
            break;
        case 'Cumulative Clear Time':
            graphData = allPurposeGraph('cumucleartime1',true,null,
                    function specialCalc(e1,e2) {
                        return Math.round(((e1.currentTime - e2.currentTime)-(e1.portalTime - e2.portalTime)) / 1000);
                    },true);
            /*graphData = allPurposeGraph('cumucleartime2',true,null,
                    function specialCalc(e1,e2) {
                        return Math.round(e1.zonetime);
                    },true);*/
            title = 'Cumulative Time (at END of zone#)';
            xTitle = 'Zone';
            yTitle = 'Cumulative Clear Time';
            yType = 'datetime';
            formatter =  function () {
                var ser = this.series;
                return '<span style="color:' + ser.color + '" >�?</span> ' +
                        ser.name + ': <b>' +
                        Highcharts.dateFormat('%H:%M:%S', 1000*this.y) + '</b><br>';
            };
            yminFloor=0;
            break;
        case 'Run Time':
            var currentPortal = -1;
            var theChallenge = '';
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    if(currentPortal == -1) {
                        theChallenge = allSaveData[i].challenge;
                        currentPortal = allSaveData[i].totalPortals;
                        graphData.push({
                        name: 'Run Time',
                        data: [],
                        type: 'column'
                    });
                        continue;
                    }
                    var theOne = allSaveData[i-1];
                    var runTime = theOne.currentTime - theOne.portalTime;
                    graphData[0].data.push([theOne.totalPortals, runTime]);
                    theChallenge = allSaveData[i].challenge;
                    currentPortal = allSaveData[i].totalPortals;
                }
            }
            title = 'Total Run Time';
            xTitle = 'Portal';
            yTitle = 'Time';
            yType = 'datetime';
            formatter =  function () {
                var ser = this.series;
                return '<span style="color:' + ser.color + '" >�?</span> ' +
                        ser.name + ': <b>' +
                        Highcharts.dateFormat('%H:%M:%S', this.y) + '</b><br>';
            };
            break;
        case 'Map Bonus':
            graphData = allPurposeGraph('mapbonus',true,"number");
            title = 'Map Bonus History';
            xTitle = 'Zone';
            yTitle = 'Map Bonus Stacks';
            yType = 'Linear';
            break;
        case 'Void Maps':
            var currentPortal = -1;
            var totalVoids = 0;
            var theChallenge = '';
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    if(currentPortal == -1) {
                        theChallenge = allSaveData[i].challenge;
                        currentPortal = allSaveData[i].totalPortals;
                        graphData.push({
                        name: 'Void Maps',
                        data: [],
                        type: 'column'
                    });
                        continue;
                    }
                    graphData[0].data.push([allSaveData[i-1].totalPortals, totalVoids]);
                    theChallenge = allSaveData[i].challenge;
                    totalVoids = 0;
                    currentPortal = allSaveData[i].totalPortals;
                }
                if(allSaveData[i].voids > totalVoids) {
                     totalVoids = allSaveData[i].voids;
                 }
            }
            title = 'Void Maps (completed)';
            xTitle = 'Portal';
            yTitle = 'Number of Void Maps';
            yType = 'Linear';
            break;
        case 'Void Map History':
            graphData = allPurposeGraph('voids',true,"number");
            title = 'Void Map History (voids finished during the same level acquired (with RunNewVoids) are not counted/tracked)';
            xTitle = 'Zone';
            yTitle = 'Number of Void Maps';
            yType = 'Linear';
            break;
        case 'Loot Sources':
            graphData = [];
            graphData[0] = {name: 'Metal', data: lootData.metal};
            graphData[1] = {name: 'Wood', data: lootData.wood};
            graphData[2] = {name: 'Food', data: lootData.food};
            graphData[3] = {name: 'Gems', data: lootData.gems};
            title = 'Current Loot Sources (of all resources gained) - for the last 15 minutes';
            xTitle = 'Time (every 15 seconds)';
            yTitle = 'Ratio of looted to gathered';
            valueSuffix = '%';
            formatter = function () {
                return Highcharts.numberFormat(this.y,3);
            };
            break;
        case 'Coordinations':
            graphData = allPurposeGraph('coord',true,"number");
            title = 'Coordination History';
            xTitle = 'Zone';
            yTitle = 'Coordination';
            yType = 'Linear';
            break;
        case 'GigaStations':
            graphData = allPurposeGraph('gigas',true,"number");
            title = 'Gigastation History';
            xTitle = 'Zone';
            yTitle = 'Number of Gigas';
            yType = 'Linear';
            break;
        case 'Unused Gigas':
            graphData = allPurposeGraph('gigasleft',true,"number");
            title = 'Unused Gigastations';
            xTitle = 'Zone';
            yTitle = 'Number of Gigas';
            yType = 'Linear';
            break;
        case 'Last Warpstation':
            graphData = allPurposeGraph('lastwarp',true,"number");
            title = 'Warpstation History';
            xTitle = 'Zone';
            yTitle = 'Previous Giga\'s Number of Warpstations';
            yType = 'Linear';
            break;
        case 'Trimps':
            graphData = allPurposeGraph('trimps',true,"number");
            title = 'Total Trimps Owned';
            xTitle = 'Zone';
            yTitle = 'Cumulative Number of Trimps';
            yType = 'Linear';
            break;
        case 'Trimps Base':
            graphData = allPurposeGraph('trimpsBase',true,"number");
            title = 'Base Trimps Owned (pre Carpentry 1 & 2)';
            xTitle = 'Zone';
            yTitle = 'Base Number of Trimps';
            yType = 'Linear';
            break;
        case 'Nullifium Gained':
            var currentPortal = -1;
            var totalNull = 0;
            var theChallenge = '';
            graphData = [];
            var averagenulli = 0;
            var sumnulli = 0;
            var count = 0;
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    if(currentPortal == -1) {
                        theChallenge = allSaveData[i].challenge;
                        currentPortal = allSaveData[i].totalPortals;
                        graphData.push({
                        name: 'Nullifium Gained',
                        data: [],
                        type: 'column'
                    });
                        continue;
                    }
                    graphData[0].data.push([allSaveData[i-1].totalPortals, totalNull]);
                    count++;
                    sumnulli += totalNull;
                    //console.log("nulli was: " + totalNull + " " + count + " @ " + allSaveData[i].totalPortals);   //debug
                    theChallenge = allSaveData[i].challenge;
                    totalNull = 0;
                    currentPortal = allSaveData[i].totalPortals;

                }
                if(allSaveData[i].nullifium > totalNull) {
                    totalNull = allSaveData[i].nullifium;
                }
            }
            averagenulli = sumnulli / count;
            //console.log("Average nulli was: " + averagenulli);
            title = 'Nullifium Gained Per Portal';
            if (averagenulli)
                title = "Average " + title + " = " + averagenulli;
            xTitle = 'Portal';
            yTitle = 'Nullifium Gained';
            yType = 'Linear';
            break;   
        case 'Dark Essence':
            graphData = allPurposeGraph('essence',true,"number");
            title = 'Total Dark Essence Owned';
            xTitle = 'Zone';
            yTitle = 'Dark Essence';
            yType = 'Linear';
            xminFloor = 181;
            break;
        case 'Dark Essence PerHour':
            var currentPortal = -1;
            var currentZone = -1;
            var startEssence = 0;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    currentZone = 0;
                    startEssence = allSaveData[i].essence;
                }
                //runs extra checks for mid-run imports, and pushes 0's to align to the right zone properly.
                if (currentZone != allSaveData[i].world - 1) {
                    var loop = allSaveData[i].world - 1 - currentZone;
                    while (loop > 0) {
                        graphData[graphData.length - 1].data.push(0);
                        loop--;
                    }
                }
                //write datapoint (one of 3 ways)
                if (currentZone != 0) {
                    graphData[graphData.length - 1].data.push(Math.floor((allSaveData[i].essence - startEssence) / ((allSaveData[i].currentTime - allSaveData[i].portalTime) / 3600000)));
                }
                currentZone = allSaveData[i].world;
            }
            title = 'Dark Essence/Hour (Cumulative)';
            xTitle = 'Zone';
            yTitle = 'Dark Essence/Hour';
            yType = 'Linear';
            xminFloor = 181;
            break;
        case 'OverkillCells':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    if(allSaveData[i].world == 1 && currentZone != -1 )
                        graphData[graphData.length -1].data.push(0);

                    if(currentZone == -1 || allSaveData[i].world != 1) {
                        var loop = allSaveData[i].world;
                        while (loop > 0) {
                            graphData[graphData.length -1].data.push(0);
                            loop--;
                        }
                    }
                }
                if(currentZone < allSaveData[i].world && currentZone != -1) {
                    var num = allSaveData[i].overkill;
                    if (num)
                        graphData[graphData.length - 1].data.push(num);
                }
                currentZone = allSaveData[i].world;
            }
            title = 'Overkilled Cells';
            xTitle = 'Zone';
            yTitle = 'Overkilled Cells';
            yType = 'Linear';
            break;    
        case 'Magmite':
            graphData = allPurposeGraph('magmite',true,"number");
            title = 'Total Magmite Owned';
            xTitle = 'Zone (starting at 230)';
            yTitle = 'Magmite';
            yType = 'Linear';
            xminFloor = 230;
            break;
        case 'Magmamancers':
            graphData = allPurposeGraph('magmamancers',true,"number");
            title = 'Total Magmamancers Owned';
            xTitle = 'Zone (starting at 230)';
            yTitle = 'Magmamancers';
            yType = 'Linear';
            xminFloor = 230;
            break;
        case 'Fluffy XP':
            graphData = allPurposeGraph('fluffy',true,"number");
            title = 'Fluffy XP (Lifetime Total)';
            xTitle = 'Zone';
            yTitle = 'Fluffy XP';
            yType = 'Linear';
            graphsPretty = false;
            formatter =  function () {
                var ser = this.series;
                return '<span style="color:' + ser.color + '" >�?</span> ' +
                        ser.name + ': <b>' +
                        this.y.toExponential(4) + '</b><br>';
            };
            xminFloor = 1;
            break;
        case 'Fluffy XP PerHour':
            var currentPortal = -1;
            var currentZone = -1;
            var startFluffy = 0;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    currentZone = 0;
                    startFluffy = allSaveData[i].fluffy;
                }
                //runs extra checks for mid-run imports, and pushes 0's to align to the right zone properly.
                /*if (currentZone != allSaveData[i].world - 1) {
                    var loop = allSaveData[i].world - 1 - currentZone;
                    while (loop > 0) {
                        graphData[graphData.length - 1].data.push(0);
                        loop--;
                    }
                }*/
                    if (currentZone != allSaveData[i].world - 1 && i > 0) {
                        //console.log(allSaveData[i].totalPortals + " / " + allSaveData[i].world);
                        var loop = allSaveData[i].world - 1 - currentZone;
                        while (loop > 0) {
                            graphData[graphData.length - 1].data.push(allSaveData[i-1][item]*1);
                            loop--;
                        }
                    }
                //write datapoint (one of 3 ways)
                if (currentZone != 0) {
                    graphData[graphData.length - 1].data.push(Math.floor((allSaveData[i].fluffy - startFluffy) / ((allSaveData[i].currentTime - allSaveData[i].portalTime) / 3600000)));
                }
                currentZone = allSaveData[i].world;
            }
            title = 'Fluffy XP/Hour (Cumulative)';
            xTitle = 'Zone';
            yTitle = 'Fluffy XP/Hour';
            yType = 'Linear';
            //xminFloor = 300;
            xminFloor = 1;
            break;
        case 'Nurseries':
            graphData = allPurposeGraph('nursery',true,"number");
            title = 'Nurseries Bought (Total)';
            xTitle = 'Zone';// (starting at your NoNurseriesUntil setting)';
            yTitle = 'Nursery';
            yType = 'Linear';
            // if (getPageSetting('NoNurseriesUntil'))
                // xminFloor = getPageSetting('NoNurseriesUntil');
            break;
    }//end of switch(graph)

    //(internal) default function used to draw non-specific graphs (and some specific ones)
    function allPurposeGraph(item,extraChecks,typeCheck,funcToRun,useAccumulator){
        var currentPortal = -1;
        var currentZone = 0;
        var accumulator = 0;
        graphData = [];
        //begin iterating:
        for (var i in allSaveData){
            //acts as an "exists" check (for lack of data)
            if (typeCheck && typeof allSaveData[i][item] != typeCheck)
                continue;
            if (allSaveData[i].totalPortals != currentPortal){
                graphData.push({
                    name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                    //name: '#' + allSaveData[i].totalPortals + ' ' 
                    //        + (getPageSetting('AutoAllocatePerks') == 1 ? allSaveData[i].AAHelium+'/'+allSaveData[i].AAAttack+'/'+allSaveData[i].AAHealth+'/'+allSaveData[i].AAFluffy+'/'+allSaveData[i].AADG : '')
                    //        + (/*item == 'hehr'*/ true ? ' ' + allSaveData[i].maxVoids : '') + ': ' + allSaveData[i].challenge,
                    data: []
                });
                currentPortal = allSaveData[i].totalPortals;
                currentZone = 0;
                if (funcToRun) {
                    accumulator = 0;
                    //push a 0 to index 0 so that clear times line up with x-axis numbers
                    graphData[graphData.length -1].data.push(0);
                }
                continue;
            }
            //maybe not?runs extra checks for mid-run imports, and pushes 0's to align to the right zone properly.
            if (extraChecks) {
                if (currentZone != allSaveData[i].world - 1){
                    //console.log(allSaveData[i].totalPortals + allSaveData[i].world);
                    var loop = allSaveData[i].world - 1 - currentZone;
                    while (loop > 0){
                        graphData[graphData.length - 1].data.push(allSaveData[i-1][item]*1);
                        loop--;
                    }
                }
            }
            //write datapoint (one of 3 ways)
            if (funcToRun && !useAccumulator && currentZone != 0){
                var num = funcToRun(allSaveData[i],allSaveData[i-1]);
                if (num < 0) num = 1;
                graphData[graphData.length - 1].data.push(num);
            }
            else if (funcToRun && useAccumulator && currentZone != 0){
                accumulator += funcToRun(allSaveData[i],allSaveData[i-1]);
                if (accumulator < 0) accumulator = 1;
                graphData[graphData.length - 1].data.push(accumulator);
            }
            else {
                if (allSaveData[i][item] >= 0)
                    graphData[graphData.length - 1].data.push(allSaveData[i][item]*1);
                else if (extraChecks)
                    graphData[graphData.length - 1].data.push(-1);
            }
            currentZone = allSaveData[i].world;
        }
        return graphData;
    }
    //default formatter used (can define a decimal precision, and a suffix)
    formatter = formatter || function (){
        var ser = this.series;
        return '<span style="color:' + ser.color + '" >�?</span> ' +
                ser.name + ': <b>' +
                (graphsPretty ? prettify(this.y) : Highcharts.numberFormat(this.y, precision,'.', ',')) + valueSuffix + '</b><br>';
    };
    
    var additionalParams = {};
    //Makes everything happen.
    if (oldData != JSON.stringify(graphData)){
        saveSelectedGraphs();
        if (graph != 'Efficiency and Stacks')
            setGraph(title, xTitle, yTitle,                  valueSuffix, formatter, graphData, yType,         xminFloor, yminFloor, additionalParams);
        else
            setGraph2(title, xTitle, yTitle, yTitle2, names, valueSuffix, formatter, graphData, yType, yType2, xminFloor, yminFloor, yminFloor2);
    }
    //put finishing touches on this graph.
    if (graph == 'Helium - He/Hr Delta'){
        var plotLineoptions = {
                value: 0,
                width: 2,
                color: 'red'
            };
        chart1.yAxis[0].addPlotLine(plotLineoptions);
    }
    //put finishing touches on this graph.
    if (graph == 'Loot Sources'){
        chart1.xAxis[0].tickInterval = 1;
        chart1.xAxis[0].minorTickInterval = 1;
    }
    //put finishing  touches on this graph.
    if (graph == 'Efficiency and Stacks'){
        if(stanceStats && stanceStats.wantLessDamage)
            for(var i = 0; i < stanceStats.wantLessDamage.length; i++){
                if(stanceStats.wantLessDamage[i]){
                    var p = chart1.series[1].points[i];
                    p.update({
                        marker: {
                            radius: 9

                        },
                        color: "#FF0000"
                    });
                }
                if(stanceStats.wantMoreDamage[i]){
                    var p = chart1.series[1].points[i];
                    p.update({
                        marker: {
                            radius: 9

                        },
                        color: "#E500FF"
                    });
                }
            }
        //else
            //drawGraph();
        //chart1.xAxis[0].marker.enabled = true;
        //chart1.xAxis[0].minorTickInterval = 1;
    }
    //remember what we had (de)selected, if desired.
    if (document.getElementById('rememberCB').checked){
        applyRememberedSelections();
    }
}

var chart1;
function setGraph(title, xTitle, yTitle, valueSuffix, formatter, series, yType, xminFloor, yminFloor, additionalParams){
    chart1 = new Highcharts.Chart({
        chart:{
            renderTo: 'graph',
            zoomType: 'xy',
            //move reset button out of the way.
            resetZoomButton:{
                position:{
                    align: 'right',
                    verticalAlign: 'top',
                    x: -20,
                    y: 15
                },
                relativeTo: 'chart'
            }
        },
        title: {
            text: title,
            x: -20 //center
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                animation: false,
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: {
            floor: xminFloor,
            title: {
                text: xTitle
            },
        },
        yAxis: {
            floor: yminFloor,
            title: {
                text: yTitle
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            type: yType,
            labels: {
                formatter: function(){
                    if (yType == 'datetime') return Highcharts.dateFormat('%H:%M:%S', 1000*this.value);
                    return ((this.value > 1000 || this.value < 0) ? prettify(this.value) : this.value);
                },
            },
            dateTimeLabelFormats: { //force all formats to be hour:minute:second
                second: '%H:%M:%S',
                minute: '%H:%M:%S',
                hour: '%H:%M:%S',
                day: '%H:%M:%S',
                week: '%H:%M:%S',
                month: '%H:%M:%S',
                year: '%H:%M:%S'
            }

        },
        tooltip: {
            pointFormatter: formatter,
            valueSuffix: valueSuffix
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series,
        additionalParams
    });
}

//used for Efficiency and Stacks
function setGraph2(title, xTitle, yTitle, yTitle2, names, valueSuffix, formatter, series, yType, yType2, xminFloor, yminFloor, yminFloor2, additionalParams){
    chart1 = new Highcharts.Chart({
        chart: {
            alignTicks: false, //without this ticks will go higher than desired. might want gridLineWidth 0 on yaxis#2
            renderTo: 'graph',
            zoomType: 'xy',
            //move reset button out of the way.
            resetZoomButton: {
                position: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: -20,
                    y: 15
                },
                relativeTo: 'chart'
            }
        },
        title: {
            text: title,
            x: -20 //center
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                animation: false,
            }
        },
        xAxis: {
            //floor: xminFloor,
            min: 0,
            allowDecimals: false,
            //categories: names, //too crowded
            title: {
                text: xTitle
            },
        },
        yAxis: [{ //cmp axis
            marker: {
                fillColor: '#000000',
                lineColor: null // inherit from series
            },
            floor: 0,
            min: 0,
            tickInterval: 0.5,
            softMax: 1,
            //max: null,
            //endOnTick: false,
            
            tooltip: {
                pointFormatter: formatter,
                valueSuffix: valueSuffix
            },
            title: {
                text: yTitle
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            },
            {
                value: 1,
                width: 5,
                color: '#00595B'
            }],
            type: yType,
            dateTimeLabelFormats: { //force all formats to be hour:minute:second
            second: '%H:%M:%S',
            minute: '%H:%M:%S',
            hour: '%H:%M:%S',
            day: '%H:%M:%S',
            week: '%H:%M:%S',
            month: '%H:%M:%S',
            year: '%H:%M:%S'
        }}, { //stack yaxis
            marker: {
                fillColor: '#000000',
                lineColor: null // inherit from series
            },
            floor: 0,
            min: 0,
            max: game.empowerments.Wind.maxStacks,
            tickInterval: 50,
            opposite: true,
            tooltip: {
                pointFormat: "Value: {point.y:.0f}"
            },
            title: {
                text: yTitle2
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            type: yType2,
            dateTimeLabelFormats: { //force all formats to be hour:minute:second
            second: '%H:%M:%S',
            minute: '%H:%M:%S',
            hour: '%H:%M:%S',
            day: '%H:%M:%S',
            week: '%H:%M:%S',
            month: '%H:%M:%S',
            year: '%H:%M:%S'
        }}],
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series,
        additionalParams
    });
}

function setColor(tmp){
    for (var i in tmp) {
        tmp[i].color = (i == tmp.length - 1) ? '#FF0000'  //Current run is in red
                                             : '#90C3D4'; //Old runs are in blue
    }
    return tmp;
}

var filteredLoot = {
    'produced': {metal: 0, wood: 0, food: 0, gems: 0},
    'looted': {metal: 0, wood: 0, food: 0, gems: 0}
}
var lootData = {
    metal: [], wood:[], food:[], gems:[]
};

function getLootData(){
    var loots = ['metal', 'wood', 'food', 'gems'];
    for(var r in loots){
        var name = loots[r];
        //avoid /0 NaN
        if(filteredLoot.produced[name])
            lootData[name].push(filteredLoot.looted[name]/filteredLoot.produced[name]);
        if(lootData[name].length > 60)lootData[name].shift();
    }
}
setInterval(getLootData, 15000);

//track loot gained. jest == from jest/chronoimp
function filterLoot (loot, amount, jest, fromGather){
    if(loot != 'wood' && loot != 'metal' && loot != 'food' && loot != 'gems') return;
    if(jest) {
        filteredLoot.produced[loot] += amount;
        //subtract from looted because this loot will go through addResCheckMax which will add it to looted
        filteredLoot.looted[loot] -= amount;
    }
    else if (fromGather) filteredLoot.produced[loot] += amount;
    else filteredLoot.looted[loot] += amount;
    //console.log('item is: ' + loot + ' amount is: ' + amount);
}

//BEGIN overwriting default game functions!!!!!!!!!!!!!!!!!!!!!!
//(dont panic, this is done to insert the tracking function "filterLoot" in)
(function(){
    var resAmts;

    function storeResAmts(){
        resAmts = {};
        for (let item in lootData) {
            resAmts[item] = game.resources[item].owned;
        }
    }

    const oldJestimpLoot = game.badGuys.Jestimp.loot;
    game.badGuys.Jestimp.loot =
    function(){
        storeResAmts();
        var toReturn = oldJestimpLoot.apply(this, arguments);
        for (let item in resAmts){
            var gained = game.resources[item].owned - resAmts[item];
            if (gained > 0){
                filterLoot(item, gained, true);
            }
        }
        return toReturn;
    };

    const oldChronoimpLoot = game.badGuys.Chronoimp.loot;
    game.badGuys.Chronoimp.loot =
    function (){
        storeResAmts();
        var toReturn = oldChronoimpLoot.apply(this, arguments);
        for (let item in resAmts){
            var gained = game.resources[item].owned - resAmts[item];
            if (gained > 0){
                filterLoot(item, gained, true);
            }
        }
        return toReturn;
    };

  // who even thought copying the code was a good idea?
  const oldFunction = window.addResCheckMax;
  window.addResCheckMax = (a, b, c, d, e) => filterLoot(a, b, null, d) || oldFunction(a, b, c, d, e);
})();
//END overwriting default game functions!!!!!!!!!!!!!!!!!!!!!!

function updateLastPoint(lastCell){
    if(document.getElementById('graphSelection').value != "Efficiency and Stacks")
        return;
    
    var name = "";
    if(!worldArray[lastCell])
        name = lastCell;
    else if(worldArray[lastCell].corrupted === undefined)
        name = lastCell + "empty";
    else
        name = lastCell + worldArray[lastCell].corrupted;
    chart1.series[0].addPoint([name, stanceStats.cmp[lastCell]], true, false); //cmp series
    chart1.series[1].addPoint([name, stanceStats.stacks[lastCell]], true, false); //stacks series

    var p = chart1.series[1].points[chart1.series[1].points.length - 1];
    
    if(p === undefined || !((getPageSetting('StackSpire4') == 1 && game.global.challengeActive == "Daily") || getPageSetting('StackSpire4') == 2))
        return;
    if(stanceStats.wantLessDamage[lastCell]){
        p.update({
            marker: {
                radius: 9
            },
            color: "#FF0000"
        });
    }
    if(stanceStats.wantMoreDamage[lastCell]){
        p.update({
            marker: {
                radius: 9,
            },
            color: "#E500FF"
        });
    }
}