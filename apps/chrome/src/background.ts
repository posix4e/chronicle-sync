/// <reference types="chrome"/>

export {}; // Make this a module

chrome.runtime.onInstalled.addListener(() => {
  console.log('Chronicle Sync extension installed');
});
