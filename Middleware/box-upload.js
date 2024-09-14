var BoxSDK = require("box-node-sdk");

var sdk = new BoxSDK({
  clientID: "moacuw2l61qylczvpd5bfawiz2q4ymdy",
  clientSecret: "iP9EsLCYFv4BNZpVyze48wvYKWxQenot",
});

// Create a basic API client, which does not automatically refresh the access token
var client = sdk.getBasicClient("TC8d4oBjMSIxZUeqq2HJPqGO63iZ0fvn");

function clientConnection() {
  client.users
    .get(client.CURRENT_USER_ID)
    .then((user) => console.log("Hello", user.name, "!"))
    .catch((err) => console.log("Got an error!", err));
}

async function uploadFile({
  fileContents,
  user_id,
  doc_name,
  doc_id = null,
  doc_type = "pdf",
  doc_module = "profile",
}) {
  if (doc_id) {
    await client.files.delete(doc_id);
  }

  return await client.files
    .uploadFile(
      "0",
      doc_module + "-" + user_id + "-" + doc_name + "." + doc_type,
      fileContents
    )
    .then(async (file) => {
      console.log(file);
      // return
      const fileId = file.entries[0].id;

      // Get the direct download URL for the file
      let res = await client.files.update(fileId, {
        shared_link: {
          access: "open",
          permissions: {
            can_view: true,
            can_download: true,
            can_edit: true,
          },
        },
      });
      return res;
    })
    .then((downloadURL) => {
      console.log("Direct download URL for file:", downloadURL);
      return downloadURL;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function deleteFile(doc_id) {
  return await client.files
    .delete(doc_id)
    .then(async (file) => {
      return file;
    })
    .catch((err) => {
      console.error(err);
    });
}

function createFolder() {
  client.folders.create("0", "New Folder").then((folder) => {
    console.log(folder);
  });
}
module.exports = { clientConnection, uploadFile, deleteFile };
