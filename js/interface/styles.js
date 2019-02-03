import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'black',
  },
  elevate: {
    elevation: 1,
    marginBottom: 16,
  },
  pickerModal: {
    margin: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'gainsboro',
  },
  preferenceCard: {
    margin: 8,
    borderWidth: 1,
  },
  pullRight: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pickerArrow: {
    margin: 0,
    marginTop: 6,
    marginRight: 8,
  },
});
