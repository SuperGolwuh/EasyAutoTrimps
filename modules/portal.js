MODULES["portal"] = {};
MODULES["portal"].timeout = 10000;  //time to delay before autoportaling in milliseconds
MODULES["portal"].bufferExceedFactor = 5;  //amount for: allows portaling midzone if we exceed (5x) the buffer

/////////////////////////////////////////////////////
//Portal Related Code)///////////////////////////////
/////////////////////////////////////////////////////
var zonePostpone = 0;   //additional postponement of the zone above.

//Decide When to Portal
function autoPortal() {
    if(!game.global.portalActive) return;
    var autoFinishDaily = (game.global.challengeActive == "Daily" && getPageSetting('AutoFinishDailyNew') != 999);
    var autoFinishDailyZone = getPageSetting('AutoFinishDailyNew');
    if (!autoFinishDaily)
        autoFinishDailyZone = 0;    //dont use stale disabled values
    switch (autoTrimpSettings.AutoPortal.selected) {
        //portal if we have lower He/hr than the previous zone (or buffer)
        case "Helium Per Hour":
            var OKtoPortal = false;
            if (!game.global.challengeActive || autoFinishDaily) {
                var minZone = getPageSetting('HeHrDontPortalBefore');
                minZone += autoFinishDailyZone;
                game.stats.bestHeliumHourThisRun.evaluate();    //normally, evaluate() is only called once per second, but the script runs at 10x a second.
                var bestHeHr = game.stats.bestHeliumHourThisRun.storedValue;
                var bestHeHrZone = game.stats.bestHeliumHourThisRun.atZone;
                var myHeliumHr = game.stats.heliumHour.value();
                var heliumHrBuffer = Math.abs(getPageSetting('HeliumHrBuffer'));
                //Multiply the buffer by (5) if we are in the middle of a zone   (allows portaling midzone if we exceed (5x) the buffer)
                if (!aWholeNewWorld)
                    heliumHrBuffer *= MODULES["portal"].bufferExceedFactor;
                var bufferExceeded = myHeliumHr < bestHeHr * (1-(heliumHrBuffer/100));
                if (bufferExceeded && game.global.world >= minZone) {
                    OKtoPortal = true;
                    if (aWholeNewWorld)
                        zonePostpone = 0;   //reset the zonePostPone if we see a new zone
                }
                //make sure people with 0 buffer only portal on aWholeNewWorld (not midzone)
                if (heliumHrBuffer == 0 && !aWholeNewWorld)
                    OKtoPortal = false;
                //Postpone Portal (and Actually Portal) code:
                if (OKtoPortal && zonePostpone == 0) {
                    zonePostpone+=1;
                    debug("My HeliumHr was: " + myHeliumHr + " & the Best HeliumHr was: " + bestHeHr + " at zone: " +  bestHeHrZone, "portal");
                    cancelTooltip();
                    tooltip('confirm', null, 'update', '<b>Auto Portaling NOW!</b><p>Hit Delay Portal to WAIT 1 more zone.', 'zonePostpone+=1', '<b>NOTICE: Auto-Portaling in 10 seconds....</b>','Delay Portal');
                    //set up 2 things to happen after the timeout. close the tooltip:
                    setTimeout(cancelTooltip,MODULES["portal"].timeout);
                    //and check if we hit the confirm to postpone, and if not, portal.
                    setTimeout(function(){
                        if (zonePostpone >= 2)
                            return; //do nothing if we postponed.
                        if (autoFinishDaily){
                            abandonDaily();
                            document.getElementById('finishDailyBtnContainer').style.display = 'none';
                        }
                        //
                        if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                            doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                        else
                            doPortal();
                    },MODULES["portal"].timeout+100);
                }
            }
            break;
        case "Custom":
            if ((game.global.world > getPageSetting('CustomAutoPortal')+autoFinishDailyZone) &&
                (!game.global.challengeActive || autoFinishDaily)) {
                if (autoFinishDaily) {
                    abandonDaily();
                    document.getElementById('finishDailyBtnContainer').style.display = 'none';
                }
                //
                if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                    doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                else
                    doPortal();
            }
            break;
        case "Balance":
        case "Decay":
        case "Electricity":
        case "Life":
        case "Crushed":
        case "Nom":
        case "Toxicity":
        case "Watch":
        case "Lead":
        case "Corrupted":
        case "Domination":
            if(!game.global.challengeActive) {
                doPortal(autoTrimpSettings.AutoPortal.selected);
            }
            break;
        default:
            break;
    }
}

//Actually Portal.
function doPortal(challenge) {
    if(!game.global.portalActive) return;
    if (getPageSetting('AutoMagmiteSpender2') == 1) autoMagmiteSpender();
    if (getPageSetting('AutoUpgradeHeirlooms') && !heirloomsShown) autoNull();  //"Auto Upgrade Heirlooms" (heirlooms.js)
    let daily = false;
    //Go into portal screen
    portalClicked();
    //Auto Start Daily:
    if (getPageSetting('AutoStartDaily')){
        selectChallenge('Daily');
        checkCompleteDailies();

        var lastUndone = -7; // Note: Most previous challenge == -6
        while (++lastUndone <= 0){
            var done = (game.global.recentDailies.indexOf(getDailyTimeString(lastUndone)) != -1);
            if (!done)
                break;
        }

        if (lastUndone == 1){ // None
            debug("All available Dailies already completed.", "portal");
            //Fallback to w/e Regular challenge we picked. Or none (unselect)
            selectChallenge(challenge || 0);
        } 
        else{
            getDailyChallenge(lastUndone);
            daily = true;
            debug("Portaling into Daily for: " + getDailyTimeString(lastUndone, true) + " now!", "portal");
        }
    }
    //Regular Challenge:
    else if(challenge)
        selectChallenge(challenge);
    
    if (getPageSetting('AutoAllocatePerks') == 1) {
        if (autoTrimpSettings.PresetList[0] === 1) {
            autoTrimpSettings.APValueBoxes = autoTrimpSettings.PresetList[daily?2:1];
            AutoPerks.updateBoxesUI();
            saveSettings();
        }
        AutoPerks.clickAllocate();
    }
    
    //Push He Data for graphs.js:
    pushData();
    //Actually Portal.
    activateClicked(); //click button
    activatePortal(); //confirm
    zonePostpone = 0;
    if (game.global.challengeActive === "Daily") nextEnlight();
}

// Finish Challenge2 (UNI mod)
function finishChallengeSquared(){
    // some checks done before reaching this:
    // getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared
    var zone = getPageSetting('FinishC2');
    if (game.global.world >= zone) {
        abandonChallenge();
        debug("Finished challenge2 because we are on zone " + game.global.world, "other", 'oil');
    }
}

//helper for returning the proper level we should be auto-portaling at.
function findOutCurrentPortalLevel(){
    var portalLevel = -1;
    var leadCheck = false;
    var portalLevelName =
    {
        "Balance" : 41,
        "Decay" : 56,
        "Electricity" : 82,
        "Crushed" : 126,
        "Nom" : 146,
        "Toxicity" : 166,
        "Lead" : 181,
        "Watch" : 181,
        "Corrupted" : 191,
        "Domination": 216
    };
    var AP = getPageSetting("AutoPortal");
    switch (AP){
        case "Off":
            break;
        case "Custom":
            portalLevel = getPageSetting('CustomAutoPortal') + 1;
            leadCheck = getPageSetting('HeliumHourChallenge') == "Lead" ? true : false;
            break;
        default:
            var result = portalLevelName[AP];
            if (result)
                portalLevel = result;
            break;
    }
    return {level:portalLevel, lead:leadCheck};
}

function DailyQueueInit() {
    return queuePresetObj([0,"W","W","I"]);
}

function queuePresetObj(arr)
{
    if (typeof autoTrimpSettings.DailyQueue === "undefined") autoTrimpSettings.DailyQueue = arr;
    var preset = [];
    for (let i = 0; i < autoTrimpSettings.DailyQueue.length; i++)
    {
        preset[i] = (typeof autoTrimpSettings.DailyQueue[i] !== "undefined") ? autoTrimpSettings.DailyQueue[i] : arr[i];
    }
    if (preset[0] === "") preset[0] = 0;
    return preset;
}

function updateDailyQueue(arr)
{
    autoTrimpSettings.DailyQueue = queuePresetObj(typeof arr === "undefined" ? autoTrimpSettings.DailyQueue : arr);
    saveSettings();
}

function toggleDailyQueue() {
    autoTrimpSettings.DailyQueue[0] = autoTrimpSettings.DailyQueue[0] === 0 ? 1 : -1 * autoTrimpSettings.DailyQueue[0];
    saveSettings();
}

function nextEnlight() {
    autoTrimpSettings.DailyQueue = DailyQueueInit();

    if (autoTrimpSettings.DailyQueue[0] <= 0) return false; //If arr[0] is 0 disable Enlight Queueing
    else
    {
       let enlight = "";
       switch (autoTrimpSettings.DailyQueue[autoTrimpSettings.DailyQueue[0]]) {
           case "P":
               enlight = "Poison"; break;
           case "W":
               enlight = "Wind"; break;
           case "I":
               enlight = "Ice"; break;
           default:
               break;
       }
       if (enlight !== "") naturePurchase('uberEmpower', enlight);
       autoTrimpSettings.DailyQueue[0]++;
       if (autoTrimpSettings.DailyQueue[0] > autoTrimpSettings.DailyQueue.length-1)
           autoTrimpSettings.DailyQueue[0] = 1; //If arr[0] passes last index, loop back to first index
    }
    saveSettings();
}
