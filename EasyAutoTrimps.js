// ==UserScript==
// @name         EasyAutoTrimps-EAT-SuperGolwuh
// @version      0.1337
// @namespace    https://github.com/SuperGolwuh/EasyAutoTrimps
// @updateURL    https://github.com/SuperGolwuh/EasyAutoTrimps/.user.js
// @description  Automate all the trimps! For Lazy and/or New People
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0, Meowchan, SuperGolwuh
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps*
// @connect      *github.com/SuperGolwuh/EasyAutoTrimps*
// @connect      self
// @grant        none
// ==/UserScript==
var script = document.createElement('script');
script.id = 'EasyAutoTrimps-GW-GolwuhPatch';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://github.com/SuperGolwuh/EasyAutoTrimps/EasyAutoTrimps.js';
//script.setAttribute('crossorigin',"use-credentials");
document.head.appendChild(script);
var ATversion = '0.1337'; //when this increases it forces users setting update to newer version format

//<script type="text/javascript" src="EasyAutoTrimps/EasyAutoTrimps.js?"></script>
////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////

var local = false;
//local = true;
var ver = "0.1337";
var verDate = "15.4.19";

var changelogList = [];
changelogList.push({date: "5.1.2019", version: "0.1337", description: "This, during initial testing, will serve as an open source Auto Trimps project to ease people into EasyAutoTrimps, an aspect of the game "Trimps" from GreenSatellite.", isNew: true});
changelogList.push({date: "4.30.2019", version: "0.1", description: "Tutorial for New Players coming soon!", isNew: false});


var atscript = document.getElementById('EasyAutoTrimps-script'),
        basepath = (local ? 'EasyAutoTrimps/' : 'https://github.com/SuperGolwuh/EasyAutoTrimps/'),
        modulepath = 'modules/';

var initialized = false;
function startAT() {
    //first we wait for the game to load
    if((typeof game === 'undefined' || typeof loadPageVariables === 'undefined' || typeof game.options === 'undefined' || typeof game.options.menu === 'undefined' || typeof pendingLogs === 'undefined' || document.getElementById('logBtnGroup') === null)){ //game hasnt initialized yet
        setTimeout(startAT, 100);
        return;
    }
    
    if(!initialized){ //perform once
        pendingLogs.EasyAutoTrimps = []; //adds AT messages slot. needed before we can call debug()
        initializeEasyAutoTrimps(); //loads modules asynchronously
        initialized = true;
    }
    
    //wait until all the scripts are loaded into page
    if(loadedScriptAmount !== expectedScriptAmount || typeof jQuery === 'undefined'){ //jquery is a dependacy of jquery-ui, so check for it specifically here
        setTimeout(startAT, 100);
        return;
    }
    
    //load jQuery-UI.css
    var link1 = document.createElement('link');
    link1.rel = "stylesheet";
    link1.type = "text/css";
    link1.href = basepath + modulepath + 'jQuery-UI.css';
    document.head.appendChild(link1);
    
    //code to run on script launch:
    if (!local) printChangelog();
    
    equipLowDmgShield();
    equipMainShield();
    
    if(game.global.mapsActive) currMap = getCurrentMapObject();
    trimpsRealMax = game.resources.trimps.realMax();
    
    oncePerZoneCode();
    
    AutoPerks.firstRun(); //set some things up on loading. click Allocate does everything else
    
    //HTML For adding a 5th tab to the message window
    var ATbutton = document.createElement("button");
    ATbutton.innerHTML = 'EasyAutoTrimps';
    ATbutton.setAttribute('id', 'EasyAutoTrimpsFilter');
    ATbutton.setAttribute('type', 'button');
    ATbutton.setAttribute('onclick', "filterMessage2('EasyAutoTrimps')");
    ATbutton.setAttribute('class', "btn btn-success logFlt");
    //
    var tab = document.createElement("DIV");
    tab.setAttribute('class', 'btn-group');
    tab.setAttribute('role', 'group');
    tab.appendChild(ATbutton);
    document.getElementById('logBtnGroup').appendChild(tab);
    
    //if (game.achievements.zones.finished < 8)   //z60
    //    printLowerLevelPlayerNotice();
    //Set some game ars after we load.
    game.global.addonUser = true;
    game.global.EasyAutoTrimps = true;
    heirloomCache = game.global.heirloomsExtra.length;
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    
    //Start guiLoop
    setInterval(guiLoop, runInterval*10);
    setInterval(pauseRemovalLoop, runInterval); //TODO: this cleaner. hookup to game maybe?
    
    //hook up into load() - load game function
    load = (function() {
        var cached_function = load;
        return function() {
            var result = cached_function.apply(this, arguments);
            oncePerZoneCode();
            return result;
        };
    })();
    
    //hook up into runGameLoop()
    runGameLoop = (function(makeUp, now) {
        var cached_function = runGameLoop;
        return function(makeUp, now) {
            var result = cached_function.apply(this, arguments);
            ATLoop(makeUp);
            return result;
        };
    })();
    
    //hook up into activateClicked() (confirm portal/respec button) to save autoperks calculated settings
    activateClicked = (function(makeUp, now) {
        var cached_function = activateClicked;
        return function(makeUp, now) {
            if(typeof EasyAutoTrimpsettings.APCheckBoxes !== 'undefined' && EasyAutoTrimpsettings.APCheckBoxes.userSaveATSettings){ //save relevant AT settings
                setPageSetting('TillWeHaveAmalg',   EasyAutoTrimpsettings.APValueBoxes.amalGoal); //amal goal
                setPageSetting('NoCoordBuyStartZ',  (EasyAutoTrimpsettings.APValueBoxes.amalZone - EasyAutoTrimpsettings.APValueBoxes.coordsBehind)); //start no coord buy
                setPageSetting('FuelFromZ',         AutoPerks.fuelStartZone); //fuel start zone
                setPageSetting('FuelToZ',           AutoPerks.fuelEndZone); //fuel end zone
                setPageSetting('FuelUntilAmal',     false); //fuel until amalgamator
            }
            
            if(!portalWindowOpen && getPageSetting('BuyJobsNew')){ //respeccing mid-run - fire all miners
                var wasPaused = false;
                if (game.options.menu.pauseGame.enabled){ //cant fire while paused
                    wasPaused = true;
                    toggleSetting('pauseGame');
                }
                var old = preBuy2();
                game.global.firing = true;
                if(game.jobs["Miner"].owned > 0){
                    game.global.buyAmt = game.jobs["Miner"].owned;
                    buyJob("Miner", true, true);
                }
                if(game.jobs["Farmer"].owned > 0){
                    game.global.buyAmt = game.jobs["Farmer"].owned;
                    buyJob("Farmer", true, true);
                }
                if(game.jobs["Lumberjack"].owned > 0){
                    game.global.buyAmt = game.jobs["Lumberjack"].owned;
                    buyJob("Lumberjack", true, true);
                }
                postBuy2(old);
                if(wasPaused) 
                    toggleSetting('pauseGame');
            }
            
            if(portalWindowOpen && getPageSetting('AutoHeirlooms')) //portalling, run autoheirloom
                autoHeirlooms();
            
            var result = cached_function.apply(this, arguments);
            return result;
        };
    })();

    let script = document.createElement('script');
    script.id = 'SpireBuilder-script';
    script.src = 'https://github.com/SuperGolwuh/TrimpScripts/SpireBuilder.js';
    script.setAttribute('crossorigin',"anonymous");
    document.head.appendChild(script);

    if (typeof EasyAutoTrimpsettings["toggleExport"] !== "undefined") toggleExport = EasyAutoTrimpsettings["toggleExport"];
    if (typeof EasyAutoTrimpsettings["MinSpireCost"] !== "undefined") MinSpireCost = EasyAutoTrimpsettings["MinSpireCost"];
	
    debug('EasyAutoTrimps loaded!');

}

//This should redirect the script to wherever its being mirrored from.
if (atscript !== null) {
    basepath = atscript.src.replace(/EasyEasyAutoTrimps\.js$/, '');
}

//This could potentially do something one day. like: read localhost url from tampermonkey.
// AKA do certain things when matched on a certain url.
//if (atscript.src.includes('localhost')) {;};

var loadedScriptAmount = 0;
var expectedScriptAmount = 0;
function ATscriptLoad(pathname, modulename) {
    if (modulename == null) debug("Wrong Syntax. Script could not be loaded. Try ATscriptLoad(modulepath, 'example.js'); ");
    var script = document.createElement('script');
    if (pathname == null) pathname = '';
    script.src = basepath + pathname + modulename + '.js';
    script.id = modulename + '_MODULE';
    script.onload = function(){loadedScriptAmount++;};
    expectedScriptAmount++;
    //script.setAttribute('crossorigin',"use-credentials");
    //script.setAttribute('crossorigin',"anonymous");
    document.head.appendChild(script);
}
ATscriptLoad(modulepath, 'utils');    //Load stuff needed to load other stuff:

//This starts up after game is loaded
function initializeEasyAutoTrimps() {
    loadPageVariables();            //get EasyAutoTrimpsettings
    ATscriptLoad('','SettingsGUI');   //populate Settings GUI
    ATscriptLoad('','Graphs');        //populate Graphs
    //Load modules:
    ATmoduleList = ['chat', 'jQuery', 'jQuery-UI', 'query', 'portal', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'stance', 'maps', 'breedtimer', 'magmite', 'other', 'import-export', 'perks', 'fight-info', 'performance', 'ATcalc'];
    for (var m in ATmoduleList) 
        ATscriptLoad(modulepath, ATmoduleList[m]);
    
    //debug('EasyAutoTrimps v' + ATversion + ' ' + ver + ' Loaded!', '*spinner3');
    debug('EasyAutoTrimps v' + ATversion + ' ' + ver);
}

function assembleChangelog(date,version,description,isNew) {
    return (isNew)
    ? (`<b class="AutoEggs">${date} ${version} </b><b style="background-color:#32CD32"> New:</b> ${description}<br>`)
    : (`<b>${date} ${version} </b> ${description}<br>`);
}

function printChangelog() {
    var body="";
    for (var i in changelogList) {
        var $item = changelogList[i];
        var result = assembleChangelog($item.date,$item.version,$item.description,$item.isNew);
        body+=result;
    }
    var footer =
        '<b>Ongoing Development</b> - <u>Report any bugs/problems please</u>!\
        <br>Talk with the dev: <b>Sliverz#7416</b> @ <a target="#" href="https://discord.gg/W2Ajv4j">EasyAutoTrimps Discord Channel</a>'
    ,   action = 'cancelTooltip()'
    ,   title = "EasyAutoTrimps - Meowchan's Fork<br>" + "v" + ver + " " + verDate
    ,   acceptBtnText = "Thank you for playing EasyAutoTrimps!"
    ,   hideCancel = true;
    tooltip('confirm', null, 'update', body+footer, action, title, acceptBtnText, null, hideCancel);
}

function printLowerLevelPlayerNotice() {
    tooltip('confirm', null, 'update', 'The fact that it works at all is misleading new players into thinking its perfect. Its not. If your highest zone is under z60, you have not unlocked the stats required, and have not experienced the full meta with its various paradigm shifts. If you are just starting, my advice is to play along naturally and use EasyAutoTrimps as a tool, not a crutch. Play with the settings as if it was the game, Dont expect to go unattended, if AT chooses wrong, and make the RIGHT choice yourself. Additionally, its not coded to run one-time challenges for you, only repeatable ones for helium. During this part of the game, content is king - automating literally removes the fun of the game. If you find that many flaws in the automation exist for you, level up. Keep in mind the challenge of maintaining the code is that it has to work for everyone. AT cant see the future and doesnt run simulations, it exists only in the present moment. Post any suggestions on how it can be better, or volunteer to adapt the code, or produce some sort of low-level player guide with what youve learned.<br>Happy scripting! -genBTC','cancelTooltip()', '<b>LowLevelPlayer Notes:</b><br><b>PSA: </b><u>EasyAutoTrimps was not designed for new/low-level players.</u>', "I understand I am on my own and I Accept and Continue.", null, true);
}

////////////////////////////////////////
//Global Main vars /////////////////////
////////////////////////////////////////
////////////////////////////////////////
var ATrunning = true;   //status var
var ATmessageLogTabVisible = true;    //show an EasyAutoTrimps tab after Story/Loot/Unlocks/Combat message Log Container
var enableDebug = true; //Spam console.log with debug info

var EasyAutoTrimpsettings = {};
var MODULES = {};
var MODULESdefault = {};
var ATMODULES = {};
var ATmoduleList = [];

var sugarEventAT = false; //enable pumpkin imps
var bestBuilding;
var scienceNeeded;
var metalNeeded;
var woodNeeded;
var foodNeeded;
var hiddenBreedTimer;
var hiddenBreedTimerLast;

var preBuyAmt;
var preBuyFiring;
var preBuyTooltip;
var preBuymaxSplit;

var currentworld = 0;
var aWholeNewWorld = false;
var heirloomFlag = false;
var heirloomCache;
var magmiteSpenderChanged = false;

var oblitMultAT = 1;
var coordMultAT = 1;
var eradMultAT = 1;
var windMult = 1;
var poisonMultFixed=0.05;
var poisonMult = 1;
var threshold=1;
var DHratio = 0;
var formattedRatio = "";
var nextZoneDHratio = 0;
var maxAnti;
var attacksPerSecondAT;
var wantedAnticipation = maxAnti;
var highestPrestigeOwned = 0;
var allowBuyingCoords = true;
var lastCell = -1;
var bsZone;
var holdingBack = false;
var trimpsRealMax;
var PRaidStartZone = 999;

var highCritChance;
var highCritDamage;
var highATK;
var highPB;
var lowCritChance;
var lowCritDamage;
var lowATK;
var lowPB;
var lowShieldName = "LowDmgShield"; //edit these to change the names used (visual only).
var highShieldName = "HighDmgShield";
var wantGoodShield = true; //we want to only swap shield maximum once per loop
var goodBadShieldRatio = 1;

var lastFluffDmg = 1;

var currMap;
var statusMsg = "";
var ASMode;
var expectedPortalZone = 0;

var ATmakeUp = false;
var ATMaxVoids = 0;

function pauseRemovalLoop(){
    var wrapper = document.getElementById("wrapper");
    var chatFrame = document.getElementById("chatFrame");
    var iFrame = document.getElementById("chatIFrame");
    var settingsRow = document.getElementById("settingsRow");
    
    //chat related stuff:
    /*
        //dont know why wrapper started shrinking on me
        wrapper.style.width = '100vw';
        //multiple screen changing buttons set wrapper display to block. chat functionality changes it to flex, so reset to flex every loop
        if(wrapper.style.display === "block")
            wrapper.style.display = "flex";

        //this is ugly but best i found so far. problem is the settingsRow when it opens and closes
        if(iFrame) {
            var height = (document.getElementById("wrapper").clientHeight - document.getElementById("settingsRow").clientHeight) + 'px';
            iFrame.style.height = height;
            chatFrame.style.height = height;
        }

        //putting this here so that innerWrapper width gets set to fill screen when if screen changed not through chatFrame resize
        updateInnerWrapperWidth();
        //$(document).ready(function() {
        //    $("#innerWrapper").width($("#wrapper").width() - $("#chatIFrame").width());
        //});

        //if(chatFrame) chatFrame.style.height = (document.getElementById("wrapper").clientHeight - document.getElementById("settingsRow").clientHeight) + 'px';
    */
   
   //fix portal screen
    var portalWrapper = document.getElementById("portalWrapper");
    portalWrapper.style["overflow-y"] = "auto";
    var titleRow = document.getElementById("titleRow");
    titleRow.style.position = "relative";
    
    
    if(!getPageSetting('PauseMsgsVisible')){
        var pauseMsgs = document.getElementsByClassName('pauseMsg');
        var log = document.getElementById('log');
        for (var x = 0; x < pauseMsgs.length; x++)
           log.removeChild(pauseMsgs[x]);
    }
}

function ATLoop(makeUp){ //makeUp = true when game is in catchup mode, so we can skip some unnecessary visuals
    //debug((countHeliumSpent() + game.global.heliumLeftover + game.resources.helium.owned - game.global.totalHeliumEarned).toExponential(2));
    if (!ATrunning) return;

    if(loadedScriptAmount !== expectedScriptAmount){ //ATLoop can sometime pass starting checks due to asynchronous nature, so check again just in case
        debug("Error: A Module was not loaded, " + loadedScriptAmount + " out of " + expectedScriptAmount);
        debug(ATmoduleList);
        return;
    }
    
    gatherInfo(); //stores graphs data, do this even with AT paused for graph only users.
    
    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled){
        if(getPageSetting('PauseScript'))
            updateAutoMapsStatus("", "AT paused", true);
        return;
    }
    ATmakeUp = makeUp;
    
    trimpsRealMax = game.resources.trimps.realMax();
    
    hiddenBreedTimer = game.jobs.Amalgamator.owned > 0 ? Math.floor((getGameTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000);
    if(hiddenBreedTimer != hiddenBreedTimerLast && typeof addbreedTimerInsideText !== 'undefined'){
        if (!makeUp) addbreedTimerInsideText.textContent = hiddenBreedTimer + 's'; //add breed time for next army;
        hiddenBreedTimerLast = hiddenBreedTimer;
    }
    
    wantGoodShield = true;
    maxAnti = game.portal.Anticipation.level > 0 ? (game.talents.patience.purchased ? 45 : 30) : 0;
    if(game.global.mapsActive) currMap = getCurrentMapObject();
    attacksPerSecondAT = calcAttacksPerSecond();
    expectedPortalZone = EasyAutoTrimpsettings.AutoPortal.selected !== "Custom" ? 0 : getPageSetting('CustomAutoPortal') + (game.global.challengeActive == "Daily" ? getPageSetting('AutoFinishDailyNew') : 0);
    bsZone = (0.5*game.talents.blacksmith.purchased + 0.25*game.talents.blacksmith2.purchased + 0.15*game.talents.blacksmith3.purchased)*(game.global.highestLevelCleared + 1);    
    
    aWholeNewWorld = currentworld != game.global.world;
    currentworld = game.global.world;
 
    if ((game.global.world == 1 && aWholeNewWorld) || (!heirloomsShown && heirloomFlag) || (heirloomCache != game.global.heirloomsExtra.length)){ 
        if (getPageSetting('AutoHeirlooms')) autoHeirlooms();

        heirloomCache = game.global.heirloomsExtra.length;
        highestPrestigeOwned = 0;
    }
    heirloomFlag = heirloomsShown;
    if(ATMaxVoids < game.global.totalVoidMaps) ATMaxVoids = game.global.totalVoidMaps; //used by graphs
    
    //Stuff to do Every new Zone
    if (aWholeNewWorld) {
        //Stuff to do Every new Portal
        if(game.global.world === 1){
            if (getPageSetting('AutoAllocatePerks')==2) lootdump();
            zonePostpone = 0;
            PRaidStartZone = 999;
            ATMaxVoids = 0;
        }
        
        oncePerZoneCode();
    }
    setScienceNeeded();  //determine how much science is needed
    
    var AS = getPageSetting('AutoStance');
    if(AS < 2)       statusMsg = "Advancing";
    else if(AS == 2) statusMsg = "DE";
    else             statusMsg = "Push";
    
    if (getPageSetting('ExitSpireCell') >0 || getPageSetting('ExitSpireCellDailyC2') >0) exitSpireCell(); //"Exit Spire After Cell" (other.js)
    
    if (getPageSetting('BuyUpgradesNew') != 0) buyUpgrades();                      
    
    autoGoldenUpgradesAT();                                                        
    
    if (getPageSetting('BuyBuildingsNew')==1)    { buyBuildings(); buyStorage(); } 
    else if (getPageSetting('BuyBuildingsNew')==2) buyBuildings();                 
    else if (getPageSetting('BuyBuildingsNew')==3) buyStorage();  
    
    if (getPageSetting('BuyJobsNew')) buyJobs();                                              
    if (getPageSetting('ManualGather2')) manualLabor();  //"Auto Gather/Build"       (gather.js)
    
    autoMap(); //automaps() is in charge of maps combat
    updateAutoMapsStatus("", statusMsg, true); //update status

    if (EasyAutoTrimpsettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40) (portal.js)
    
    if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (other.js)
    if (aWholeNewWorld && getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared) finishChallengeSquared(); // "Finish Challenge2" (other.js)
    
    if (getPageSetting('AutoStance')>0) autoStance();    //autostance() is in charge of world combat
    equipSelectedShield(wantGoodShield);
    
    if(!game.global.Geneticistassist && game.jobs.Geneticist.locked === 0) breedAT(); //autogeneticistassist unlocks after clearing cell 80 of bw 4 (z170)
    
    if (getPageSetting('UseAutoGen')) autoGenerator();          //"Auto Generator ON" (magmite.js)
    if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)  autoMagmiteSpender();   //Auto Magmite Spender (magmite.js)
    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();     //Nature     (other.js)
    
    //Runs any user provided scripts
    if (userscriptOn) userscripts();
    
    return;
}

function resetMoreFarming(){
    moreFarmingReset = false;
    nextCacheCounter = "";
    LMCDone = 0;
    LWCDone = 0;
    LSCDone = 0;
}

function oncePerZoneCode(){
    // Auto-close dialogues.
    switch (document.getElementById('tipTitle').innerHTML) {
        case 'The Improbability':   // Breaking the Planet
        case 'Corruption':          // Corruption / True Corruption
        case 'Spire':               // Spire
        case 'The Magma':           // Magma
            cancelTooltip();
    }
    if (getPageSetting('AutoEggs')) easterEggClicked();
    
    //used for farming mode
    resetMoreFarming();

    //used for spire LWC
    LWCDoneAmount = 0;

    oblitMultAT = game.global.challengeActive == "Obliterated" ? calcOblitMult(game.global.world) : 1;
    coordMultAT = game.global.challengeActive == "Coordinate" ? calcCoordMult(game.global.world) : 1;
    eradMultAT = game.global.challengeActive == "Eradicated" ? calcEradMult(game.global.world) : 1;

    lastCell = -1;
    highCritChance = getPlayerCritChance();
    highCritDamage = getPlayerCritDamageMult();
    highATK        = calcHeirloomBonus("Shield", "trimpAttack", 1);
    highPB         = (game.heirlooms.Shield.plaguebringer.currentBonus > 0 ? game.heirlooms.Shield.plaguebringer.currentBonus / 100 : 0);
    lowCritChance  = getPlayerCritChance();
    lowCritDamage  = getPlayerCritDamageMult();
    lowATK         = 1;
    lowPB          = 0;
    
    if (Fluffy.isActive()) lastFluffDmg = Fluffy.getDamageModifier(); //expensive, so calculate once per zone

    AutoMapsCoordOverride = false;
    maxCoords = -1;

    if(game.options.menu.ctrlGigas.enabled === 1) game.options.menu.ctrlGigas.enabled = 0; //stops tooltip from showing when buying gigas (hopefully)
    
    setTitle(); //Set the browser title
    buildWorldArray();
    setEmptyStats(); //also clears graph data

    maxAnti = game.portal.Anticipation.level > 0 ? (game.talents.patience.purchased ? 45 : 30) : 0;
    
    if(game.global.mapsActive)
        currMap = getCurrentMapObject();
    
    attacksPerSecondAT = calcAttacksPerSecond();
    expectedPortalZone = EasyAutoTrimpsettings.AutoPortal.selected !== "Custom" ? 0 : getPageSetting('CustomAutoPortal') + (game.global.challengeActive == "Daily" ? getPageSetting('AutoFinishDailyNew') : 0);
    bsZone = (0.5*game.talents.blacksmith.purchased + 0.25*game.talents.blacksmith2.purchased + 0.15*game.talents.blacksmith3.purchased)*(game.global.highestLevelCleared + 1);    
    
    calcBaseDamageinB();
}

function calcOblitMult(zone){
    return Math.pow(10,12) * Math.pow(10, Math.floor(zone / 10));
}

function calcEradMult(zone){
    return Math.pow(10,20) * Math.pow( 3 , Math.floor(zone / 2));
}

function calcCoordMult(zone){
    var num = 1;
    for (var i = 0; i < zone; i++)
        num = Math.ceil(num * 1.25);
    return num;
}

//GUI Updates happen on this thread, every 1000ms
function guiLoop() {
    updateCustomButtons();
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    //Store the diff of our custom MODULES vars in the localStorage bin.
    safeSetItems('storedMODULES', JSON.stringify(compareModuleVars()));
    //Swiffy UI/Display tab
    if(getPageSetting('EnhanceGrids'))
        MODULES["fightinfo"].Update();
    if(typeof MODULES !== 'undefined' && typeof MODULES["performance"] !== 'undefined' && MODULES["performance"].isAFK)
        MODULES["performance"].UpdateAFKOverlay();
}

// Userscript loader. write your own!
//Copy and paste this function named userscripts() into the JS Dev console. (F12)
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //insert code here:
}

//test.
function throwErrorfromMain() {
    throw new Error("We have successfully read the thrown error message out of the main file");
}

//Magic Numbers
var runInterval = 100;      //How often to loop through logic

startAT();
