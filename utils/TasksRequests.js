import config from "../constants/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

let currentImage = 0;
let currentData = 0;
let nbImages = 0;
let dataSize = 0;
let operationId;
let navigateGlob = null;
export const requestOperationDone = async (
  beginningDate,
  data,
  job,
  navigate
) => {
  //send: operation id et operationTemplate id, date debut, date fin,
  nbImages = getNbImages(data);
  dataSize = data.length;
  currentImage = 0;
  currentData = 0;
  navigateGlob = navigate;

  const userToken = await AsyncStorage.getItem("token");
  const cleanerId = await AsyncStorage.getItem("cleanerid");

  const body = JSON.stringify({
    beginningDate: beginningDate / 1000,
    endingDate: Date.now() / 1000,
    operationId: job.id,
    operationTemplateId: job.template.id,
    initialDate: job.initialDate,
    tasks: data,
  });

  fetch(config().apiUrl + "/api/operation/history/create/" + cleanerId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: userToken,
    },
    body: body,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson["success"] === "true") {
        operationId = responseJson.historyId;
        responseJson["tasksIds"].map((taskId, index) => {
          if (data[index].content !== null) {
            sendPictures(taskId, userToken, data[index]);
          }
        });
        waitForRequests();
      }
      // console.log(responseJson);
      // sendTasks(data, responseJson.historyId);
    })
    .catch((err) => {
      console.log(err);
    });
};

// const sendTasks = (data, historyId) => {
//     operationId = historyId;
//     data.forEach((elem, idx) => {
//         createFormData(elem, idx, historyId, dataSize);
//     });
//     waitForRequests(historyId);
// };
//
// const createFormData = async (item, itemidx, historyId, dataSize) => {
//     const formData = new FormData();
//     formData.append("checked", item.checked | 0);
//     formData.append("comment", item.comment);
//     formData.append("imagesForced", item.imageForced | 0);
//     formData.append("textInput", item.text);
//     formData.append("name", item.key);
//     formData.append("position", itemidx);
//     const userToken = await AsyncStorage.getItem('token');
//
//     fetch(config().apiUrl + '/api/operation/task/' + historyId, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'multipart/form-data',
//             'token': userToken
//         },
//         body: formData
//     }).then((response) => response.json())
//         .then((responseJson) => {
//             currentData++;
//             if (item.content) {
//                 sendPictures(responseJson.taskId, userToken, item);
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         });
//
//     return formData;
// };

const sendPictures = (taskOperationId, userToken, item) => {
  item.content.forEach((elem, idx) => {
    const formData = new FormData();

    let localUri = elem.uri;
    let filename = Date.now() + localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("image", { uri: localUri, name: filename, type });
    const url =
      config().apiUrl +
      "/api/operation/image/" +
      taskOperationId +
      "?timestamp=" +
      item.date[idx] / 1000 +
      "&version=" +
      config().version;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        token: userToken,
      },
      body: formData,
    })
      .then((response) => currentImage++)
      .catch((err) => {
        console.log(err);
      });
  });
};

function waitForRequests() {
  if (currentImage < nbImages) {
    window.setTimeout(
      waitForRequests,
      100
    ); /* this checks the flag every 100 milliseconds*/
  } else {
    sendMailRequest();
  }
}

const sendMailRequest = async () => {
  const userToken = await AsyncStorage.getItem("token");

  fetch(config().apiUrl + "/api/mail/send/" + operationId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: userToken,
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {})
    .catch((err) => {
      console.log(err);
    });
  navigateGlob("Home", { done: true });
};

const getNbImages = (data) => {
  let nbImages = 0;
  data.forEach((elem) => {
    if (elem.content) nbImages += elem.content.length;
  });
  return nbImages;
};
