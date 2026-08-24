import { StatusBar } from 'expo-status-bar';

import './global.css';
import { RootNavigator } from './src/app/navigation';
import { AppProviders } from './src/app/providers';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}
