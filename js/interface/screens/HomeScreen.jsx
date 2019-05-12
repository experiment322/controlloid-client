import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Styles from '../styles';

const HomeScreen = () => (
  <Surface style={Styles.screen}>
    <ScrollView>
      <Text>
        {
          '\nWelcome to the beta version of Controlloid!\n\n\n'
          + 'This application allows you to use your phone as a real controller:\n\n'
          + '1. Go to Layouts screen to create, edit and star a layout.\n'
          + '(you can drag around and resize the controls)\n\n'
          + '2. Start the server on your PC and make sure that the phone and '
          + 'the computer are on the same network for optimal performance.\n'
          + '(through WiFi or USB tethering)\n\n'
          + '3. Go to Controller screen, write the IP address of your PC and press CONNECT.\n'
          + '(be sure to begin the address with http://)\n\n'
          + '4. To change the theme or tweak the controls go to Preferences screen.\n\n'
          + '5. Done!\n\n\n'
          + 'Visit the following link to download the server application:'
        }
      </Text>
      <Text
        style={{ color: '#3366BB' }}
        onPress={() => Linking.openURL('https://github.com/experiment322/controlloid-server')}
      >
        {
          '\nhttps://github.com/experiment322/controlloid-server\n'
        }
      </Text>
      <Text>
        {
          '\nTo start the server run:\n'
          + 'Linux: "./dist/linux/start.sh"\n'
          + 'Windows: "./dist/windows/start.bat"\n\n'
        }
      </Text>
    </ScrollView>
  </Surface>
);

export default HomeScreen;
