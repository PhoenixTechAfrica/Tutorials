import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Image, Button, TouchableOpacity, View } from "react-native";
import { Layout, useTheme } from '@ui-kitten/components';

import { ProfilePage, ProposalsPage, WelcomePage } from '../pages';
import { CustomSidebarMenu } from  './CustomSidebarMenu';

export function Navigation({coloScheme}) {
  return(
    <NavigationContainer
      theme={coloScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

function RootNavigator() {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: theme['text-basic-color'],
        activeBackgroundColor: theme['color-primary-transparent-600'],
        inactiveTintColor: theme['text-basic-color'],
        itemStyle: {marginVertical: 5}
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}>
        <Drawer.Screen
          name='ProposalsPage'
          options={{drawerLabel: 'All Proposals'}}
          component={welcomeScreenStack}
        />
        <Drawer.Screen
          name='ProfilePage'
          options={{drawerLabel: 'Profile'}}
          component={profileScreenStack}
        />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  const theme = useTheme();
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return(
    <Layout style={{flexDirection: 'row', backgroundColor: theme['color-primary-default']}} >
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          
          source={{
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png'
          }}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </Layout>
  );
};

function welcomeScreenStack({navigation}) {
  const theme = useTheme();
  return(
    <Stack.Navigator initialRouteName='WelcomePage'>
      <Stack.Screen
        name='WelcomePage'
        component={WelcomePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ProposalsPage'
        component={ProposalsPage}
        options={{
          title: 'Proposals Page',
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: theme['color-primary-default'],
          },
          headerTintColor: theme['text-basic-color'],
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
      />
    </Stack.Navigator>
  );
}

function profileScreenStack({navigation}) {
  const theme = useTheme();
  return(
    <Stack.Navigator initialRouteName='ProfilePage'>
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          title: 'Profile',
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: theme['color-primary-default'],
          },
          headerTintColor: theme['text-basic-color'],
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
      />
    </Stack.Navigator>
  );
}
