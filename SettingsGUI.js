//AutoTrimps Settings GUI - Current Version 2.1.6.9
//maintained by genBTC, current as of 3/20/2018

//create the Automation icon in the game bar (self-executing)
//This creates the entire DOM-structure for this page.
function automationMenuInit() {
    var settingBtnSrch = document.getElementsByClassName("btn btn-default");
    //Change Settings button handler to go through AutoTrimps Settings
    for (var i = 0; i < settingBtnSrch.length; i++) {
        if (settingBtnSrch[i].getAttribute("onclick") === "toggleSettingsMenu()")
            settingBtnSrch[i].setAttribute("onclick", "autoPlusSettingsMenu()");
    }
    //create the AutoTrimps Script button (bottom toolbar)
    var newItem = document.createElement("TD");
    //newItem.appendChild(document.createTextNode("AutoTrimps"));
    newItem.appendChild(document.createTextNode("AutoTrimps v" + ver));
    newItem.setAttribute("class", "btn btn-default");
    newItem.setAttribute("onclick", "autoToggle()");
    var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
    settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);
    

    
    
    //create automaps button (in the world sidebar)
    var newContainer = document.createElement("DIV");
    //newContainer.setAttribute("class", "battleSideBtnContainer");
    newContainer.setAttribute("style", "margin-top: 0.2vw; display: block; font-size: 1.1vw; height: 1.5em; text-align: center; border-radius: 4px");
    newContainer.setAttribute("id", "autoMapBtn");
    newContainer.setAttribute("class", "noselect settingsBtn");
    newContainer.setAttribute("onClick", "toggleAutoMaps()");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Toggle Automapping2\", \"customText\", event, \"Toggle automapping2 on and off.\")');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    var abutton = document.createElement("SPAN");
    abutton.appendChild(document.createTextNode("Auto Maps"));
    abutton.setAttribute("id", "autoMapLabel");
    var fightButtonCol = document.getElementById("battleBtnsColumn");
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //create automaps status (in the world sidebar)
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1.1vw; text-align: center; background-color: rgba(0,0,0,0.3);");
    
    //status
    newContainer.setAttribute("onmouseover", 'tooltip(\"Current Status\", \"customText\", event, \" What\'s happening.")');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'autoMapStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //DHratio
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1vw; text-align: center; margin-top: 2px; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Damage to Health Ratio\", \"customText\", event, \"      threshold = " + threshold.toFixed(3))');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton1 = document.createElement("SPAN");
    abutton1.id = 'hiderStatus1';
    newContainer.appendChild(abutton1);
    fightButtonCol.appendChild(newContainer);
    
    //He/hr percent (in world sidebar)
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1vw; text-align: center; margin-top: 2px; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Helium/Hr Info\", \"customText\", event, \"Current He/hr % out of lifetime Helium.<br> Current Helium out of lifetime Helium: " + ((game.resources.helium.owned / (game.global.totalHeliumEarned - game.resources.helium.owned)) * 100).toFixed(3) + "%.<br>\" + getDailyHeHrStats())');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton2 = document.createElement("SPAN");
    abutton2.id = 'hiderStatus2';
    newContainer.appendChild(abutton2);
    fightButtonCol.appendChild(newContainer);

    //make timer clock toggle paused mode when clicked (bottom right)
    var $portalTimer = document.getElementById('portalTimer');
    $portalTimer.setAttribute('onclick', 'toggleSetting(\'pauseGame\')');
    $portalTimer.setAttribute('style', 'cursor: default');

    //shrink padding for fight buttons to help fit automaps button/status
    var btns = document.getElementsByClassName("fightBtn");
    for (var x = 0; x < btns.length; x++) {
        btns[x].style.padding = "0.01vw 0.01vw";
    }
}
automationMenuInit();

//create container for settings buttons (this is seperate because it needs to
//  be re-run seperately to reset when importing)
function automationMenuSettingsInit() {
    var settingsrow = document.getElementById("settingsRow");
    var autoSettings = document.createElement("DIV");
    autoSettings.id = "autoSettings";
    autoSettings.setAttribute("style", "display: none; max-height: 92.5vh;overflow: auto;");
    autoSettings.setAttribute("class","niceScroll");
    settingsrow.appendChild(autoSettings);
}
automationMenuSettingsInit();

//prepare CSS for new Tab interface
var link1 = document.createElement('link');
link1.rel = "stylesheet";
link1.type = "text/css";
link1.href = basepath + 'tabs.css';
document.head.appendChild(link1);

//Tab make helperfunctions
function createTabs(name, description) {
    var li_0 = document.createElement('li');
    var a_0 = document.createElement('a');
    a_0.className = "tablinks";
    a_0.setAttribute('onclick', 'toggleTab(event, \'' + name + '\')');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode(name));
    li_0.id = 'tab' + name;
    li_0.appendChild(a_0);
    addtabsUL.appendChild(li_0);
    createTabContents(name, description);
}

function createTabContents(name, description) {
    var div_0 = document.createElement('div');
    div_0.className = "tabcontent";
    div_0.id = name;
    var div_1 = document.createElement('div');
    div_1.setAttribute("style", "margin-left: 1vw; margin-right: 1vw;");
    var h4_0 = document.createElement('h4');
    h4_0.setAttribute('style', 'font-size: 1.2vw;');
    h4_0.appendChild(document.createTextNode(description));
    div_1.appendChild(h4_0);
    div_0.appendChild(div_1);
    addTabsDiv.appendChild(div_0);
}

//Toggle handler (onclick)
function toggleTab(evt, tabName) {
    if (evt.currentTarget.className.indexOf(" active") > -1) {
        document.getElementById(tabName).style.display = "none";
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
    } else {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
}

//Minimize button handler
function minimizeAllTabs() {
    // Get all elements with class="tabcontent" and hide them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0,len = tabcontent.length; i < len ; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0,len = tablinks.length; i < len ; i++) {
        // if (!(tablinks[i].className.includes('minimize') || tablinks[i].className.includes('maximize') || tablinks[i].className.includes('tabclose') || tablinks[i].parentNode.id.includes('tabCore')))
            // tablinks[i].style.display = "none";
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

//Minimize button handler
function maximizeAllTabs() {
    // Get all elements with class="tabcontent" and show them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0,len = tabcontent.length; i < len ; i++) {
        tabcontent[i].style.display = "block";
    }
    // Get all elements with class="tablinks" and add the class "active"
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0,len = tablinks.length; i < len ; i++) {
        tablinks[i].style.display = "block";
        if (!tablinks[i].className.includes(' active'))
            tablinks[i].className += " active";
    }
}

var addTabsDiv;
var addtabsUL;
//Actually Make the Tabs
function initializeAllTabs() {
    //CREATE TABS + CONTENT
    addTabsDiv = document.createElement('div');
    addtabsUL = document.createElement('ul');
    addtabsUL.className = "tab";
    addtabsUL.id = 'autoTrimpsTabBarMenu';
    addtabsUL.style.display = "none";
    //Pin settings Tab Bar to the top like the other bar?
    var sh = document.getElementById("settingsRow")
    sh.insertBefore(addtabsUL, sh.childNodes[2]);
    //addTabsDiv.appendChild(addtabsUL);
    //Then it has to be maintained and toggled on off.
    //Make Tabs.
    
    createTabs("Core", "Meowchan's Fork Ver. " + ver + " / " + verDate + " ");
    createTabs("Buildings", "Building Settings");
    createTabs("Jobs", "Jobs - Worker Settings");
    createTabs("Gear", "Gear - Equipment Settings");
    createTabs("Maps", "Maps - AutoMaps & VoidMaps Settings");
    createTabs("Spire", "Spire - Settings for Spires");
    createTabs("Combat", "Combat & Stance Settings");
    //createTabs("Scryer", "Scryer Settings");
    createTabs("Magma", "Dimensional Generator & Magmite Settings");
    createTabs("Heirlooms", "Heirloom Settings");
    createTabs("Golden", "Golden Upgrade Settings");
    createTabs("Nature", "Nature Settings");
    createTabs("Display", "Display & Spam Settings");
    //createTabs("Modules", "Load/Unload Modules & Settings");
    createTabs("Import Export", "Import & Export Settings");
    //add a minimize button:
    var li_0 = document.createElement('li');
    var a_0 = document.createElement('a');
    a_0.className = "tablinks minimize";
    a_0.setAttribute('onclick', 'minimizeAllTabs();');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode("-"));
    li_0.appendChild(a_0);
    li_0.setAttribute("style", "float:right!important;");
    li_0.setAttribute("onmouseover",'tooltip("Minimize all tabs", "customText", event, "Minimize all AT settings tabs.")');
    li_0.setAttribute("onmouseout", 'tooltip("hide")');
    //add a maximize button:
    var li_1 = document.createElement('li');
    var a_1 = document.createElement('a');
    a_1.className = "tablinks maximize";
    a_1.setAttribute('onclick', 'maximizeAllTabs();');
    a_1.href = "#";
    a_1.appendChild(document.createTextNode("+"));
    li_1.appendChild(a_1);
    li_1.setAttribute("style", "float:right!important;");
    li_1.setAttribute("onmouseover",'tooltip("Maximize all tabs", "customText", event, "Maximize all AT settings tabs.")');
    li_1.setAttribute("onmouseout", 'tooltip("hide")');
    //add a minimize button:
    var li_2 = document.createElement('li');
    var a_2 = document.createElement('a');
    a_2.className = "tablinks tabclose";
    a_2.setAttribute('onclick', 'autoToggle();');
    a_2.href = "#";
    a_2.appendChild(document.createTextNode("x"));
    li_2.appendChild(a_2);
    li_2.setAttribute("style", "float:right!important;");
    li_2.setAttribute("onmouseover",'tooltip("Exit (duplicate)", "customText", event, "Closes/toggles/hides AutoTrimps (just a UI shortcut)")');
    li_2.setAttribute("onmouseout", 'tooltip("hide")');
    addtabsUL.appendChild(li_2);    //close
    addtabsUL.appendChild(li_1);    //max
    addtabsUL.appendChild(li_0);    //min
    //Insert tabs into the game area
    document.getElementById("autoSettings").appendChild(addTabsDiv);
    //pretend click to make first tab active.
    document.getElementById("Core").style.display = "block";
    document.getElementsByClassName("tablinks")[0].className += " active";
}
initializeAllTabs();

//Actually Make the Settings Buttons
function initializeAllSettings() {
    //START MAKING BUTTONS IN THE TABS:



//CORE:
    //Line1:
    createSetting('ManualGather2', ['Manual Gather/Build', 'Auto Gather/Build'], 'Controls what YOU do. Manual does nothing.', 'multitoggle', 1, null, "Core");
    createSetting('BuyUpgradesNew', ['Manual Upgrades', 'Buy All Upgrades', 'Upgrades no Coords'], 'Autobuys non-equipment upgrades (equipment is controlled in the Gear tab). The second option does NOT buy coordination (use this <b>ONLY</b> if you know what you\'re doing).', 'multitoggle', 1, null, "Core");
    createSetting('NoCoordBuyStartZ', 'Start no Coord Buy', 'From this zone, stop buying coord upgrades until we reach Amalgamator Goal. Disable with -1.', 'value', -1, null, 'Core');
    createSetting('TillWeHaveAmalg', 'Amalgamator Goal', 'Beginning from Start no Coord Buy zone, will not buy any more coordinations until we have this many Amalgamators. -1 to disable.', 'value', -1, null, 'Core');
    createSetting('AutoAllocatePerks', ['Auto Allocate Off', 'Auto Allocate On', 'Dump into Looting II'], 'Uses the AutoPerks ratio based preset system to automatically allocate your perks to spend whatever helium you have when you AutoPortal. Does not change Fixed Perks: siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, capable. Dump all He into Looting II', 'multitoggle', 0, null, 'Core');
    
    //Line2
    createSetting('AutoStartDaily', 'Auto Start Daily', 'With this on, the Auto Portal options will portal you into and auto-start the daily <b>whenever available</b>. Starts from the oldest available, and works forwards. Falls back to selected challenge when there are no more dailies available.', 'boolean', false, null, 'Core');
    createSetting('FinishC2', 'Finish Challenge2', 'Finish / Abandon Challenge2 (any) when this zone is reached, if you are running one. For manual use. Recommended: Zones ending with 0 for most Challenge2. Disable with -1. Does not affect Non-Challenge2 runs.', 'value', -1, null, 'Core');
    document.getElementById('FinishC2').parentNode.insertAdjacentHTML('afterend','<br>');
    

    //NewLine3 For Autoportal, it would be nice to add a 5s countdown, like with magma spending.
    createSetting('AutoPortal', 'AutoPortal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Helium Per Hour only <b>portals at cell 1</b> of the first level where your He/Hr went down even slightly compared to the current runs Best He/Hr. Take note, there is a Buffer option, which is like a grace percentage of how low it can dip without triggering. Setting a buffer will portal mid-zone if you exceed 5x of the buffer.  CAUTION: Selecting He/hr may immediately portal you if its lower-(use Pause AutoTrimps button to pause the script first to avoid this)', 'dropdown', 'Off', ['Off', 'Helium Per Hour', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Domination', 'Custom'], "Core");
    createSetting('HeliumHourChallenge', 'Portal Challenge', 'Automatically portal into this challenge when using helium per hour or custom autoportal. Custom portals after cell 100 of the zone specified. ', 'dropdown', 'None', ['None', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Domination'], "Core");
    document.getElementById("HeliumHourChallengeLabel").innerHTML = "Portal Challenge:";    //fit it on 1 line.
    createSetting('CustomAutoPortal', 'Custom Portal', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "Core");
    createSetting('HeHrDontPortalBefore', 'Don\'t Portal Before', 'Do NOT allow Helium per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in helium/hr from triggering autoportal. Set to 0 or -1 to completely disable this check. (only shows up with Helium per Hour set)', 'value', '999', null, "Core");
    createSetting('HeliumHrBuffer', 'He/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Core');
    createSetting('AutoFinishDailyNew', 'Portal Daily Modifier', 'Modifies your normal auto portal zone in dailies. Accepts negative numbers as well, which will make you portal sooner on dailies. To disable AutoPortal during a daily, turn off the AutoPortal option or set this to <b>999</b>.', 'valueNegative', 999, null, 'Core');
    createSetting('VoidMapsDailyMod', 'VMs Daily Modifier', 'Adds this value to your normal VM map in dailies. Accepts negative values as well. <b>Disabling this will use your portal daily modifier instead.</b> Disable with 999', 'valueNegative', 999, null, 'Core');
    
    createSetting('PauseScript', 'Pause AutoTrimps', 'Pause AutoTrimps Script (not including the graphs module)', 'boolean', null, null, 'Core');
    //code to locate the pause button at lower right
    var $pauseScript = document.getElementById('PauseScript');
    $pauseScript.parentNode.style.setProperty('float','right');
    $pauseScript.parentNode.style.setProperty('margin-right','1vw');
    $pauseScript.parentNode.style.setProperty('margin-left','0');




//Buildings
    createSetting('BuyBuildingsNew', ['Buy Neither','Buy Buildings & Storage', 'Buy Buildings', 'Buy Storage'], 'AutoBuys Storage when it is almost full (it even anticipates Jestimp) and Non-Storage Buildings (As soon as they are available). Takes cost efficiency into account before buying Non-Storage Buildings.', 'multitoggle', 1, null, "Buildings"); //This should replace the two below
    createSetting('WarpstationCap', 'Warpstation Cap', 'Do not level Warpstations past Basewarp+DeltaGiga **. Without this, if a Giga wasnt available, it would level infinitely (wastes metal better spent on prestiges instead.) **The script bypasses this cap each time a new giga is bought, when it insta-buys as many as it can afford (since AT keeps available metal/gems to a low, overbuying beyond the cap to what is affordable at that first moment is not a bad thing). ', 'boolean', true, null, 'Buildings');
    //createSetting('WarpstationCoordBuy', 'Buy Warp to Hit Coord', 'If we are very close to hitting the next coordination, and we can afford the warpstations it takes to do it, Do it! (even if we are over the Cap/Wall). Recommended with WarpCap/WarpWall. (has no point otherwise) ', 'boolean', true, null, 'Buildings'); //Can this just be removed? if it happens, its a good thing.
    createSetting('MaxHut', 'Max Huts', 'Huts', 'value', '100', null, "Buildings");
    createSetting('MaxHouse', 'Max Houses', 'Houses', 'value', '100', null, "Buildings");
    createSetting('MaxMansion', 'Max Mansions', 'Mansions', 'value', '100', null, "Buildings");
    createSetting('MaxHotel', 'Max Hotels', 'Hotels', 'value', '100', null, "Buildings");
    //Line2
    createSetting('MaxResort', 'Max Resorts', 'Resorts', 'value', '100', null, "Buildings");
    createSetting('MaxGateway', 'Max Gateways', 'Gateways', 'value', '25', null, "Buildings");
    createSetting('MaxWormhole', 'Max Wormholes', 'WARNING: Wormholes cost helium! Values below 0 do nothing.', 'value', '0', null, "Buildings");
    createSetting('MaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1', null, "Buildings");
    createSetting('MaxGym', 'Max Gyms', 'Advanced. recommend: -1', 'value', '-1', null, "Buildings"); //Remove?
    createSetting('MaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1', null, "Buildings"); //Remove? (More gems is never a bad thing...)
    //createSetting('GymWall', 'Gym Wall', 'Conserves Wood. Only buys 1 Gym when you can afford <b>X</b> gyms wood cost (at the first one\'s price, simple math). -1 or 0 to disable. In other words, only allows gyms that cost less than 1/nth your currently owned wood. (to save wood for nurseries for new z230+ Magma nursery strategy). Takes decimal numbers. (Identical to the Warpstation wall setting which is why its called that). Setting to 1 does nothing besides stopping gyms from being bought 2 at a time due to the mastery.', 'value', -1, null, 'Buildings'); //remove?
    //Line3
    createSetting('FirstGigastation', 'First Gigastation', 'How many warpstations to buy before your first gigastation', 'value', '20', null, "Buildings");
    createSetting('DeltaGigastation', 'Delta Gigastation', 'How many extra warpstations to buy for each gigastation. Supports decimal values. For example 2.5 will buy +2/+3/+2/+3...', 'value', '2', null, "Buildings");
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Conserves Metal. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', -1, null, 'Buildings');
    createSetting('MaxNursery', 'Max Nurseries', 'Advanced. Recommend: 9999 until you reach Magma (z230+)', 'value', '-1', null, "Buildings");
    createSetting('NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to 230+ for now. Can use combined with the old Max Nurseries cap setting.', 'value', 1, null, 'Buildings');
    createSetting('NoNurseriesIce', 'No Nurseries Ice', 'Do not buy Nurseries in Ice zones. Nurseries will still be bought in an Ice zone if it is within 5 zones of No Nurseries Until value. This is to ensure that max nurseries can be reached.', 'boolean', true, null, 'Buildings');



//Jobs
    createSetting('BuyJobsNew', 'Auto Jobs', 'Buys jobs for your trimps according to the ratios below.', 'boolean', true, null, "Jobs");
    createSetting('FarmerRatio', 'Farmer Ratio', '', 'value', '1', null, "Jobs"); //realistically gems are not that useful by the time you have magmamancers... maybe just set it to only spend 50% of your gems at a time and leave it at that? 10% is kinda low anyway
    createSetting('LumberjackRatio', 'Lumberjack Ratio', '', 'value', '1', null, "Jobs");
    createSetting('MinerRatio', 'Miner Ratio', '', 'value', '1', null, "Jobs");
    //createSetting('ScientistRatio', 'Scientist Ratio', '', 'value', '1', null, "Jobs");
    createSetting('MaxScientists', 'Max Scientists', 'Advanced. Cap your scientists (This is an absolute number not a ratio). recommend: -1 (infinite still controls itself)', 'value', '-1', null, "Jobs");
    //Line2
    createSetting('MaxExplorers', 'Max Explorers', 'Advanced. Cap your explorers (This is an absolute number not a ratio). recommend: -1', 'value', '-1', null, "Jobs"); //Explorers are important now! outdated setting tbh
    createSetting('MaxTrainers', 'Max Trainers', 'Advanced. Cap your trainers (This is an absolute number not a ratio). recommend: -1', 'value', '-1', null, "Jobs"); //by the time that you stop needing block, food is abundant
    createSetting('TrainerCaptoTributes', 'Cap Trainers %', 'Only Buy a Trainer when its cost is LESS than X% of cost of a tribute. This setting can work in combination with the other one, or set the other one to -1 and this will take full control. Default: -1 (Disabled). 50% is close to the point where the cap does nothing. You can go as low as you want but recommended is 10% to 1%. (example: Trainer cost of 5001, Tribute cost of 100000, @ 5%, it would NOT buy the trainer.)', 'value', '-1', null, 'Jobs'); //this is a bit unnecessary, resource management by the script is already sufficient.




//GEAR:
    createSetting('BuyArmorNew', ['Armor: Buy Neither','Armor: Buy Both', 'Armor: Prestiges', 'Armor: Levels'], 'AutoBuys Prestiges and Levels up the most cost efficient Armor available. Gymystic buying is controlled under this setting\'s prestige option', 'multitoggle', 1, null, "Gear"); //This should replace the two below
    createSetting('BuyWeaponsNew', ['Weapons: Buy Neither','Weapons: Buy Both', 'Weapons: Prestiges', 'Weapons: Levels'], 'AutoBuys Prestiges and Levels up the most cost efficient Weapon available.', 'multitoggle', 1, null, "Gear"); //This should replace the two below
    //createSetting('DynamicPrestige2', 'Dynamic Prestige z', 'Dynamic Prestige: <b>Set Target Zone number: Z #. (disable with 0 or -1)</b><br> Skip getting prestiges at first, and Gradually work up to the desired Prestige setting you have set (set the Prestige dropdown to the highest weapon you want to end up on at the target zone you set here). Runs with Dagger to save a significant amount of time until we need better gear, then starts increasing the prestige setting near the end of the run.  Examines which prestiges you have, how many missing ones youd need to achieve the desired target and starts running maps every zone (more maps for higher settings), Until the target prestige is reached. ', 'value', -1, null, 'Gear');
    //createSetting('Prestige', 'Prestige', 'Acquire prestiges through the selected item (inclusive) as soon as they are available in maps. Forces equip first mode. Automap must be enabled. THIS IS AN IMPORTANT SETTING related to speed climbing and should probably always be on something. If you find the script getting stuck somewhere, particularly where you should easily be able to kill stuff, setting this to an option lower down in the list will help ensure you are more powerful at all times, but will spend more time acquiring the prestiges in maps.', 'dropdown', 'Polierarm', ['Off', 'Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'], "Gear");
    //Make a backup of the prestige setting: backup setting grabs the actual value of the primary setting any time it is changed, (line 784 of the function settingChanged())
    /*var lastSetting = autoTrimpSettings["PrestigeBackup"];
    autoTrimpSettings["PrestigeBackup"] = {
        selected: (lastSetting != undefined ? lastSetting.selected : autoTrimpSettings["Prestige"].selected ) || "Off",
        id: "PrestigeBackup",
        name: "PrestigeBackup"
    };*/
    //Line2:
    //createSetting('ForcePresZ', 'Force Prestige Z', 'On and after this zone is reached, always try to prestige for everything immediately, ignoring Dynamic Prestige settings and overriding that of Linear Prestige. Prestige Skip mode will exit this. Disable with -1.', 'value', -1, null, 'Gear');
    //createSetting('PrestigeSkip1_2', ['Prestige Skip Off','Prestige Skip 1 & 2', 'Prestige Skip 1', 'Prestige Skip 2'], '<b>Prestige Skip 1:</b> If there are more than 2 Unbought Prestiges (besides Shield), ie: sitting in your upgrades window but you cant afford them, AutoMaps will not enter Prestige Mode, and/or will exit from it. The amount of unboughts can be configured with this variable MODULES[\\"maps\\"].SkipNumUnboughtPrestiges = 2; <br><b>Prestige Skip 2:</b> If there are 2 or fewer <b>Unobtained Weapon Prestiges in maps</b>, ie: there are less than 2 types to run for, AutoMaps will not enter Prestige Mode, and/or will exit from it. For users who tends to not need the last few prestiges due to resource gain not keeping up. The amount of unboughts can be configured with MODULES.maps.UnearnedPrestigesRequired. If PrestigeSkipMode is enabled, both conditions need to be reached before exiting.', 'multitoggle', 0, null, "Gear");
    createSetting('BuyShieldblock', 'Buy Shield Block', 'Will buy the shield block upgrade. CAUTION: If you are progressing past zone 60, you probably don\'t want this :)', 'boolean', false, null, "Gear");




//AutoMaps + VoidMaps settings:
    createSetting('AutoMaps', ["Auto Maps Off","Auto Maps On","Auto Maps No Unique"], 'Automaps. The no unique setting will not run unique maps such as dimensions of anger. Recommended ON. ', 'multitoggle', 1, null, "Maps");
    //createSetting('DynamicSiphonology', 'Dynamic Siphonology', 'Recommended Always ON. Use the right level of siphonology based on your damage output. IE: Only uses  siphonology if you are weak. With this OFF it means it ALWAYS uses the lowest siphonology map you can create. Siphonology is a perk you get at level 115-125ish, and means you receive map bonus stacks for running maps below your current zone - Up to 3 zones below (1 per perk level).', 'boolean', true, null, 'Maps'); //Should always be on?
    createSetting('PreferMetal', 'Prefer Metal Maps', 'Always prefer metal maps, intended for manual use, such as pre-spire farming. Remember to turn it back off after you\'re done farming!', 'boolean', false, null, 'Maps'); //rarely better tbh
    //createSetting('MaxMapBonusAfterZone', 'Max MapBonus After', 'Always gets Max Map Bonus from this zone on. (inclusive and after).<br><b>NOTE:</b> Set -1 to disable entirely (default). Set 0 to use it always.<br><b>Advanced:</b>User can set a lower number than the default 10 maps with the AT hidden console command: MODULES[\\"maps\\"].maxMapBonusAfterZ = 9;', 'value', '-1', null, 'Maps');
    //createSetting('DisableFarm', 'Disable Farming', 'Disables the extended farming algorithm of the AutoMaps part of the script. Always returns to the world after reaching 10 map stacks. Use at your own risk. (No need to refresh anymore)', 'boolean', false, null, 'Maps');
    //createSetting('LowerFarmingZone', 'Lower Farming Zone', 'Lowers the zone used during Farming mode. Uses the dynamic siphonology code, to Find the minimum map level you can successfully one-shot, and uses this level for any maps done after the first 10 map stacks. The difference being it goes LOWER than what Siphonology gives you map-bonus for, but after 10 stacks you dont need bonus, you just want to do maps that you can one-shot. Goes as low as 10 below current zone if your damage is that bad, but this is extreme and indicates you should probably portal.', 'boolean', true, null, 'Maps');

    //Line2
    //createSetting('CorruptionCalc', 'Corruption Farm Mode', 'Recommended. Enabling this will cause the Automaps routine to take amount of corruption in a zone into account, to decide whether it should do maps first for map bonus. ONLY in Zone 181+ (or Headstart 1,2,3 zone: 176,166,151) ', 'boolean', true, null, 'Maps');

    //Line3
    createSetting('VoidMaps', 'Void Maps', 'The zone at which you want all your void maps to be cleared. During dailies it will add VMs Daily Modifier unless VMs Daily Modifier is set to 999, in which case it will add Portal Daily Modifier instead. 0 to disable.', 'value', '0', null, "Maps");
    createSetting('RunNewVoidsUntilNew', 'New Voids Mod', 'This allows you to run new Void Maps obtained after Void Maps zone for a certain number of zones. For example set this to 10 to run new void maps for 10 more zones. 0 to disable, -1 to run VMs past VM zone always.', 'value', '0', null, 'Maps'); //Should replace the two below
    createSetting('StackedVoids','Do Stacked Voids Over', 'This makes it so that AutoMaps only runs stacked void maps stacked greater than value inputted. Set to 0 to run all void maps', 'value' , 0, null ,"Maps");
    //createSetting('PRaidSetting', 'Auto PRaid', 'With this on AT will decide automatically when to Prestige Raid based on zone, damage and zone type.', 'boolean', true, null, 'Maps');
    createSetting('PRaidingZoneStart', 'Map Raiding Start', 'Starting this zone, begin raiding higher maps for prestige. -1 for never.', 'value', -1, null, 'Maps');
    createSetting('PAggression', ['PRaid: Light', 'PRaid: Aggressive', 'PRaid: Endgame'], 'How aggressively should AT chase after prestige. Aggressive costs more fragments. If you have a plagued staff with fragment drop then you probably want aggressive mode. Endgame will more liberally buy perfect prestigious maps.', 'multitoggle', 1, null, 'Maps');
    createSetting('PRaidingMaxZones', 'Max Extra Zones', 'Caps maximum extra Zones AT should ever buy chasing prestige. If BW Raid is enabled then will always attempt to prestige raid the highest possible before beginning BW raiding.', 'value', 10, null, 'Maps');
    
    //createSetting('BWraidDailyCOnly', 'BW Raiding Daily/C2 Only', 'Only BW raid in dailies and challenges', 'boolean', false, null, 'Maps');
    createSetting('BWRaidSetting', ['Never','C2 Only', 'C2 + Dailies', 'Always'], 'When to raid BW.', 'multitoggle', 0, null, 'Maps');
    createSetting('BWraidingmin', 'BWRaid Start', 'Starting this zone, BWRaid becomes a possibility. BW Raiding always takes place at the last Poison zone.', 'value', 999, null, 'Maps');
    createSetting('BWraidingmaxLevel', 'BWRaid Max Extra', 'The maximum level difference between world zone and BW map level.', 'value', 20, null, 'Maps');
    createSetting('BWraidingmax', 'BWRaid Cap', 'The highest level BW map to raid.', 'value', 999, null, 'Maps');
    createSetting('MoreFarming', 'More Farming', 'Will attempt to run LMC/LSW/LWW maps each zone (and twice on giga zones). Used to min-max pre-zone 230 for the 3 big C2s (Obliterated, Coordinated, Trimp).', 'boolean', false, null, 'Maps');
    createSetting('Pre60LMC', 'Pre60 LMC', 'Will run this many LMC maps each zone until zone 60.', 'value', 0, null, 'Maps');
    createSetting('Pre60LSC', 'Pre60 LSC', 'Will run this many LSC maps each zone until zone 60.', 'value', 3, null, 'Maps');
    createSetting('Pre60LWC', 'Pre60 LWC', 'Will run this many LWC maps each zone until zone 60.', 'value', 0, null, 'Maps');
    createSetting('Post60LMC', 'Post60 LMC', 'Will run this many LMC maps each zone (twice on giga zones) past zone 60.', 'value', 5, null, 'Maps');
    createSetting('Post60LSC', 'Post60 LSC', 'Will run this many LSC maps each zone (twice on giga zones) past zone 60.', 'value', 0, null, 'Maps');
    createSetting('Post60LWC', 'Post60 LWC', 'Will run this many LWC maps each zone (twice on giga zones) past zone 60.', 'value', 0, null, 'Maps');

//Spire
    //Line 1
    createSetting('MaxStacksForSpire', 'Max Map Bonus for Spire', 'Get max map bonus before running the Spire.', 'boolean', false, null, 'Spire'); //Does farm before spire not cover this fairly well anyway? grabbing +1 equips would make way more difference anyway
    createSetting('MinutestoFarmBeforeSpire', 'Farm Before Spire', 'Farm level 200/199 maps for X minutes before continuing onto attempting Spire. Set to 0 to disable, or a negative number to farm forever.', 'value', '0', null, 'Spire');
    createSetting('IgnoreSpiresUntil', 'Ignore Spires Until', 'Spire specific settings like end-at-cell are ignored until at least this zone is reached (0 to disable).', 'value', '200', null, 'Spire');
    //createSetting('RunBionicBeforeSpire', 'Run Bionic Before Spire', 'CAUTION:  Runs Bionic Wonderlands and repeatedly farms Bionic VI @ level 200 before attempting Spire, for the purpose of resource farming. Then it attempts the spire. The Minutes-Before-Spire timer runs concurrently to this, and <b>needs</b> to be set. If not set, it will exit without doing any Bionics... You can un-toggle it on the fly. <br><b>NOTE:</b> Turning this on also mandates that Run Unique Maps be on. <br><b>WARNING:</b> These 100 square maps take ~3x longer than normal maps. <br><b>WARNING:</b> If you dont have Bionic Magnet mastery, this will run the 5 pre-requisites and take longer.<br><b>NOTE:</b> In fact, it may not be what you want at all.', 'boolean', false, null, 'Spire'); //OUTDATED!
    createSetting('ExitSpireCell', 'Exit Spire After Cell', 'Exits the Spire early, after completing cell X. example: 40 for Row 4. (use 0 or -1 to disable)', 'value', '-1', null, 'Spire');
    createSetting('ExitSpireCellDailyC2', 'Exit Spire Cell Daily', 'Used during dailies and C2 (use 0 or -1 to disable)', 'value', '-1', null, 'Spire');
    createSetting('PreSpireNurseries', 'Nurseries pre-Spire', 'Set the maximum number of Nurseries to build for Spires. Overrides No Nurseries Until z and Max Nurseries so you can keep them seperate! Will build nurseries before z200 for Spire 1, but only on the zone of Spires 2+ to avoid unnecessary burning. Disable with -1.', 'value', -1, null, 'Spire');    
    createSetting('PreSpireNurseriesStartZone', 'Nurseries pre-Spire Start Zone', 'Zone to start to build nurseries for pre-spire', 'value', '-1', null, 'Spire');
    //Line 2
    createSetting('NurseriesSurvive', 'Auto Nurseries', 'In non-active spires, allow automatic building of nurseries to survive cell 99 if missing health.', 'boolean', true, null, 'Spire');
    createSetting('PRaidSpireMulti', ['Raid Spire Off', 'Raid +5 Active Spires', 'Raid +5 Active Spires -1'], 'Overrides Map Raiding Start. Raid +5 Active Spires: Raid +5 levels for gear in active spires. Raid +5 Active Spires -1: Will also raid 1 spire before the first active spire.', 'multitoggle', 0, null, 'Spire');
    createSetting('StackSpire4', ['Windstack Spire IV: Never','Windstack Spire IV: Dailies', 'Windstack Spire IV: Always'], 'Attempts to maximize windstacks in Spire IV. Recommended you have Raid +5 in Spire enabled when you use this. You also probably want a few more nurseries when using this.', 'multitoggle', 0, null, 'Spire');
    createSetting('Spire3Time', 'Daily Spire 3 Time', 'Dailies only. The maximum time in seconds that we willing to spend in Spire 3. If you find yourself missing stacks in early 400s due to too much damage setting this value higher could help. -1 or 0 to disable.', 'value', '50', '-1', 'Spire');
    createSetting('SpireLWCAmount', 'Spire LWC #', 'In active Spires, will run this many Large Wooden Caches maps before beginning. This is used to afford more nurseries. AT will automatically adjust worker amount in cache maps.', 'value', '0', null, 'Spire');
    createSetting('GASettingSpire', 'Spire GA Timer', 'GA timer for active spires (-1 or 0 to disable).', 'value', '-1', null, 'Spire');

//Combat
    //Subsection1Line1
    createSetting('AutoStance', ['Off', 'Helium Mode', 'Dark Essence Mode', 'Push Mode', 'Hybrid'], 'Combat settings. Helium mode: will attempt to windstack any cell thats worth more than threshold. Be sure to have shield swapping enabled with this! Dark Essence Mode: Buys all damage and uses S stance. Push Mode: Buys all damage and uses D stance. Hybrid: Push in Wind/Ice, DE in Poison (+ice in ice enlightenment).', 'multitoggle', 0, null, 'Combat');
    createSetting('WindStackingPctHe', 'He/Hr% Threshold', 'For use with Helium Mode. Will lower damage for stacking on cells that yield higher than this threshold. Lower threshold -> more stacking. You should set this to about x2-3 times your filler He/Hr percent of total. In % units (type 0.5 for 0.5% He/Hr etc)', 'value', '-1', null, 'Combat');
    createSetting('StackSkip', ['Skip Bleed and Dodge','Stack Bleed', 'Stack Bleed and Dodge'],'Toggles for wind stacking','multitoggle', 0, null, 'Combat');
    createSetting("ForceW", "Force W Zone","Forces W stance on Dailies after this zone", "value",'-1',null,'Combat' );
    createSetting('DelayCoordsForWind', 'Stall Coords For Wind', 'With this on, AS will micromanage Coordination for windstacking. Logic is: Buy all Coords utill *Start No Coord Buy* zone, then stop until Amalgamator amount, then let AS micromanage. Will always buy all coords for active spires, Void Map zone BW Raid and Prestige Raids.', 'boolean', true, null, 'Combat');
    createSetting('DelayWeaponsForWind', 'Stall Weapons For Wind', 'With this on, AS will micromanage Weapon purchases for windstacking. Used to lower damage in the early game.', 'boolean', true, null, 'Combat');
    createSetting('GASetting', 'AT Control GA', 'AT Control GA - Allow AT to control GeneticistAssist timer. Also handles bogged dailies (Recommended). When this is off will use your manually entered Input instead.', 'boolean', true, null, 'Combat');
    createSetting('GASettingManual', 'Manual GA Timer', 'AT Uses the 3rd GeneticistAssist slot. You may enter a value for it here, or in the last GA slot yourself (-1 or 0 to disable).', 'value', '-1', null, 'Combat');
    createSetting('AutoRoboTrimp', 'AutoRoboTrimp', 'Use RoboTrimps ability starting at this level, and every 5 levels thereafter. (set to 0 to disable. default 60.) 60 is a good choice for mostly everybody.', 'value', '60', null, 'Combat');
    createSetting('EmpowerTrimpicide', 'Empower Trimpicide', 'AT will Trimpicide whenever your army is about to die during Empower dailies. In dailies with empower AND bleed/plague, will not trimpicide in high value zones in order to conserve stacks.', 'boolean', true, null, 'Combat');


//Scryer
   /* createSetting('UseScryerStance', 'Enable Scryer Stance', '<b>MASTER BUTTON</b> Activates all other scrying settings, and overrides AutoStance when scryer conditions are met. Leave regular Autostance on while this is active. Scryer gives 2x Resources (Non-Helium/Nullifium) and a chance for Dark Essence. Once this is on, priority for Scryer decisions goes as such:<br>NEVER USE, FORCE USE, OVERKILL, MIN/MAX ZONE<br><br><b>NO OTHER BUTTONS WILL DO ANYTHING IF THIS IS OFF.</b>', 'boolean', true, null, 'Scryer');
    createSetting('ScryerUseWhenOverkill', 'Use When Overkill', 'Overrides the Min/Max zones. Does not override any NEVER settings. Toggles stance when we can Overkill in S, giving us double loot with no speed penalty! <b>NOTE:</b> This being on, and being able to overkill in S will override ALL other settings <u>(Except never use in spire)</u>. This is a boolean logic shortcut that disregards all the other settings including Min and Max Zone. If you ONLY want to use S during Overkill, as a workaround: turn this on and Min zone: to 9999 and everything else off(red). <br><br>This has not been optimised for double overkill, and does not always produce the intended results, if you have problems, it may be worth turning off until it can be adjusted.', 'boolean', true, null, 'Scryer');
    createSetting('ScryerMinZone', 'Min Zone', 'Minimum zone to start using scryer in.(inclusive) Recommend:(60 or 181). Overkill ignores this. This needs to be On & Valid for the <i>MAYBE</i> option on all other Scryer settings to do anything if Overkill is off. Tip: Use 9999 to disable all Non-Overkill, Non-Force, scryer usage.', 'value', '181', null, 'Scryer');
    createSetting('ScryerMaxZone', 'Max Zone', '<b>0 or -1 to disable (Recommended)</b><br>Overkill ignores this. Zone to STOP using scryer at (not inclusive). Turning this ON with a positive number stops <i>MAYBE</i> use of all other Scryer settings.', 'value', '230', null, 'Scryer');
    createSetting('ScryerUseinMaps2', ['Maps: NEVER','Maps: FORCE', 'Maps: MAYBE'], '<b>NEVER</b> means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in Void Maps<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use on Corrupteds to be on after corruption/magma.<br><br>Recommend MAYBE.', 'multitoggle', 2, null, 'Scryer');
    createSetting('ScryerUseinVoidMaps2', ['VoidMaps: NEVER','VoidMaps: FORCE', 'VoidMaps: MAYBE'], '<b>NEVER</b> means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in Void Maps<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use in Maps to be on, as well as use on Corrupteds (if above corruption/magma) to activate.<br><br>Recommend NEVER.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerUseinSpire2', ['Spire: NEVER','Spire: FORCE','Spire: MAYBE'], '<b>NEVER</b> means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in the Spire<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use on Corrupteds to be on for corrupted enemies.<br><br>Recommend NEVER.', 'multitoggle', 0, null, 'Scryer');
    //Line2
    createSetting('ScryerSkipBoss2', ['Boss: NEVER (All Levels)','Boss: NEVER (Above VoidLevel)','Boss: MAYBE'], '<b>NEVER (All Levels)</b> will NEVER use S in cell 100 of the world!!!<br><b>NEVER (Above VoidLevel)</b> will NEVER use S in cell 100 of the world ABOVE the zone that your void maps are set to run at (Maps).<br><b>MAYBE</b> treats the cell no differently to any other, Overkill and Min/Max Scryer is allowed.<br><br>Recommend NEVER (There is little benefit to double NON-HELIUM resources and a small chance of DE).', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerSkipCorrupteds2', ['Corrupted: NEVER', 'Corrupted: FORCE','Corrupted: MAYBE'], '<b>NEVER</b> means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate against Corrupted enemies<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br><b>Magma maps and Corrupted Voidmaps are currently classified as corrupted</b> and NEVER here will override Maps and Voidmaps use of Scryer<br><br>Recommend MAYBE.', 'multitoggle', 2, null, 'Scryer');
    createSetting('ScryerDieZ', 'Die To Use S','<b>-1 to disable.</b><br>Turning this on will switch you back to S even when doing so would kill you. Happens in scenarios where you used Skip Corrupteds that took you into regular Autostance X/H stance, killed the corrupted and reached a non-corrupted enemy that you wish to use S on, but you havent bred yet and you are too low on health to just switch back to S. So you\'d rather die, wait to breed, then use S for the full non-corrupted enemy, to maximize DE. NOTE: Use at your own risk.<br>Use this input to set the minimum zone that scryer activates in (You can use decimal values to specify what cell this setting starts from)' , 'value', 230.60, null, 'Scryer');
    createSetting('ScryUseinPoison', 'Scry in Poison','<b>-1 to disable</b>, any other number (including 0) sets a minimum zone to use S in Poison', 'value', -1, null, 'Scryer');
    createSetting('ScryUseinWind', 'Scry in Wind','<b>-1 to disable</b>, any other number (including 0) sets a minimum zone to use S in Wind', 'value', -1, null, 'Scryer');
    createSetting('ScryUseinIce', 'Scry in Ice','<b>-1 to disable</b>, any other number (including 0) sets a minimum zone to use S in Ice', 'value', -1, null, 'Scryer');
    */


// Dimensional Generator settings:
    createSetting('UseAutoGen', ['Auto Generator OFF', 'Auto Generator ON'], '<b>MASTER BUTTON</b> Dynamically switch generator modes. Required for the following mode management configurations to work. The Dimensional Generator is a building unlocked in The Magma, from z230.', 'multitoggle', 0, null, 'Magma');
    createSetting('FuelFromZ', 'Fuel Start Zone', 'Start fueling from this zone.', 'value', 230, null, 'Magma');
    createSetting('FuelToZ', 'Fuel End Zone', 'Fuel until this zone (including).', 'value', 999, null, 'Magma');
    
    createSetting('FuelUntilAmal', 'Fuel until Amalgamator', 'Continue using Fuel until Fuel End Zone AND Amalgamator Amount are reached.', 'boolean', false, null, 'Magma');
    //createSetting('AutoGenDC', 'Daily: Fuel', 'Always fuel in Dailies', 'boolean', true, null, 'Magma');
    //createSetting('AutoGenC2', 'C2: Fuel', 'Always fuel in C2', 'boolean', true, null, 'Magma');
    
    createSetting('AutoMagmiteSpender2', ['Spend Magmite OFF', 'Spend Magmite (Portal)', 'Spend Magmite Always'], 'Auto Spends any unspent Magmite immediately before portaling. (Or Always, if toggled). Part 1 buys any permanent one-and-done upgrades in order from most expensive to least. Part 2 then analyzes Efficiency vs Capacity for cost/benefit, and buys Efficiency if its BETTER than Capacity. If not, if the PRICE of Capacity is less than the price of Supply, it buys Capacity. If not, it buys Supply. And then it repeats itself until you run out of Magmite and cant buy anymore. For Magma z230+ purposes.', 'multitoggle', 1, null, 'Magma');
    createSetting('ForceEffOnly', 'Force Efficiency Only', 'Will only spend Mi on Efficiency (and perma upgrades)', 'boolean', false, null, 'Magma');
    createSetting('SupplyWall', 'Throttle Supply (or Capacity)', 'Positive number NOT 1 e.g. 2.5: Consider Supply when its cost * 2.5 is < Capacity, instead of immediately when < Cap. Effectively throttles supply for when you don\'t need too many.<br><br>Negative number (-1 is ok) e.g. -2.5: Consider Supply if it costs < Capacity * 2.5, buy more supplys! Effectively throttling capacity instead.<br><br><b>Set to 1: DISABLE SUPPLY only spend magmite on Efficiency, Capacity and Overclocker. (For some end game players, supply is worth probably figuratively nothing.)<br>Set to 0: IGNORE SETTING and use old behaviour (will still try to buy overclocker)</b>', 'valueNegative', 2, null, 'Magma');
    createSetting('BuyOneTimeOC', ['Buy OneTime Only (No OC)', 'Maybe Buy OneTime & OC', 'Maybe Buy OneTime (No OC)', 'Buy OneTime & OC Only'], 'Buy OneTime Only (No OC) = ONLY BUYS ONE TIME UPGRADES, NOTHING ELSE. <br>Maybe Buy OneTime & OC = Normal spending, will consider Overclocker and One Time Upgrades<br>Maybe Buy OneTime (No OC) = Normal Spending, but will NOT Buy Overclocker (Will still buy the first level if you don\'t have it).<br>Buy OneTime & OC Only = Will Force spend magmite on these two only, ignoring Efficiency, Capacity and Supply. <br> Recommend Default (Maybe Buy OneTime & OC)', 'multitoggle', 1, null, 'Magma');
    createSetting('MagmiteExplain', 'Magmite spending behaviour', '1. Buy one-and-done upgrades, expensive first, then consider 1st level of Overclocker;<br>2. Buy Overclocker IF AND ONLY IF we can afford it;<br>2.5. Exit if OneTimeOnly<br>3. Buy Efficiency if it is better than capacity;<br>4. Buy Capacity or Supply depending on which is cheaper, or based on SupplyWall', 'infoclick', 'MagmiteExplain', null, 'Magma');





//Heirloom Settings
    //createSetting('AutoHeirloomsNew', ['AutoHeirlooms Off', 'AutoHeirlooms 1', 'AutoHeirlooms 2'], 'Use Autoheirlooms 2. It will keep heirlooms on portal. ', 'multitoggle', 0, null, 'Heirlooms');
    createSetting('AutoHeirlooms', 'Auto Heirlooms', 'Toggles AT handling of heirlooms.', 'boolean', true, null, 'Heirlooms');
    //createSetting('AutoUpgradeHeirlooms', 'Auto Upgrade Heirlooms', 'Automatically buys the upgrades the script advises for the Equipped shield and staff, until we are out of nullifium.', 'boolean', false, null, 'Heirlooms');
    //createSetting('dontCarryJunkHeirlooms', 'Dont Carry Extra Heirlooms', 'Will carry/not carry extra heirlooms in bags. Useful for maximizing available Nu. Green = do not carry. Red = carry.', 'boolean', true, null, 'Heirlooms');
    createSetting('HeirloomSwapping', 'Heirloom Swapping', 'Enables heirloom swapping (Endgame only feature). You need a 5/5 shield and a 2/5 shield that has exactly Plaguebringer and Void Maps and no damage mods. With this enabled the script will juggle between them for optimal windstacking. Your no-damage shield should prioritize Plaguebringer and your high-damage shield should prioritize Void Map Drop. You can force the script to use specific shields as your good/low shield by naming them ' + highShieldName + ' and ' + lowShieldName, 'boolean', false, null, 'Heirlooms');
    createSetting('HeirloomEvalNew', 'Use Plagued Evaluation', 'For Plagued items, what matters is what affixes they have and empty slots. This setting also auto protects any heirloom that survives a portal. Use this when you already have Plagued items.', 'boolean', false, null, 'Heirlooms');
    
    createSetting('HeirloomMetalStaves', 'Keep Staves', 'Will hold onto any Plagued staff capable of having metal drop + miner eff + fragment drop + explorer eff + fluffy. Used as main staff.', 'boolean', true, null, 'Heirlooms');
    createSetting('HeirloomWoodStaves', 'Keep Wood Staves', 'Will hold onto any Plagued staff capable of having lumberjack eff + miner eff + fragment drop + explorer eff + fluffy. Used as main staff for more wood for nurseries. Mostly useful for Spire V alongside the Spire LWC option.', 'boolean', false, null, 'Heirlooms');
    createSetting('HeirloomHighShield', 'Keep 5/5 Shields', 'Will hold onto any Plagued shield capable of having crit chance + crit damage + attack + Plaguebringer + VMDC. Used as main shield.', 'boolean', true, null, 'Heirlooms');
    createSetting('HeirloomLowShield', 'Keep 2/5 Shields', 'Will hold onto any Plagued shield capable of having Plaguebringer+VMDC and no damage mods. Used for shield swaps for windstacking.', 'boolean', true, null, 'Heirlooms');
    createSetting('HeirloomPushShield', 'Keep Push Shields', 'Will hold onto any Plagued shield capable of having crit chance + crit damage + attack + Plaguebringer + health. Used as a push shield for spire/C2s/HZE.', 'boolean', true, null, 'Heirlooms');
    createSetting('HeirloomHighPushShield', 'Keep High & Push', 'Will hold onto any Plagued shield capable of becoming either a 5/5 shield or a push shield. For example crit chance + crit damage + attack and 2 empty mods.', 'boolean', true, null, 'Heirlooms');
    

//Golden Upgrade
    createSetting('AutoGoldenUpgrades', 'Auto', 'Off - Does nothing. All other choices will max Void if the relevant button is pressed, and buy battle in C2.<br>Match Perks - will sometime get a battle GU when the inferred Helium/Attack ratio from active perks drops below the value of a Battle GU compared to an extra Helium one. You can turn on Golden Upgrade Spam under Display to see the numbers in action.', 'dropdown', 'Helium', ["Off", "Helium", "Battle", "Match Perks"], 'Golden');
    createSetting('MaxVoid',        'Max Void', 'Always get 72% Void In Filler.' ,'boolean', true, null, 'Golden');
    createSetting('MaxVoidDaily',        'Max Void Daily', 'Always get 72% Void in Daily.' ,'boolean', true, null, 'Golden');
    createSetting('MaxVoidC2',   'Max Void C2', 'Always get 72% Void In C2.'     ,'boolean', true, null, 'Golden');
    createSetting('BattleSwitchZone','Battle GU Switch Zone', 'Zone to switch to buying battle GU over Helium GU','value',-1,null,'Golden');

// Nature settings:
    createSetting('AutoNatureTokens', 'Spend Nature Tokens', '<b>MASTER BUTTON</b> Automatically spend or convert nature tokens.', 'boolean', false, null, 'Nature');
    createSetting('AutoPoison', 'Poison', 'Spend/convert Poison tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Wind', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoWind', 'Wind', 'Spend/convert Wind tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoIce', 'Ice', 'Spend/convert Ice tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Wind', 'Convert to Both'], 'Nature');
    createSetting('TokenReserve', 'Reserved Tokens','Amount of nature tokens to keep in reserve that AT will not spend.', 'value',0,null,'Nature');
    if (!game.worldUnlocks.easterEgg.locked) {
    createSetting('AutoEggs', 'AutoEggs', 'Click easter egg if it exists, upon entering a new zone. Warning: Quite overpowered. Please solemnly swear that you are up to no good.', 'boolean', false, null, 'Core');}
    


//Display settings:
    //Subsection1Line1
    createSetting('PauseMsgsVisible', 'Pause Warning', 'Toggle whether to show the big pause message', 'boolean', true, null, 'Display');
    createSetting('EnhanceGrids', 'Enhance Grids', 'Apply slight visual enhancements to world and map grids that highlights with drop shadow all the exotic, powerful, skeletimps and other special imps.', 'boolean', false, null, 'Display');
    createSetting('EnableAFK', 'Go AFK Mode', '(Action Button). Go AFK uses a Black Screen, and suspends ALL the Trimps GUI visual update functions (updateLabels) to improve performance by not doing unnecessary stuff. This feature is primarily just a CPU and RAM saving mode. Everything will resume when you come back and press the Back button. Console debug output is also disabled. The blue color means this is not a settable setting, just a button. You can now also click the Zone # (World Info) area to go AFK now.', 'action', 'MODULES["performance"].EnableAFKMode()', null, 'Display');
    document.getElementById('battleSideTitle').setAttribute('onclick','MODULES["performance"].EnableAFKMode()');
    document.getElementById('battleSideTitle').setAttribute('onmouseover', "getZoneStats(event);this.style.cursor='pointer'");
    createSetting('ForceUpdateGraph', 'Live Graph', 'When the graph window is open, it will update on every cell.', 'boolean', false, null, 'Display');
    createSetting('ChangeLog', 'Show Changelog', '(Action Button). Shows the changelog popup message that AT loads on startup again, in case you missed it. The blue color means this is not a settable setting, just a button.', 'action', 'printChangelog()', null, 'Display');
    createSetting('C2Table', 'Show C2 Table', '(Action Button). Shows the C2 table on click','action', "ImportExportTooltip('C2 Table')", null, 'Display');
    createSetting('ShowSettings', 'Show Extra Settings', 'Show/Hide settings that in my personal opinion, are rarely useful (HZE 470)', 'boolean', true, null, 'Display');
    //createSetting('MaxGraphs', 'Max Graphs', 'Maximum graphs to save. Default is 15, however 15 becomes too much when each run has more than 600 zones so adjust this value every time saving breaks', 'value', 15,null,'Display');
    document.getElementById('Display').lastChild.insertAdjacentHTML('afterend','<br>');

//SPAM settings:
    //Subsection2Line1
    //createSetting('SpamGeneral', 'General Spam', 'General Spam = Notification Messages, Auto He/Hr', 'boolean', true, null, 'Display');
    createSetting('SpamWind', 'Wind Spam', 'Wind Spam = wind spam during wind zones', 'boolean', true, null, 'Display');
    createSetting('SpamUpgrades', 'Upgrades Spam', 'Upgrades Spam', 'boolean', true, null, 'Display');
    createSetting('SpamEquipment', 'Equipment Spam', 'Equipment Spam', 'boolean', true, null, 'Display');
    createSetting('SpamMaps', 'Maps Spam', 'Maps Spam = Buy,Pick,Run Maps,Recycle,CantAfford', 'boolean', true, null, 'Display');
    createSetting('SpamHeirlooms', 'Heirlooms Spam', 'Heirlooms Spam = cant carry any more heirlooms', 'boolean', true, null, 'Display');
    createSetting('SpamTrimpicide', 'Trimpicide Spam', 'Trimpicide Spam = Where Trimps go to die', 'boolean', true, null, 'Display');
    createSetting('SpamAmal', 'Amal Spam', 'Skipping cooordination to preserve Amalgamator! spam', 'boolean', true, null, 'Display');
    createSetting('SpamBuilding', 'Building Spam', 'Building Spam = all buildings, even storage', 'boolean', false, null, 'Display');
    createSetting('SpamJobs', 'Job Spam', 'Job Spam = All jobs, in scientific notation', 'boolean', false, null, 'Display');
    //Line2
    //createSetting('SpamGraphs', 'Starting Zone Spam', 'Disables \'Starting new Zone ###\' , RoboTrimp MagnetoShreik, and any future Graph Spam that comes from graph logs.', 'boolean', true, null, 'Display');
    createSetting('SpamMagmite', 'Magmite/Magma Spam', 'Everything in Magmite Module and Buy Magmamancers', 'boolean', true, null, 'Display');
    createSetting('SpamGU', 'Golden Upgrade Spam', 'Helium / Attack Perk Ratio spam.', 'boolean', true, null, 'Display');
    createSetting('SpamPerks', 'AutoPerks Spam', 'Everything in related to AutoPerks', 'boolean', true, null, 'Display');



// Export/Import/Default settings
    createSetting('ImportAutoTrimps', 'Import AutoTrimps', 'Import your AutoTrimps Settings. Asks you to name it as a profile afterwards.', 'infoclick', 'ImportAutoTrimps', null, 'Import Export');
    createSetting('ExportAutoTrimps', 'Export AutoTrimps', 'Export your AutoTrimps Settings as a output string text formatted in JSON.', 'infoclick', 'ExportAutoTrimps', null, 'Import Export');
    createSetting('DefaultAutoTrimps', 'Reset to Default', 'Reset everything to the way it was when you first installed the script. ', 'infoclick', 'ResetDefaultSettingsProfiles', null, 'Import Export');
    createSetting('CleanupAutoTrimps', 'Cleanup Saved Settings ', 'Deletes old values from previous versions of the script from your AutoTrimps Settings file.', 'infoclick', 'CleanupAutoTrimps', null, 'Import Export');
    //createSetting('allowSettingsUpload', 'Allow Analytics Upload', 'Uploads your AUTOTRIMPS saved settings files (the same as Export AutoTrimps on this tab) <b>anonymously</b> - to https://autotrimps.site = the official Autotrimps development server. It will remain private for now, and aggregated for analytics to improve the script in the future and see which features are being used. Please Opt in. The upload will be approximately a small 5-10KB uncompressed text file every time the script is LOADED (for the time being until it is refined), and there is no concern for any personal data leak or privacy concern. This is all in good faith, and you are welcome to check the open source file modules/client-server.js. In the future, I will have to make a more fine-grained data-usage privacy-policy. Possible other data collected in the near-future may include certain game stats such as your highest zone, helium amount, bones, resource/magma/DE amounts, perk ratio selections. ', 'boolean', false, null, 'Import Export');
    settingsProfileMakeGUI();   //Settings Profile dropdown and Delete button. (this always shows up first - can be here last)
    //createSetting('ExportModuleVars', 'Export Custom Variables', 'Export your custom MODULES variables.', 'infoclick', 'ExportModuleVars', null, 'Import Export');
    //createSetting('ImportModuleVars', 'Import Custom Variables', 'Import your custom MODULES variables (and save).', 'infoclick', 'ImportModuleVars', null, 'Import Export');
    //createSetting('ResetModuleVars', 'Reset Custom Variables', 'Reset(Delete) your custom MODULES variables, and return the script to normal. ', 'infoclick', 'ResetModuleVars', null, 'Import Export');

    //createSetting('PlayerLevel', 'PlayerLevel', 'PlayerLevel: Indicate around what level you are. noob, low, medium, high, spire, magma, expert, z450+, z500+, endgame and so on. Might be used to control which settings are visible in the future. ', 'dropdown', "Medium", ["Noob","Low","Medium","High","Spire","Magma","Expert","z450+","z500+","EndGame"], 'Display');

}
initializeAllSettings(); //EXECUTE

//Universal function that creates sets up the Settings database, structures and associated graphic elements

function createSetting(id, name, description, type, defaultValue, list, container) {
    var btnParent = document.createElement("DIV");
    // btnParent.setAttribute('class', 'optionContainer');
    btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 1vw; margin-bottom: 1vw; width: 13.142vw;');
    var btn = document.createElement("DIV");
    btn.id = id;
    var loaded = autoTrimpSettings[id];
    if (type == 'boolean') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                enabled: loaded === undefined ? (defaultValue || false) : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].enabled);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'value' || type == 'valueNegative') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '",'+`${(type == 'valueNegative')}`+')');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'dropdown') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                selected: loaded === undefined ? defaultValue : loaded,
                list: list
            };
        //make sure the saved selected dropdown option actually exists
        if(autoTrimpSettings[id].list.indexOf(autoTrimpSettings[id].selected) == -1)
            autoTrimpSettings[id].selected = defaultValue;
        if(autoTrimpSettings[id].list.indexOf(autoTrimpSettings[id].selected) == -1){
            debug("autoTrimpSettings["+id+"] value " +autoTrimpSettings[id].selected+ " unrecognized");
            debug("defaulting to first choice, " + autoTrimpSettings[id].list[0] + "!");
            autoTrimpSettings[id].selected = autoTrimpSettings[id].list[0];
        }
        var btn = document.createElement("select");
        btn.id = id;
        if (game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8; font-size: 1.0vw;");
        else btn.setAttribute("style", "color:black; font-size: 1.0vw;");
        btn.setAttribute("class", "noselect");
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("onchange", 'settingChanged("' + id + '")');

        for (var item in list) {
            var option = document.createElement("option");
            option.value = list[item];
            option.text = list[item];
            btn.appendChild(option);
        }
        btn.value = autoTrimpSettings[id].selected;

        var dropdownLabel = document.createElement("Label");
        dropdownLabel.id = id + "Label";
        dropdownLabel.innerHTML = name + ":";
        dropdownLabel.setAttribute('style', 'margin-right: 0.3vw; font-size: 0.8vw;');
        btnParent.appendChild(dropdownLabel);
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'infoclick') {
        btn.setAttribute('class', 'btn btn-info');
        btn.setAttribute("onclick", 'ImportExportTooltip(\'' + defaultValue + '\', \'update\')');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("style", "display: block; font-size: 0.8vw;");
        btn.textContent = name;
        btnParent.style.width = '';
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return; //return means don't store it in autoTrimpSettings at the bottom
    } else if (type == 'multitoggle') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue || 0 : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].value);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name.join(' / ') + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = autoTrimpSettings[id]["name"][autoTrimpSettings[id]["value"]];
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    }
    else if(type === 'action')
    {
        //We're not storing the state on these.
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn3');  //color 3 is teal.
        btn.setAttribute('onclick', defaultValue);
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return; //return means don't store it in autoTrimpSettings at the bottom
    }

    //make sure names/descriptions match what we have stored.
    if (autoTrimpSettings[id].name != name)
        autoTrimpSettings[id].name = name;
    if (autoTrimpSettings[id].description != description)
        autoTrimpSettings[id].description = description;
    autoTrimpSettings["ATversion"] = ATversion;
}

//makes labeled checkboxes.
function createInput(id, name, description) {
    var $btnParent = document.createElement("DIV");
    $btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 0.5vw; margin-bottom: 0.5vw; width: 6.5vw;');
    $btnParent.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
    $btnParent.setAttribute("onmouseout", 'tooltip("hide")');
    var $input = document.createElement("input");
    $input.type = 'checkbox';
    $input.setAttribute('id', id);
    $input.setAttribute('style', 'text-align: left; width: 0.8vw; ');
    //$input.setAttribute('onkeypress', 'isValidKey2(this,event)');
    $btnParent.appendChild($input);
    var $label = document.createElement("label");
    $label.setAttribute('style', 'text-align: left; margin-left: 0.2vw; font-size: 0.6vw');
    $label.innerHTML = name;
    $btnParent.appendChild($label);
    document.getElementById("autoSettings").appendChild($btnParent);
}

//Default Toggler handler for any setting of the 3 special types (boolean, multitoggle, dropdown, and handle PrestigeBackup) - not value type.
function settingChanged(id) {
    var btn = autoTrimpSettings[id];
    if (btn.type == 'boolean') {
        btn.enabled = !btn.enabled;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    }
    if (btn.type == 'multitoggle') {
        //puts a 5 second pause in between cycling through from "on portal" to "always" so you can switch it to "off".
        if (id == 'AutoMagmiteSpender2' && btn.value == 1) {
            magmiteSpenderChanged = true;
            setTimeout(function() {
                magmiteSpenderChanged = false;
            }, 5000);
        }
        btn.value++;
        if (btn.value > btn.name.length - 1)
            btn.value = 0;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        document.getElementById(id).textContent = btn.name[btn.value];
    }
    if (btn.type == 'dropdown') {
        btn.selected = document.getElementById(id).value;
        //part of the prestige dropdown's "backup" system to prevent internal tampering via the dynamic prestige algorithm. everytime we see a user initiated change, make a backup.
        //if (id == "Prestige")
        //    autoTrimpSettings["PrestigeBackup"].selected = document.getElementById(id).value;
    }
    //console.log(id + " Setting Changed");
    updateCustomButtons();
    saveSettings();
    checkPortalSettings();
    //if ((autoTrimpSettings.AutoGen2.value == 3) && game.generatorUpgrades["Overclocker"].upgrades <= 0)
    //    tooltip('confirm', null, 'update', 'WARNING: You are set to Overclock but do not have any Overclocker upgrades. AutoGen2 will default to \'Max Cap\' in this case. If this is not desired, please fix your AutoGen2 setting.', 'cancelTooltip()', 'Cannot Overclock');
}

//Popup Tooltip - ask them to enter some numerical input. (STANDARDIZED)
function autoSetValueToolTip(id, text,negative) {   
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type a number below. You can also use shorthand such as 2e5 or 200k.';
    if (negative)
        tooltipText += 'Accepts negative numbers as validated inputs.';
    else
        tooltipText += 'Put -1 for Infinite.';
    tooltipText += '<br/><br/><input id="customNumberBox" style="width: 50%" onkeypress="onKeyPressSetting(event, \'' + id + '\','+negative+')" value=' + autoTrimpSettings[id].value + '></input>';
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetValue(\'' + id + '\','+negative+')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = ranstring + ':  Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customNumberBox');
    try {
        box.setSelectionRange(0, box.value.length);
    } catch (e) {
        box.select();
    }
    box.focus();
}
//Keyboard handler - Enter Key accepts popup
function onKeyPressSetting(event, id,negative) {
    if (event.which == 13 || event.keyCode == 13) {
        autoSetValue(id,negative);
    }
}
//Custom Number Box - Suffix handler for numerical to string values in the prompted popup
function autoSetValue(id,negative) {
    var num = 0;
    unlockTooltip();
    tooltip('hide');
    var numBox = document.getElementById('customNumberBox');
    if (numBox) {
        num = numBox.value.toLowerCase();
        if (num.split('e')[1]) {
            num = num.split('e');
            num = Math.floor(parseFloat(num[0]) * (Math.pow(10, parseInt(num[1]))));
        } else {
            var letters = num.replace(/[^a-z]/gi, '');
            var base = 0;
            if (letters.length) {
                var suffices = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'];
                for (var x = 0; x < suffices.length; x++) {
                    if (suffices[x].toLowerCase() == letters) {
                        base = x + 1;
                        break;
                    }
                }
                if (base) num = Math.round(parseFloat(num.split(letters)[0]) * Math.pow(1000, base));
            }
            if (!base) num = parseFloat(num);
        }
    } else return;
    autoTrimpSettings[id].value = num;
    if (num > -1 || negative)
        document.getElementById(id).textContent = ranstring + ': ' + prettify(num);
    else
        document.getElementById(id).innerHTML = ranstring + ': ' + "<span class='icomoon icon-infinity'></span>";
    saveSettings();
    checkPortalSettings();
}

//toggles the display of the settings menu. 1
function autoToggle(what){
    if (what){
        var $what = document.getElementById(what);
        if ($what.style.display === 'block') {
            $what.style.display = 'none';
            document.getElementById(what + 'BTN').style.border = '';
        } else {
            $what.style.display = 'block';
            document.getElementById(what + 'BTN').style.border = '4px solid green';
        }
    }
    else{
        if (game.options.displayed)
            toggleSettingsMenu();
        var $item = document.getElementById('graphParent');
        if ($item.style.display === 'block')
            $item.style.display = 'none';
        var $item = document.getElementById('autoTrimpsTabBarMenu');
        if ($item.style.display === 'block')
            $item.style.display = 'none';
        else $item.style.display = 'block';
        var $item = document.getElementById('autoSettings');
        if ($item.style.display === 'block')
            $item.style.display = 'none';
        else $item.style.display = 'block';
    }
}

//toggles the display of the original settings menu button,
// when clicked, hiding the AT settings and graph.
function autoPlusSettingsMenu() {
    var $item = document.getElementById('autoSettings');
    if ($item.style.display === 'block')
        $item.style.display = 'none';
    var $item = document.getElementById('graphParent');
    if ($item.style.display === 'block')
        $item.style.display = 'none';
    var $item = document.getElementById('autoTrimpsTabBarMenu');
    if ($item.style.display === 'block')
        $item.style.display = 'none';
    toggleSettingsMenu();
}

//Responsible for keeping the GUI in sync with the settings database and
// force-controlling the values of some and changing its visible or hidden status

function updateCustomButtons() {
    //console.log("GUI: CustomButtons Updated");
    if (lastTheme && game.options.menu.darkTheme.enabled != lastTheme) {
    if (typeof MODULES["graphs"] !== 'undefined')
        MODULES["graphs"].themeChanged();
        debug("Theme change - AutoTrimps styles updated.");
    }
    lastTheme = game.options.menu.darkTheme.enabled;
    function toggleElem(elem, showHide) {
        var $item = document.getElementById(elem);
        if ($item == null) return;
        var state = showHide ? '' : 'none';
        var stateParent = showHide ? 'inline-block' : 'none';
        if($item.style.display !== state)
            $item.style.display = state;
        if($item.parentNode.style.display !== stateParent)
            $item.parentNode.style.display = stateParent;
    }
    function turnOff(elem) {
        toggleElem(elem, false);
    }
    function turnOn(elem) {
        toggleElem(elem, true);
    }
    //automaps button in GUI
    document.getElementById("autoMapBtn").setAttribute("class", "noselect settingsBtn settingBtn" + autoTrimpSettings.AutoMaps.value);
    //auto portal setting, hide until player has unlocked the balance challenge
    (game.challenges.Balance.filter()) ? turnOn("AutoPortal") : turnOff("AutoPortal");
    //auto Daily settings, hide until player has unlocked the Daily challenges
    var doDaily = game.challenges.Daily.filter();
    (doDaily) ? turnOn("AutoStartDaily") : turnOff("AutoStartDaily");
    (doDaily) ? turnOn("AutoFinishDaily") : turnOff("AutoFinishDaily");
    //if custom auto portal is not selected, remove the custom value settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("CustomAutoPortal") : turnOff("CustomAutoPortal");
    //if HeHr is not selected, remove HeliumHourChallenge settingsbox
    var heHr = (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour");
    (heHr || autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("HeliumHourChallenge") : turnOff("HeliumHourChallenge");
    //if HeHr is not selected, remove HeHrDontPortalBefore settingsbox
    (heHr) ? turnOn("HeHrDontPortalBefore") : turnOff("HeHrDontPortalBefore");
    //if HeHr is not selected, remove HeHr buffer settingsbox
    (heHr) ? turnOn("HeliumHrBuffer") : turnOff("HeliumHrBuffer");
    (autoTrimpSettings.AutoPortal.selected == "Off") ? turnOff("AutoFinishDailyNew") : turnOn("AutoFinishDailyNew");
    (autoTrimpSettings.AutoPortal.selected == "Off") ? turnOff("VoidMapsDailyMod")   : turnOn("VoidMapsDailyMod");
    

    getPageSetting('GASetting') ? turnOff("GASettingManual"): turnOn("GASettingManual");
    //getPageSetting('PRaidSetting') ? turnOff("PRaidingZoneStart") : turnOn("PRaidingZoneStart");
    
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomMetalStaves"): turnOff("HeirloomMetalStaves");
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomWoodStaves"): turnOff("HeirloomWoodStaves");
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomHighShield"): turnOff("HeirloomHighShield");
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomLowShield"): turnOff("HeirloomLowShield");
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomPushShield"): turnOff("HeirloomPushShield");
    getPageSetting('HeirloomEvalNew') ? turnOn("HeirloomHighPushShield"): turnOff("HeirloomHighPushShield");
    getPageSetting('AutoStance') == 1 ? turnOn("WindStackingPctHe"): turnOff("WindStackingPctHe");
    getPageSetting('AutoStance') == 1 ? turnOn("StackSkip"): turnOff("StackSkip");
    getPageSetting('AutoStance') == 1 ? turnOn("ForceW"): turnOff("ForceW");
    getPageSetting('AutoStance') == 1 ? turnOn("DelayCoordsForWind"): turnOff("DelayCoordsForWind");
    getPageSetting('AutoStance') == 1 ? turnOn("DelayWeaponsForWind"): turnOff("DelayWeaponsForWind");
    getPageSetting('AutoGoldenUpgrades') == "Helium" ? turnOn('BattleSwitchZone') : turnOff('BattleSwitchZone');
    if(getPageSetting('MoreFarming')){
        turnOn('Pre60LMC');
        turnOn('Pre60LSC');
        turnOn('Pre60LWC');
        turnOn('Post60LMC');
        turnOn('Post60LSC');
        turnOn('Post60LWC');
    }
    else{
        turnOff('Pre60LMC');
        turnOff('Pre60LSC');
        turnOff('Pre60LWC');
        turnOff('Post60LMC');
        turnOff('Post60LSC');
        turnOff('Post60LWC');
    }
    
    //Show and Hide useless settings to reduce UI clutter
    var turnonofflist = [
      "ManualGather2","BuyUpgradesNew","UsePatience",
      "BuyBuildingsNew","WarpstationCap","MaxHut","MaxHouse","MaxMansion","MaxHotel","MaxResort","MaxGateway","MaxWormhole","MaxCollector","MaxTribute","GymWall","FirstGigastation","DeltaGigastation","WarpstationWall3"
      ,"BuyShieldblock",
      "RunBionicBeforeSpire","CorruptionCalc","VoidCheck","TrimpleZ",
      "SupplyWall","BuyOneTimeOC","MagmiteExplain",
      "SpamGeneral","SpamUpgrades","SpamEquipment","SpamMaps","SpamAmal","SpamBuilding","SpamJobs","SpamGraphs","SpamMagmite","SpamPerks",
    ];
    if (game.worldUnlocks.easterEgg)
        turnonofflist.push("AutoEggs");
    for (var i in turnonofflist)
        getPageSetting('ShowSettings') ? turnOn(turnonofflist[i]) : turnOff(turnonofflist[i]);

    //DROPDOWNS: updates dropdown selections. (ALL DROPDOWNS REQUIRE THIS BIT TO BE UPDATEY)
    //todo check why this isnt possible to set automatically in the dropdown code.
    document.getElementById('AutoPortal').value = autoTrimpSettings.AutoPortal.selected;
    document.getElementById('HeliumHourChallenge').value = autoTrimpSettings.HeliumHourChallenge.selected;
    document.getElementById('AutoGoldenUpgrades').value = autoTrimpSettings.AutoGoldenUpgrades.selected;
    document.getElementById('AutoPoison').value = autoTrimpSettings.AutoPoison.selected;
    document.getElementById('AutoWind').value = autoTrimpSettings.AutoWind.selected;
    document.getElementById('AutoIce').value = autoTrimpSettings.AutoIce.selected;
    //DerSkagg Mod: Golden Upgrade Settings. (Toggles relevant ones on/off)

    //Bionic Before Spire - Auto turns on ability to run UniqueMaps
    
    //since this is a loop, make sure the Text contents of our buttons are set accurately. (after any setPageSetting)
    for (var setting in autoTrimpSettings) {
        var item = autoTrimpSettings[setting];
        if (item.type == 'value' || item.type == 'valueNegative' || item.type == 'multitoggle') {
            var elem = document.getElementById(item.id);
            if (elem != null) {
                if (item.type == 'multitoggle')
                    elem.textContent = item.name[item.value];
                else if (item.value > -1 || item.type == 'valueNegative')
                    elem.textContent = item.name + ': ' + prettify(item.value);
                else
                    elem.innerHTML = item.name + ': ' + "<span class='icomoon icon-infinity'></span>";
            }
        }
    }
}

//Checks portal related UI settings
function checkPortalSettings() {
    var result = findOutCurrentPortalLevel();
    var portalLevel = result.level;
    var leadCheck = result.lead;
    if (portalLevel == -1)
        return portalLevel;
    var voidmaps = getPageSetting('VoidMaps');
    if (voidmaps >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel, 'cancelTooltip()', 'Void Maps Conflict');
    //if ((leadCheck || game.global.challengeActive == 'Lead') && (voidmaps % 2 == 0 && portalLevel <= 181))
    //    tooltip('confirm', null, 'update', 'WARNING: Voidmaps run during Lead on an Even zone do not receive the 2x Helium Bonus for Odd zones, and are also tougher. You should probably fix this.', 'cancelTooltip()', 'Lead Challenge Void Maps');
    return portalLevel;
}

//Hider's He/Hr Info stats (in world sidebar)
function getDailyHeHrStats() {
    var words = "";
    if (game.global.challengeActive == "Daily") {
        var getPercent = (game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned)));
        getPercent *= 100 + getDailyHeliumValue(countDailyWeight());
        words = "<b>After Daily He/Hr: " + getPercent.toFixed(3) +'%';
    }
    return words;
}

//Part of import-export.js module.
function settingsProfileMakeGUI(){};    //blank on purpose, will be overwritten if necessary.

//controls the button skips 2 of the tri-state automaps button
function toggleAutoMaps(){
  if (getPageSetting('AutoMaps'))
    setPageSetting('AutoMaps',0);
  else
    setPageSetting('AutoMaps',1);
  document.getElementById("autoMapBtn").setAttribute("class", "noselect settingsBtn settingBtn" + autoTrimpSettings.AutoMaps.value);
}
