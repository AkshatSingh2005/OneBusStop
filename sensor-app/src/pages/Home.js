import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/react';

import { useHistory } from 'react-router-dom';

function Home() {

  const history = useHistory();

  return (

    <IonPage>

      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>ST OneBusStop</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Welcome to ST OneBusStop</h2>

        <IonButton
          expand="block"
          onClick={() => history.push('/features')}
        >
          View Features
        </IonButton>

      </IonContent>

    </IonPage>

  );

}

export default Home;