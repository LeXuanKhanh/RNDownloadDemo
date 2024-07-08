import {PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';

export type DownloadFileRequest = {
  url: string;
  fileName: string;
  mimeType?: string;
  authorization?: string;
  xAuthorization?: string;
};

export const toggleLoading = (value: boolean) => {
  console.log('show loading: ', value);
};

/// grant permission in android
export const getDownloadPermissionAndroid = async () => {
  try {
    //On android 13+ we dont need to ask for permission
    const androidSDK = await DeviceInfo.getSystemVersion();

    if (Number(androidSDK) >= 13) {
      return true;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  } catch (err) {
    console.log('err', err);
  }
};

export const rnDownloadFile = async (request: DownloadFileRequest) => {
  toggleLoading(true);
  const {fileName, url, authorization, xAuthorization, mimeType} = request;
  // Get the app's cache directory
  const {fs} = RNFetchBlob;
  const cacheDir =
    Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;

  // Generate a unique filename for the downloaded image
  const imagePath = `${cacheDir}/${fileName}`;
  console.log('file path: ', imagePath);

  try {
    const configOptions: any = Platform.select({
      ios: {
        fileCache: false,
        path: imagePath,
        appendExt: fileName.split('.').pop(),
      },
      android: {
        fileCache: false,
        path: imagePath,
        appendExt: fileName.split('.').pop(),
        // addAndroidDownloads: {
        //   // Related to the Android only
        //   useDownloadManager: true,
        //   notification: true,
        //   path: imagePath,
        //   description: 'File',
        // },
      },
    });

    const contentType = mimeType ?? 'application/pdf';
    let headerMap = new Map<string, string>([['Content-Type', contentType]]);
    if (authorization) {
      headerMap.set('Authorization', authorization);
    }
    if (xAuthorization) {
      headerMap.set('x-Authorization', xAuthorization);
    }
    const header = Object.fromEntries(headerMap);

    // {
    //   Authorization: authorization,
    //   'x-Authorization': xAuthorization,
    //   'Content-Type': CONSTANTS.CONTENT_TYPE.PDF,
    // }

    const response = await RNFetchBlob.config(configOptions).fetch(
      'GET',
      url,
      header,
    );

    toggleLoading(false);
    // Return the path to the downloaded file
    return response;
  } catch (error) {
    toggleLoading(false);
    console.error(error);
    return null;
  }
};
