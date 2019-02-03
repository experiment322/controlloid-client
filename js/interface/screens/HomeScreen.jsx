import React from 'react';
import { Surface } from 'react-native-paper';
import Styles from '../styles';

// eslint-disable-next-line react/prefer-stateless-function
export default class HomeScreen extends React.Component {
  render() {
    return (
      <Surface style={Styles.screen} />
    );
  }
}
