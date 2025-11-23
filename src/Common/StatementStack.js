// StatementStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StatementTabs from '../Screens/Statement/StatementTabs';

const Stack = createStackNavigator();

const StatementStack = ({ route }) => {
  const { tabIndex } = route.params || { tabIndex: 0 };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Statements">
        {(props) => <StatementTabs {...props} initialTabIndex={tabIndex} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StatementStack;
