import * as React from 'react';
import { Image } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import * as Linking from 'expo-linking';
import { Layout, useTheme } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

export const CustomSidebarMenu = (props) => {
  const profile = useSelector(state => state.profile);

  const theme = useTheme();
  const BASE_PATH =
    '../assets/images';
  const profileImage = '/icon.png';

  return(
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1, paddingTop: 50}}>
        <Image
          source={require(BASE_PATH + profileImage)}
          style={styles.sideMenuProfileIcon}/>

        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
          inactiveTintColor={theme['color-basic-600']}
          label={`DAO BAL: ${profile.daoBalance}`}/>
          <DrawerItem
          inactiveTintColor={theme['color-basic-600']}
          label={`BAL: ${profile.userBalance}`}/>
          <DrawerItem
          inactiveTintColor={theme['color-basic-600']}
          label={`Contributed: ${profile.contributed}`}/>
          <DrawerItem
            activeTintColor={theme['text-basic-color']}
            activeBackgroundColor={theme['color-primary-transparent-600']}
            inactiveTintColor={theme['text-basic-color']}
            label="About Celo"
            onPress={() => Linking.openURL('https://celo.org/')}/>
        </DrawerContentScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100/2,
    alignSelf: 'center'
  }
});
