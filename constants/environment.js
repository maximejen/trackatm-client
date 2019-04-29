import { Constants } from 'expo';
import { Platform } from 'react-native';
//const localhost = Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://10.0.2.2:4000/';
const ENV = {
    dev: {
        apiUrl: "http://2dea013d.ngrok.io",
    },
    staging: {
        apiUrl: 'https://track-atm.com'
    },
    prod: {
        apiUrl: 'https://track-atm.com'
    },
};
const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else {
        // When publishing to production, change this to `ENV.prod` before running an `expo build`
        return ENV.staging;
    }
};
export default getEnvVars;