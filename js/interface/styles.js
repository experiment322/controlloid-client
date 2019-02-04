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
  preferencePickerModal: {
    margin: 32,
    padding: 16,
    borderRadius: 8,
  },
  preferenceCard: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  flatListGrowContent: {
    flexGrow: 1,
  },
  centeredText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
