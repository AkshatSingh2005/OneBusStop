import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton
} from '@ionic/react';

import { useHistory } from 'react-router-dom';

function Features() {

  const history = useHistory();

  return (

    <IonPage>

      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Features</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonCard>

          <IonCardHeader>
            <IonCardTitle>Transport Data Logger</IonCardTitle>
          </IonCardHeader>

          <IonButton
            expand="block"
            onClick={() => history.push('/data-logger')}
          >
            Open Logger
          </IonButton>

        </IonCard>

      </IonContent>

    </IonPage>

  );

}

export default Features;