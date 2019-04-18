import config from "../constants/Config";
import {AsyncStorage, Platform} from "react-native";
import { ImageManipulator } from 'expo';

export const requestOperationDone = async (beginningDate, data) =>{
    //send: operation id et operationTemplate id, date debut, date fin,
    const userToken = await AsyncStorage.getItem('token');
    let id = 1;//TODO: remplacer par le cleaner id
    fetch(config.server_addr + '/api/operation/history/' + id, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'token': userToken
        },
        body: JSON.stringify({
            beginningDate: beginningDate / 1000,
            endingDate: Date.now() / 1000,
            operationId: 1,
            operationTemplateId: 1
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
    historyId = 16;
    console.log(item);
    if (item.content) {
        item.content.forEach((elem, idx) => {

            formData.append("photo", {
                name: itemidx + '-' + idx + '-' +Date.now() + '.png',
                type: elem.type,
                uri:
                    Platform.OS === "android" ? elem.uri : elem.localUri
            });
        });
    }
    console.log(item.text);
    formData.append("checked", item.checked | 0);
    formData.append("comment", item.comment);
    formData.append("imagesForced", item.imageForced | 0);
    formData.append("textInput", item.text);
    formData.append("name", item.key);
    console.log(formData);
    const userToken = await AsyncStorage.getItem('token');

    fetch(config.server_addr + '/api/operation/task/' + historyId,{
        method: 'POST',
        headers: {
            'token': userToken
        },
        body: formData
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log("task : " + responseJson);
        })
        .catch((err) => {
            console.log(err)
        })

    return formData;
};