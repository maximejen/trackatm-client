import config from "../constants/Config";
import {AsyncStorage} from "react-native";

export const requestOperationDone = async (beginningDate, data, job) => {
    //send: operation id et operationTemplate id, date debut, date fin,
    const userToken = await AsyncStorage.getItem('token');
    const cleanerId = await AsyncStorage.getItem('cleanerid');
    fetch(config.server_addr + '/api/operation/history/' + cleanerId, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'token': userToken
        },
        body: JSON.stringify({
            beginningDate: beginningDate / 1000,
            endingDate: Date.now() / 1000,
            operationId: job.id,
            operationTemplateId: job.template.id,
            initialDate: job.day
        }),
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            sendTasks(data, responseJson.historyId);
        })
        .catch((err) => {
            console.log(err)
        })
};

const sendTasks = (data, historyId) => {
    data.forEach((elem, idx) => {
        let data = createFormData(elem, idx, historyId);
        console.log(data);
    });
};

const createFormData = async (item, itemidx, historyId) => {
    const formData = new FormData();

    formData.append("checked", item.checked | 0);
    formData.append("comment", item.comment);
    formData.append("imagesForced", item.imageForced | 0);
    formData.append("textInput", item.text);
    formData.append("name", item.key);
    const userToken = await AsyncStorage.getItem('token');

    fetch(config.server_addr + '/api/operation/task/' + historyId, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'token': userToken
        },
        body: formData
    }).then((response) => response.json())
        .then((responseJson) => {
            if (item.content) {
                sendPictures(responseJson.taskId, userToken, item);
            }
        })
        .catch((err) => {
            console.log(err)
        });

    return formData;
};

const sendPictures = (taskOperationId, userToken, item) => {

    item.content.forEach((elem, idx) => {
        const formData = new FormData();

        let localUri = elem.uri;
        let filename = Date.now() + localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('image', {uri: localUri, name: filename, type});

        fetch(config.server_addr + '/api/operation/image/' + taskOperationId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': userToken
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("task : " + responseJson);
            })
            .catch((err) => {
                console.log(err)
            });
    });
};