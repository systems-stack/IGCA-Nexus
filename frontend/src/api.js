/**
 * IGCA Nexus API Client
 * This file handles all communication with the Google Apps Script backend.
 */

// REPLACE with the actual deployed Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwG0nyr3D5LERnwH1aUVQRsZtYrH7MRRu4NAM809O9PfuWRUcg4495WHYOxVwtky3sm/exec';

let bootDataPromise = null;

/**
 * Boots the application by fetching ALL data exactly once.
 * Subsequent calls will simply await this single resolved promise.
 */
export async function fetchBootData(forceRefresh = false) {
  if (!forceRefresh && bootDataPromise) {
    return bootDataPromise;
  }

  bootDataPromise = fetch(`${SCRIPT_URL}?action=getAllData`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(result => {
      if (!result.success) throw new Error(result.error || 'API Error');
      return result.data; // Consists of: updates, directory, formats, systems, hr, stats
    })
    .catch(err => {
      bootDataPromise = null; // reset if it failed so we can retry
      console.error("Boot Fetch Error:", err);
      throw err;
    });

  return bootDataPromise;
}

/**
 * Perform a POST request to GAS
 */
export async function postGasData(action, payload) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    // Invalidate the cache if we updated data
    bootDataPromise = null;

    return result;
  } catch (error) {
    console.error(`Error posting ${action}:`, error);
    throw error;
  }
}

// Specific Extractor Functions - Resolving from the same Boot Payload

export async function getUpdates() {
  const data = await fetchBootData();
  return data.updates || [];
}

export async function getStats() {
  const data = await fetchBootData();
  return data.stats || [];
}

export async function getSystems() {
  const data = await fetchBootData();
  return data.systems || [];
}

export async function getHrLinks() {
  const data = await fetchBootData();
  return data.hr || [];
}

export async function getFormats() {
  const data = await fetchBootData();
  return data.formats || [];
}

export async function getDirectory() {
  const data = await fetchBootData();
  return data.directory || [];
}

export async function getWordDownloadUrl(docUrl) {
  try {
    const url = `${SCRIPT_URL}?action=getWordDownload&docUrl=${encodeURIComponent(docUrl)}`;
    const response = await fetch(url);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.downloadUrl;
  } catch (error) {
    console.error('Error fetching download link', error);
    return null;
  }
}
