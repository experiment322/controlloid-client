import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Styles from '../styles';

// eslint-disable-next-line react/prefer-stateless-function
export default class HomeScreen extends React.Component {
  render() {
    return (
      <Surface style={Styles.screen}>
        <ScrollView>
          <Text>
            {
              '\nWelcome to the beta version of Controlloid!\n\n\n'
              + 'This application allows you to use your phone as a real controller:\n\n'
              + '1. Go to Layouts screen to create, edit and star a layout. \n(you can drag around and resize the controls)\n\n'
              + '2. Start the server on your PC and make sure that the phone and the computer are on the same network for optimal performance. \n(through WiFi or USB tethering)\n\n'
              + '3. Go to Controller screen, write the IP address of your PC and press CONNECT. \n(be sure to begin the address with http://)\n\n'
              + '4. To change the theme or tweak the controls go to Preferences screen. \n\n'
              + '5. Done!\n\n\n'
              + 'Visit the link below to download the server application.\n'
              + 'To start the server run: \nLinux: "./dist/linux/start.sh"\nWindows: "./dist/windows/start.ps1"\n\n\n'
            }
          </Text>
          <Text
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL('https://github.com/experiment322/controlloid-server')}
          >
            {'https://github.com/experiment322/controlloid-server\n\n'}
          </Text>
        </ScrollView>
      </Surface>
    );
  }
}
