/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import tw from './src/tailwindcss';
import {
  DownloadFileRequest,
  getDownloadPermissionAndroid,
  rnDownloadFile,
} from './src/file';
import ReactNativeBlobUtil, {FetchBlobResponse} from 'react-native-blob-util';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const imageUrl =
    'https://fastly.picsum.photos/id/814/200/200.jpg?hmac=cpUMsYdlkULqgLonFpQyNS2QBtsSI7vTX1_ew8-lS8A';
  const imageFileName = useMemo(() => {
    return imageUrl.split('/').pop()?.split('?').shift() ?? 'image.jpg';
  }, [imageUrl]);
  const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

  const excelUrl =
    'https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls';

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('?').shift();
  };

  const handleDownloadImage = async () => {
    const request: DownloadFileRequest = {
      url: imageUrl,
      fileName: imageFileName,
      mimeType: 'image/jpg',
    };

    if (Platform.OS === 'android') {
      getDownloadPermissionAndroid().then(async granted => {
        if (granted) {
          await handleDownloadFile(request);
        }
      });
    } else {
      await handleDownloadFile(request);
    }
  };

  const handleDownloadPDF = async () => {
    const request: DownloadFileRequest = {
      url: pdfUrl,
      fileName: getFileName(pdfUrl) ?? 'pdf_file.pdf',
      mimeType: 'application/pdf',
    };

    if (Platform.OS === 'android') {
      getDownloadPermissionAndroid().then(async granted => {
        if (granted) {
          await handleDownloadFile(request);
        }
      });
    } else {
      await handleDownloadFile(request);
    }
  };

  const handleDownloadExcel = async () => {
    const request: DownloadFileRequest = {
      url: excelUrl,
      fileName: getFileName(excelUrl) ?? 'pdf_file.xls',
      mimeType: 'application/vnd.ms-excel',
    };

    if (Platform.OS === 'android') {
      getDownloadPermissionAndroid().then(async granted => {
        if (granted) {
          await handleDownloadFile(request);
        }
      });
    } else {
      await handleDownloadFile(request);
    }
  };

  const handleDownloadFile = async (request: DownloadFileRequest) => {
    const response = await rnDownloadFile(request);
    if (response) {
      if (Platform.OS === 'android') {
        await handleCopyFileToDownloadFolder(request, response);
        response.flush();
      }
      console.log('download file success');
      console.log(response);
    } else {
      console.log('download file failed');
    }
  };

  const handleCopyFileToDownloadFolder = async (
    request: DownloadFileRequest,
    response: FetchBlobResponse,
  ) => {
    if (!response) {
      return;
    }

    const newPath = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: request.fileName,
        mimeType: request.mimeType,
        parentFolder: '',
      },
      'Download',
      response.path(),
    );

    ReactNativeBlobUtil.android.addCompleteDownload({
      title: request.fileName,
      description: 'Download complete',
      mime: request.mimeType ?? '',
      path: newPath,
      showNotification: true,
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TouchableOpacity onPress={handleDownloadImage}>
            <View
              style={tw`m-[8px] py-[8px] bg-primary justify-center items-center rounded-[16px]`}>
              <Text style={tw`text-white font-semibold`}>Download image</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDownloadPDF}>
            <View
              style={tw`m-[8px] py-[8px] bg-primary justify-center items-center rounded-[16px]`}>
              <Text style={tw`text-white font-semibold`}>Download pdf</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDownloadExcel}>
            <View
              style={tw`m-[8px] py-[8px] bg-primary justify-center items-center rounded-[16px]`}>
              <Text style={tw`text-white font-semibold`}>Download excel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
