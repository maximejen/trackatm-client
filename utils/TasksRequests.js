import config from "../constants/Config";
import {AsyncStorage, Platform} from "react-native";

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
        let data = createFormData(elem, idx);
        console.log(data);
    });
};

const createFormData = (item, itemidx) => {
    const formData = new FormData();

    console.log(item);
    if (item.content) {
        item.content.forEach((elem, idx) => {
            formData.append("photo", {
                name: itemidx + '-' + idx,
                type: elem.type,
                uri:
                    Platform.OS === "android" ? elem.uri : elem.uri.replace("file://", "")
            });
        });
    }


    formData.append("checked", item.checked);
    formData.append("comment", item.comment);
    formData.append("imagesForced", item.imageForced);
    formData.append("textInput", item.text);
    formData.append("name", item.key);
    console.log(formData);
    return formData;
};