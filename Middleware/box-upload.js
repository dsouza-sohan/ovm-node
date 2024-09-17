var BoxSDK = require("box-node-sdk");

var sdk = new BoxSDK({
  clientID: "moacuw2l61qylczvpd5bfawiz2q4ymdy",
  clientSecret: "iP9EsLCYFv4BNZpVyze48wvYKWxQenot",
});

// Create a basic API client, which does not automatically refresh the access token
var client = sdk.getBasicClient("jGZr4gjVoSGx3wvIu1ySAanvhego5gud");

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

async function uploadMultipleFile(files) {
  // Define the folder ID where the files will be uploaded
  const folderId = "0";

  // Use Promise.all to handle multiple file uploads concurrently
  const uploadPromises = files.map(async (file) => {
    // Read the file stream or buffer
    const fileStream = file.stream; // Assuming file.stream is a readable stream of the file

    // Upload each file
    return client.files.uploadFile(folderId, file.name, fileStream);
  });

  // Wait for all uploads to complete
  // const uploadResults = await Promise.all(uploadPromises);

  // console.log("All files uploaded successfully:", uploadResults);

  return uploadPromises;
}

async function getDownloadUrls(uploadResults) {
  try {
    // Array to hold the promises for creating shared links
    const linkPromises = uploadResults.map(async (result) => {
      const fileId = result.entries[0].id; // Get the file ID from the upload result

      // Update the file to create a shared link
      const file = await client.files.update(fileId, {
        shared_link: {
          access: "open", // Set access level for the shared link
        },
      });

      // Return the download URL
      return file.shared_link.download_url;
    });

    // Resolve all promises to get download URLs
    const downloadUrls = await Promise.all(linkPromises);

    return downloadUrls;
  } catch (error) {
    console.error("Error getting download URLs:", error);
    throw error;
  }
}

function createFolder() {
  client.folders.create("0", "New Folder").then((folder) => {
    console.log(folder);
  });
}
module.exports = {
  clientConnection,
  uploadFile,
  deleteFile,
  uploadMultipleFile,
  getDownloadUrls,
};
