import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';

import './tailwind.css'

import { IonReactRouter } from '@ionic/react-router';

import { Route, Redirect } from 'react-router-dom';

import { home, grid, analytics } from 'ionicons/icons';

import Home from './pages/Home';
import Features from './pages/Features';
import DataLogger from './pages/DataLogger';


function App() {

  return (

    <IonApp>

      <IonReactRouter>

        <IonTabs>

          {/* MAIN CONTENT */}
          <IonRouterOutlet>

            <Route exact path="/home">
              <Home />
            </Route>

            <Route exact path="/features">
              <Features />
            </Route>

            <Route exact path="/logger">
              <DataLogger />
            </Route>

            <Redirect exact from="/" to="/home" />

          </IonRouterOutlet>


          {/* BOTTOM TAB BAR */}
          <IonTabBar slot="bottom">

            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="features" href="/features">
              <IonIcon icon={grid} />
              <IonLabel>Features</IonLabel>
            </IonTabButton>

            <IonTabButton tab="logger" href="/logger">
              <IonIcon icon={analytics} />
              <IonLabel>Logger</IonLabel>
            </IonTabButton>

          </IonTabBar>


        </IonTabs>

      </IonReactRouter>

    </IonApp>

  );

}

export default App;