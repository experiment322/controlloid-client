import React from 'react';
import { Appbar } from 'react-native-paper';
import * as Types from '../../types';

const NavigatorStackHeader = ({ title, onAction }) => (
  <Appbar.Header>
    <Appbar.Action icon="menu" onPress={onAction} />
    <Appbar.Content title={title} />
  </Appbar.Header>
);

NavigatorStackHeader.propTypes = {
  title: Types.string.isRequired,
  onAction: Types.func.isRequired,
};

export default NavigatorStackHeader;
