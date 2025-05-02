const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/drive';

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    // Auth va UI sozlamalari
  });
}

// Kirish va chiqish tugmalari uchun event listenerlar
document.getElementById('authorize_button').onclick = handleAuthClick;
document.getElementById('signout_button').onclick = handleSignoutClick;

// Fayl yuklash
document.getElementById('upload_button').onclick = uploadFile;

// Fayl izlash
document.getElementById('search_input').oninput = searchFiles;

// Papka tanlash
document.getElementById('folder_select').onchange = listFiles;

// Quyidagi funksiyalarni yozing:
// handleAuthClick, handleSignoutClick, uploadFile, listFiles, searchFiles
