import { registerRootComponent } from 'expo';

import App from './App';
import { Provider } from 'react-redux';
import Store from './redux/Store';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

function MainApp() {
    return <Provider store={Store}>
        <App />
    </Provider>
}

registerRootComponent(MainApp);
