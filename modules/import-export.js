MODULES["import-export"] = {};

//2018 AutoTrimps - genBTC, copied from SettingsGUI.js
//Create settings profile selection dropdown box in DOM. (import/export section)
var $settingsProfiles;
function settingsProfileMakeGUI() {
    var $settingsProfilesLabel = document.createElement("Label");
    $settingsProfilesLabel.id = 'settingsProfiles Label';
    $settingsProfilesLabel.innerHTML = "Settings Profile: ";
    if (game.options.menu.darkTheme.enabled == 2) $settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; font-size: 0.8vw;");
    else $settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; font-size: 0.8vw;");
    $settingsProfiles = document.createElement("select");
    $settingsProfiles.id = 'settingsProfiles';
    $settingsProfiles.setAttribute('class', 'noselect');
    $settingsProfiles.setAttribute('onchange', 'settingsProfileDropdownHandler()');
    var oldstyle = 'text-align: center; width: 160px; font-size: 1.0vw;';
    if(game.options.menu.darkTheme.enabled != 2) $settingsProfiles.setAttribute("style", oldstyle + " color: black;");
    else $settingsProfiles.setAttribute('style', oldstyle);
    //Create settings profile selection dropdown
    var $settingsProfilesButton = document.createElement("Button");
    $settingsProfilesButton.id = 'settingsProfiles Button';
    $settingsProfilesButton.setAttribute('class', 'btn btn-info');
    $settingsProfilesButton.innerHTML = "&lt;Delete Profile";
    $settingsProfilesButton.setAttribute('style', 'margin-left: 0.5vw; margin-right: 0.5vw; font-size: 0.8vw;');
    $settingsProfilesButton.setAttribute('onclick','onDeleteProfileHandler()');
    //populate with a Default (read default settings):
    var innerhtml = "<option id='customProfileCurrent'>Current</option>";
    //populate with a Default (read default settings):
    innerhtml += "<option id='customProfileDefault'>Reset to Default</option>";
    //Append a 2nd default item named "Save New..." and have it tied to a write function();
    innerhtml += "<option id='customProfileNew'>Save New...</option>";
    //dont forget to populate the rest of it with stored items:
    $settingsProfiles.innerHTML = innerhtml;    
    //Add the $settingsProfiles dropdown to UI
    var $ietab = document.getElementById('Import Export');
    if ($ietab == null) return;
    //Any ERRORs here are caused by incorrect order loading of script and you should reload until its gone.(for now)
    $ietab.insertBefore($settingsProfilesLabel, $ietab.childNodes[1]);
    $ietab.insertBefore($settingsProfiles, $ietab.childNodes[2]);
    $ietab.insertBefore($settingsProfilesButton, $ietab.childNodes[3]);
}   //self-executes at the bottom of the file.

//Populate dropdown menu with list of AT SettingsProfiles
function initializeSettingsProfiles() {
    if ($settingsProfiles == null) return;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    oldpresets.forEach(function(elem){
        //Populate dropdown menu to reflect new name:
        let optionElementReference = new Option(elem.name);
        optionElementReference.id = 'customProfileRead';
        $settingsProfiles.add(optionElementReference);
    });
    $settingsProfiles.selectedIndex = 0;
}

//This switches into the new profile when the dropdown is selected.
//it is the "onchange" handler of the settingsProfiles dropdown
//Asks them do a confirmation check tooltip first. The
function settingsProfileDropdownHandler() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    var id = $settingsProfiles.options[index].id;
    //Current: placeholder.
    if (id == 'customProfileCurrent')
        return;
    cancelTooltip();
//Default: simply calls Reset To Default:
    if (id == 'customProfileDefault')
        //calls a tooltip then resetAutoTrimps() below
        ImportExportTooltip('ResetDefaultSettingsProfiles');
//Save new...: asks a name and saves new profile
    else if (id == 'customProfileNew')
        //calls a tooltip then nameAndSaveNewProfile() below
        ImportExportTooltip('NameSettingsProfiles');
//Reads the existing profile name and switches into it.
    else if (id == 'customProfileRead')
        //calls a tooltip then confirmedSwitchNow() below
        ImportExportTooltip('ReadSettingsProfiles');
    //NOPE.XWait 200ms for everything to reset and then re-select the old index.
    //setTimeout(function(){ settingsProfiles.selectedIndex = index;} ,200);
    return;
}

function confirmedSwitchNow() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    var profname = $settingsProfiles.options[index].text;
    //load the stored profiles from browser
    var loadLastProfiles = JSON.parse(localStorage.getItem('ATSelectedSettingsProfile'));
    if (loadLastProfiles != null) {
        var results = loadLastProfiles.filter(function(elem,i){
            return elem.name == profname;
        });
        if (results.length > 0) {
            resetAutoTrimps(results[0].data,profname);
            debug("Successfully loaded existing profile: " + profname, "profile");
        }
    }
}

//called by ImportExportTooltip('NameSettingsProfiles')
function nameAndSaveNewProfile() {
    //read the name in from tooltip
    try {
        var profname = document.getElementById("setSettingsNameTooltip").value.replace(/[\n\r]/gm, "");
        if (profname == null) {
            debug("Error in naming, the string is empty.", "profile");
            return;
        }
    } catch (err) {
        debug("Error in naming, the string is bad." + err.message, "profile");
        return;
    }
    var profile = {
        name: profname,
        data: JSON.parse(serializeSettings())
    }
    //load the old data in,
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in
    var presetlists = [profile];
    //add the two arrays together, string them, and store them.
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets.concat(presetlists)));
    debug("Successfully created new profile: " + profile.name, "profile");
    ImportExportTooltip('message', 'Successfully created new profile: ' + profile.name);
    //Update dropdown menu to reflect new name:
    let optionElementReference = new Option(profile.name);
    optionElementReference.id = 'customProfileRead';
    if ($settingsProfiles == null) return;
    $settingsProfiles.add(optionElementReference);
    $settingsProfiles.selectedIndex = $settingsProfiles.length-1;
}

//event handler for profile delete button - confirmation check tooltip
function onDeleteProfileHandler() {
    ImportExportTooltip('DeleteSettingsProfiles');  //calls a tooltip then onDeleteProfile() below
}
//Delete Profile runs after.
function onDeleteProfile() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    //Remove the option
    $settingsProfiles.options.remove(index);
    //Stay on the same index (becomes next item) - so we dont have to Toggle into a new profile again and can keep chain deleting.
    $settingsProfiles.selectedIndex = (index > ($settingsProfiles.length-1)) ? $settingsProfiles.length-1 : index;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in. string them, and store them.
    var target = (index-3); //subtract the 3 default choices out
    oldpresets.splice(target, 1);
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets));
    debug("Successfully deleted profile #: " + target, "profile");
}


//Handler for the popup/tooltip window for Import/Export/Default
function ImportExportTooltip(what, event) {
    if (game.global.lockTooltip)
        return;
    var $elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", $elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    var titleText = what;
    if (what == "ExportAutoTrimps") {
        tooltipText = "This is your AUTOTRIMPS save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + serializeSettings() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportAutoTrimps") {
        //runs the loadAutoTrimps() function.
        tooltipText = "Import your AUTOTRIMPS save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadAutoTrimps();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "CleanupAutoTrimps") {
        cleanupAutoTrimps();
        tooltipText = "Autotrimps saved-settings have been attempted to be cleaned up. If anything broke, refreshing will fix it, but check that your settings are correct! (prestige in particular)";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == "ExportModuleVars") {
        tooltipText = "These are your custom Variables. The defaults have not been included, only what you have set... <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + exportModuleVars() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportModuleVars") {
        tooltipText = "Enter your Autotrimps MODULE variable settings to load, and save locally for future use between refreshes:<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); importModuleVars();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "ATModuleLoad") {
        var mods = document.getElementById('ATModuleListDropdown');
        var modnames = "";
        for (script in mods.selectedOptions) {
            var $item = mods.selectedOptions[script];
            if ($item.value != null) {
                ATscriptLoad(modulepath, $item.value);
                //console.log($item.value);
                modnames += $item.value + " ";
            }
        }
        tooltipText = "Autotrimps - Loaded the MODULE .JS File(s): " + modnames;
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == "ResetModuleVars") {
        resetModuleVars();
        tooltipText = "Autotrimps MODULE variable settings have been successfully reset to its defaults!";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == 'MagmiteExplain') {
        tooltipText = "<img src='" + basepath + "mi.png'>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>Thats all the help you get.</div></div>";
    } else if (what == 'C2 Table') { //Courtesy of Zek
        var c2list={Size:{number:1,percent:getIndividualSquaredReward('Size')+'%',zone:game.c2.Size,percentzone:(100*(game.c2.Size/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Slow:{number:2,percent:getIndividualSquaredReward('Slow')+'%',zone:game.c2.Slow,percentzone:(100*(game.c2.Slow/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Watch:{number:3,percent:getIndividualSquaredReward('Watch')+'%',zone:game.c2.Watch,percentzone:(100*(game.c2.Watch/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Discipline:{number:4,percent:getIndividualSquaredReward('Discipline')+'%',zone:game.c2.Discipline,percentzone:(100*(game.c2.Discipline/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Balance:{number:5,percent:getIndividualSquaredReward('Balance')+'%',zone:game.c2.Balance,percentzone:(100*(game.c2.Balance/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Meditate:{number:6,percent:getIndividualSquaredReward('Meditate')+'%',zone:game.c2.Meditate,percentzone:(100*(game.c2.Meditate/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Metal:{number:7,percent:getIndividualSquaredReward('Metal')+'%',zone:game.c2.Metal,percentzone:(100*(game.c2.Metal/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Lead:{number:8,percent:getIndividualSquaredReward('Lead')+'%',zone:game.c2.Lead,percentzone:(100*(game.c2.Lead/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Nom:{number:9,percent:getIndividualSquaredReward('Nom')+'%',zone:game.c2.Nom,percentzone:(100*(game.c2.Nom/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Electricity:{number:10,percent:getIndividualSquaredReward('Electricity')+'%',zone:game.c2.Electricity,percentzone:(100*(game.c2.Electricity/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Toxicity:{number:11,percent:getIndividualSquaredReward('Toxicity')+'%',zone:game.c2.Toxicity,percentzone:(100*(game.c2.Toxicity/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Coordinate:{number:12,percent:getIndividualSquaredReward('Coordinate')+'%',zone:game.c2.Coordinate,percentzone:(100*(game.c2.Coordinate/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Trimp:{number:13,percent:getIndividualSquaredReward('Trimp')+'%',zone:game.c2.Trimp,percentzone:(100*(game.c2.Trimp/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Obliterated:{number:14,percent:getIndividualSquaredReward('Obliterated')+'%',zone:game.c2.Obliterated,percentzone:(100*(game.c2.Obliterated/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Eradicated:{number:15,percent:getIndividualSquaredReward('Eradicated')+'%',zone:game.c2.Eradicated,percentzone:(100*(game.c2.Eradicated/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Mapology:{number:16,percent:getIndividualSquaredReward('Mapology')+'%',zone:game.c2.Mapology,percentzone:(100*(game.c2.Mapology/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0},Trapper:{number:17,percent:getIndividualSquaredReward('Trapper')+'%',zone:game.c2.Trapper,percentzone:(100*(game.c2.Trapper/(game.global.highestLevelCleared+1))).toFixed(2)+'%',color:0}};
        function c2listcolor(){function a(b,c,d){var e=100*(game.c2[b]/(game.global.highestLevelCleared+1));c2list[b].color=e>=c?"LIMEGREEN":e<c&&e>=d?"GOLD":e<d&&1<=e?"#de0000":"DEEPSKYBLUE"}Object.keys(c2list).forEach(function(b){null!=game.c2[b]&&("Coordinate"===b?a(b,45,38):"Trimp"===b?a(b,45,35):"Obliterated"===b?a(b,25,20):"Eradicated"===b?a(b,14,10):"Mapology"===b?a(b,90,80):"Trapper"===b?a(b,85,75):a(b,95,85))})}
        c2listcolor();
        tooltipText = "<table class='bdTableSm table table-striped'><tbody><tr><td>Name</td><td>Difficulty</td><td>%C2</td><td>Zone</td><td>%HZE</td></tr><tr><td>Size</td><td>" + c2list.Size.number + "</td><td>" + c2list.Size.percent + "</td><td>" + c2list.Size.zone + "</td><td bgcolor='black'><font color=" + c2list.Size.color + ">" + c2list.Size.percentzone + "</td></tr><tr><td>Slow</td><td>" + c2list.Slow.number + "</td><td>" + c2list.Slow.percent + "</td><td>" + c2list.Slow.zone + "</td><td bgcolor='black'><font color=" + c2list.Slow.color + ">" + c2list.Slow.percentzone + "</td></tr><tr><td>Watch</td><td>" + c2list.Watch.number + "</td><td>" + c2list.Watch.percent + "</td><td>" + c2list.Watch.zone + "</td><td bgcolor='black'><font color=" + c2list.Watch.color + ">" + c2list.Watch.percentzone + "</td></tr><tr><td>Discipline</td><td>" + c2list.Discipline.number + "</td><td>" + c2list.Discipline.percent + "</td><td>" + c2list.Discipline.zone + "</td><td bgcolor='black'><font color=" + c2list.Discipline.color + ">" + c2list.Discipline.percentzone + "</td></tr><tr><td>Balance</td><td>" + c2list.Balance.number + "</td><td>" + c2list.Balance.percent + "</td><td>" + c2list.Balance.zone + "</td><td bgcolor='black'><font color=" + c2list.Balance.color + ">" + c2list.Balance.percentzone + "</td></tr><tr><td>Meditate</td><td>" + c2list.Meditate.number + "</td><td>" + c2list.Meditate.percent + "</td><td>" + c2list.Meditate.zone + "</td><td bgcolor='black'><font color=" + c2list.Meditate.color + ">" + c2list.Meditate.percentzone + "</td></tr><tr><td>Metal</td><td>" + c2list.Metal.number + "</td><td>" + c2list.Metal.percent + "</td><td>" + c2list.Metal.zone + "</td><td bgcolor='black'><font color=" + c2list.Metal.color + ">" + c2list.Metal.percentzone + "</td></tr><tr><td>Lead</td><td>" + c2list.Lead.number + "</td><td>" + c2list.Lead.percent + "</td><td>" + c2list.Lead.zone + "</td><td bgcolor='black'><font color=" + c2list.Lead.color + ">" + c2list.Lead.percentzone + "</td></tr><tr><td>Nom</td><td>" + c2list.Nom.number + "</td><td>" + c2list.Nom.percent + "</td><td>" + c2list.Nom.zone + "</td><td bgcolor='black'><font color=" + c2list.Nom.color + ">" + c2list.Nom.percentzone + "</td></tr><tr><td>Electricity</td><td>" + c2list.Electricity.number + "</td><td>" + c2list.Electricity.percent + "</td><td>" + c2list.Electricity.zone + "</td><td bgcolor='black'><font color=" + c2list.Electricity.color + ">" + c2list.Electricity.percentzone + "</td></tr><tr><td>Toxicity</td><td>" + c2list.Toxicity.number + "</td><td>" + c2list.Toxicity.percent + "</td><td>" + c2list.Toxicity.zone + "</td><td bgcolor='black'><font color=" + c2list.Toxicity.color + ">" + c2list.Toxicity.percentzone + "</td></tr><tr><td>Coordinate</td><td>" + c2list.Coordinate.number + "</td><td>" + c2list.Coordinate.percent + "</td><td>" + c2list.Coordinate.zone + "</td><td bgcolor='black'><font color=" + c2list.Coordinate.color + ">" + c2list.Coordinate.percentzone + "</td></tr><tr><td>Trimp</td><td>" + c2list.Trimp.number + "</td><td>" + c2list.Trimp.percent + "</td><td>" + c2list.Trimp.zone + "</td><td bgcolor='black'><font color=" + c2list.Trimp.color + ">" + c2list.Trimp.percentzone + "</td></tr><tr><td>Obliterated</td><td>" + c2list.Obliterated.number + "</td><td>" + c2list.Obliterated.percent + "</td><td>" + c2list.Obliterated.zone + "</td><td bgcolor='black'><font color=" + c2list.Obliterated.color + ">" + c2list.Obliterated.percentzone + "</td></tr><tr><td>Eradicated</td><td>" + c2list.Eradicated.number + "</td><td>" + c2list.Eradicated.percent + "</td><td>" + c2list.Eradicated.zone + "</td><td bgcolor='black'><font color=" + c2list.Eradicated.color + ">" + c2list.Eradicated.percentzone + "</td></tr><tr><td>Mapology</td><td>" + c2list.Mapology.number + "</td><td>" + c2list.Mapology.percent + "</td><td>" + c2list.Mapology.zone + "</td><td bgcolor='black'><font color=" + c2list.Mapology.color + ">" + c2list.Mapology.percentzone + "</td></tr><tr><td>Trapper</td><td>" + c2list.Trapper.number + "</td><td>" + c2list.Trapper.percent + "</td><td>" + c2list.Trapper.zone + "</td><td bgcolor='black'><font color=" + c2list.Trapper.color + ">" + c2list.Trapper.percentzone + "</td></tr><tr><td>Total</td><td> </td><td>" + game.global.totalSquaredReward + "%</td><td> </td><td> </td></tr>    </tbody></table>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>Close</div></div>";
    } else if (what == 'ReadSettingsProfiles') {
        //Shows a Question Popup to READ the profile:
        titleText = '<b>Loading New AutoTrimps Profile...</b><p>Current Settings will be lost';
        tooltipText = '<b>NOTICE:</b> Switching to new AutoTrimps settings profile!!!! <br>All current settings <b>WILL</b> be lost after this point. <br>You might want to cancel, to go back and save your existing settings first....';
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); confirmedSwitchNow();'>Confirm and Switch Profiles</div><div style='margin-left: 15%' class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'ResetDefaultSettingsProfiles') {
        //Shows a Question Popup to RESET to DEFAULT the profile:
        titleText = '<b>Loading AutoTrimps Default Profile...</b><p>Current Settings will be lost!';
        tooltipText = '<b>NOTICE:</b> Switching to Default AutoTrimps settings profile!!!! <br>All current settings <b>WILL</b> be lost after this point. <br>You might want to cancel, to go back and save your existing settings first.... <br>This will <b><u>Reset</u></b> the script to factory settings.';
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); resetAutoTrimps(); settingsProfiles.selectedIndex = 1;'>Reset to Default Profile</div><div style='margin-left: 15%' class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'NameSettingsProfiles') {
        //Shows a Question Popup to NAME the profile
        titleText = "Enter New Settings Profile Name";
        tooltipText = "What would you like the name of the Settings Profile to be?<br/><br/><textarea id='setSettingsNameTooltip' style='width: 100%' rows='1'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); nameAndSaveNewProfile();'>Import</div><div class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();document.getElementById(\"settingsProfiles\").selectedIndex=0;'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('setSettingsNameTooltip').focus();
        };
    } else if (what == 'DeleteSettingsProfiles') {
        //Shows a Question Popup to DELETE the profile:
        titleText = "<b>WARNING:</b> Delete Profile???"
        tooltipText = "You are about to delete the <B><U>"+`${settingsProfiles.value}`+"</B></U> settings profile.<br>This will not switch your current settings though. Continue ?<br/>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); onDeleteProfile();'>Delete Profile</div><div style='margin-left: 15%' class='btn btn-info' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'message') {
        titleText = "Generic message";
        tooltipText = event;
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 50%' onclick='cancelTooltip();'>OK</div></div>";
    }
    //Common:
    game.global.lockTooltip = true;
    $elem.style.left = "33.75%";
    $elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = titleText;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    $elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}
//reset autotrimps to defaults (also handles imports)
function resetAutoTrimps(imported,profname) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpSettings');
        //delete,remake,init defaults, recreate everything:
        autoTrimpSettings = imported ? imported : new Object(); //load the import.
        var $settingsRow = document.getElementById("settingsRow");
        $settingsRow.removeChild(document.getElementById("autoSettings"));
        $settingsRow.removeChild(document.getElementById("autoTrimpsTabBarMenu"));
        automationMenuSettingsInit();
        initializeAllTabs();
        initializeAllSettings();
        initializeSettingsProfiles();
        updateCustomButtons();
        saveSettings();
        checkPortalSettings();
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
    if (imported){
        AutoPerks.updateBoxesUI();
        debug("Successfully imported new AT settings...", "profile");
        if (profname)   //pass in existing profile name to use:
            ImportExportTooltip("message", "Successfully Imported Autotrimps Settings File!: " + profname);
        else            //or prompt to create a new name:
            ImportExportTooltip('NameSettingsProfiles');
    } 
    else{
        debug("Successfully reset AT settings to Defaults...", "profile");
        ImportExportTooltip("message", "Autotrimps has been successfully reset to its defaults!");
    }
}

//import autotrimps settings from a textbox
//For importing a new AT Config on the fly and reloading/applying all the settings.
function loadAutoTrimps(){
    //try the import
    try {
        var thestring = document.getElementById("importBox").value.replace(/[\n\r]/gm, "");
        var tmpset = JSON.parse(thestring);
        if (tmpset == null){
            debug("Error importing AT settings, the string is empty.", "profile");
            return;
        }
    } 
    catch (err){
        debug("Error importing AT settings, the string is bad." + err.message, "profile");
        return;
    }
    debug("Importing new AT settings file...", "profile");
    resetAutoTrimps(tmpset);
}

//remove stale values from past autotrimps versions
function cleanupAutoTrimps(){
    for (var setting in autoTrimpSettings){
        var $elem = document.getElementById(autoTrimpSettings[setting].id);
        if ($elem == null)
            delete autoTrimpSettings[setting];
    }
}

//export MODULE variables to a textbox
function exportModuleVars(){
    return JSON.stringify(compareModuleVars());
}

//diff two modules to find the difference;
function compareModuleVars(){
    var diffs = {};
    var mods = Object.keys(MODULES);
    for (var i in mods){
        var mod = mods[i];
        var vars = Object.keys(MODULES[mods[i]]);
        for (var j in vars){
            var vj = vars[j];
            var a = MODULES[mod][vj];
            var b = MODULESdefault[mod][vj];
            if (JSON.stringify(a)!=JSON.stringify(b)){
                if (typeof diffs[mod] === 'undefined')
                    diffs[mod] = {};
                diffs[mod][vj] = a;
            }
        }
    }
    return diffs;
}

//import MODULE variables from a textbox
function importModuleVars(){
    //try the import
    try {
        var thestring = document.getElementById("importBox").value;
        var strarr = thestring.split(/\n/);
        for (var line in strarr){
            var s = strarr[line];
            s = s.substring(0, s.indexOf(';')+1); //cut after the ;
            s = s.replace(/\s/g,'');    //regexp remove ALL(/g) whitespaces(\s)
            eval(s);
            strarr[line] = s;
        }
        var tmpset = compareModuleVars();
    } catch (err) {
        debug("Error importing MODULE vars, the string is bad." + err.message, "profile");
        return;
    }
    localStorage.removeItem('storedMODULES');
    safeSetItems('storedMODULES', JSON.stringify(tmpset));
}

//reset MODULE variables to default, (and/or then import)
function resetModuleVars(imported){
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported){
        localStorage.removeItem('storedMODULES');
        MODULES = JSON.parse(JSON.stringify(MODULESdefault));
        //load everything again, anew
        safeSetItems('storedMODULES', JSON.stringify(storedMODULES));
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}

settingsProfileMakeGUI(); //runs at the bottom now:
initializeSettingsProfiles();   //populate dropdown.