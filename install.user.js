// ==UserScript==
// @name         AutoTrimps-EAT-SuperGolwuh
// @version      0.1337
// @namespace    https://github.com/SuperGolwuh/EasyAutoTrimps/
// @updateURL    https://github.com/SuperGolwuh/EasyAutoTrimps/install.user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0, Meowchan, SuperGolwuh
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @connect      *https://github.com/SuperGolwuh/EasyAutoTrimps
// @connect      *trimps.github.io*
// @connect      self
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'EasyAutoTrimps-GW-GolwuhPatch';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://github.com/SuperGolwuh/EasyAutoTrimps/EasyAutoTrimps.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
