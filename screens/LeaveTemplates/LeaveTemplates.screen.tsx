import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { Text, View } from '../../components/Themed';

import { RootDrawerScreenProps } from '../../types';

export default function LeaveTemplates({ navigation }: RootDrawerScreenProps<'Profile'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Templates</Text>
      <Button onPress={() => navigation.goBack()}>Go Back</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
