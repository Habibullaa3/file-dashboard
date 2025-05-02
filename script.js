const CLIENT_ID = '1058913752550-k2pb5llb7va6g0948u4li6b1qfp2nosh.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCztbEtsF-zDHJyJ-02jr4Fa9q7WFNuXxY';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    const authInstance = gapi.auth2.getAuthInstance();
    document.getElementById('authorize_button').onclick = () => authInstance.signIn();
    document.getElementById('signout_button').onclick = () => authInstance.signOut();

    authInstance.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(authInstance.isSignedIn.get());
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signout_button').style.display = 'inline';
    document.getElementById('content').style.display = 'block';
    listFiles();
  } else {
    document.getElementById('authorize_button').style.display = 'inline';
    document.getElementById('signout_button').style.display = 'none';
    document.getElementById('content').style.display = 'none';
  }
}

function listFiles() {
  const folderId = document.getElementById("folder_select").value;
  gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id, name)",
  }).then(function(response) {
    const files = response.result.files;
    const listEl = document.getElementById('file_list');
    listEl.innerHTML = '';
    files.forEach(file => {
      const li = document.createElement('li');
      li.textContent = file.name;
      listEl.appendChild(li);
    });
  });
}

document.getElementById('upload_button').onclick = function () {
  const folderId = document.getElementById("folder_select").value;
  const fileInput = document.getElementById("file_input");
  const file = fileInput.files[0];
  const metadata = {
    name: file.name,
    parents: [folderId]
  };
  const accessToken = gapi.auth.getToken().access_token;
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], {type: "application/json"}));
  form.append("file", file);
  fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: new Headers({ "Authorization": "Bearer " + accessToken }),
    body: form,
  }).then(response => response.json()).then(() => listFiles());
};

document.getElementById('folder_select').onchange = listFiles;
document.getElementById('search_input').oninput = function () {
  const query = this.value.toLowerCase();
  const items = document.querySelectorAll('#file_list li');
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
};
