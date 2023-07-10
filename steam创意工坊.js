// ==UserScript==
// @name         steam创意工坊(合集)一键下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  steam创意工坊一键下载，仅支持合集，需配合steamcmd下载
// @author       menkeng
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        unsafeWindow
// @grant        GM_download
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

const getGameId = () => $('div.apphub_OtherSiteInfo.responsive_hidden > a').attr('data-appid');
const getModIds = () => {
    const reg = /https:\/\/steamcommunity.com\/sharedfiles\/filedetails\/\?id=/g;
    const modIds = [];
    $('.collectionItemDetails > a').each((index, element) => {
    const modId = $(element).attr('href').replace(reg, '');
    modIds.push(modId);
    });
    return modIds;
};
const generateDownloadText = (gameId, modIds) => {
    const modIdStr = modIds.map(modId => `+workshop_download_item ${gameId} ${modId}`).join(' ');
    return `@echo off\nsteamcmd +login anonymous ${modIdStr}`;
};
const downloadMods = (gameId, modIds) => {
    const text = generateDownloadText(gameId, modIds);
    const filename = `${document.querySelector('div.workshopItemTitle').textContent.trim()}.bat`; 
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    GM_download({url: url,name: filename});
};
const createDownloadButton = () => {
    const dl = document.createElement('div');
    dl.style.cssText = 'position: fixed; top: 120px; right: 50px; width: 80px; height: 30px; font-size: 16px; font-weight: bold; text-align: center; line-height: 30px; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);';
    dl.innerText = '下载';
    dl.onclick = () => {
    const gameId = getGameId();
    const modIds = getModIds();
    downloadMods(gameId, modIds);
    };
    return dl;
};
$(() => $('body').append(createDownloadButton()));