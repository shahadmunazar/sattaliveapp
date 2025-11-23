import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainAppNavigator from './src/Common/MainAppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainAppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
