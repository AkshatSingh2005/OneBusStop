import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/react';
import { IonProgressBar } from "@ionic/react";
import { useState } from 'react';

import {
  startSensorListeners,
  stopSensorListeners
} from '../services/SensorService';

import {
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import { saveCSV } from '../services/CSVService';

import { predictDriver } from '../services/predictionService';


function DataLogger() {

  const [isLogging, setIsLogging] = useState(false);

  const [rows, setRows] = useState([]);

  const [busNumber, setBusNumber] = useState("");

  const [frequency, setFrequency] = useState("max");

  const [prediction, setPrediction] = useState(null);

  const [behaviour, setBehaviour] = useState(null);
const [riskScore, setRiskScore] = useState(null);
const [riskLevel, setRiskLevel] = useState(null);



  // START
  function startLogging() {

    if (!busNumber) {
      alert("Enter bus number");
      return;
    }

    const intervalMs = frequency === "max" ? 0 : parseInt(frequency);
    
    startSensorListeners(async (row) => {

  setRows(prev => [...prev, row]);

  // Call backend prediction
  const result = await predictDriver(row);

if (result) {
  setBehaviour(result.behaviour_class);
  setRiskScore(result.risk_score);
  setRiskLevel(result.risk_level);
}

}, busNumber, intervalMs);

    setIsLogging(true);

  }


  // STOP
  function stopLogging() {

    stopSensorListeners();

    setIsLogging(false);

  }


  // EXPORT
  async function exportCSV() {

    if (rows.length === 0) {

      alert("No data");

      return;
    }

    const filename = await saveCSV(rows, busNumber);

    alert("Saved: " + filename);

  }



  return (

  <IonPage>

    <IonHeader translucent={true}>
    <IonToolbar>
        <IonTitle size="large">Transport Logger</IonTitle>
    </IonToolbar>
    </IonHeader>


    <IonContent fullscreen className="ion-padding">


      {/* STATUS CARD */}

      <IonCard style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>

        <IonCardContent>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>

            <div>

              <h2 style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "600"
              }}>
                {isLogging ? "Recording..." : "Ready"}
              </h2>

              <p style={{ margin: 0, opacity: 0.6 }}>
                {rows.length} data points
              </p>

            </div>


            <IonBadge
              color={isLogging ? "success" : "medium"}
              style={{
                fontSize: "14px",
                padding: "8px 12px"
              }}
            >
              {isLogging ? "LIVE" : "STOPPED"}
            </IonBadge>

          </div>

        </IonCardContent>

      </IonCard>

      <IonCard style={{
  marginTop: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
}}>

  <IonCardHeader>
    <IonCardTitle>Driver Behaviour Monitoring</IonCardTitle>
  </IonCardHeader>

  <IonCardContent>

    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      <div>
        <h2 style={{ margin: 0 }}>
          {behaviour ?? "—"}
        </h2>

        <p style={{ margin: 0, opacity: 0.6 }}>
          Risk Score: {riskScore !== null ? riskScore : "—"} / 100
        </p>
      </div>
      <IonProgressBar
  value={riskScore ? riskScore / 100 : 0}
  color={
    riskLevel === "SAFE"
      ? "success"
      : riskLevel === "MODERATE"
      ? "warning"
      : "danger"
  }
/>

      <IonBadge
        color={
          riskLevel === "SAFE"
            ? "success"
            : riskLevel === "MODERATE"
            ? "warning"
            : riskLevel === "HIGH"
            ? "danger"
            : "medium"
        }
        style={{
          fontSize: "14px",
          padding: "10px 14px"
        }}
      >
        {riskLevel ?? "NO DATA"}
      </IonBadge>

    </div>

  </IonCardContent>
</IonCard>



      {/* BUS INPUT */}

      <IonItem style={{
        marginTop: "20px",
        borderRadius: "12px"
      }}>

        <IonLabel position="stacked">
          Bus Number
        </IonLabel>

        <IonInput
          value={busNumber}
          placeholder="Enter bus number"
          onIonChange={e => setBusNumber(e.detail.value)}
        />

      </IonItem>

      <IonItem>
  <IonLabel>Sampling Frequency</IonLabel>

  <IonSelect
    value={frequency}
    onIonChange={e => setFrequency(e.detail.value)}
  >

    <IonSelectOption value="max">
      Max (fastest)
    </IonSelectOption>

    <IonSelectOption value="500">
      0.5 seconds
    </IonSelectOption>

    <IonSelectOption value="1000">
      1 second
    </IonSelectOption>

  </IonSelect>

</IonItem>



      {/* CONTROL BUTTON */}

      <div style={{ marginTop: "30px" }}>

        {!isLogging ? (

          <IonButton
            expand="block"
            size="large"
            color="success"
            style={{
              height: "55px",
              borderRadius: "14px"
            }}
            onClick={startLogging}
          >
            Start Recording
          </IonButton>

        ) : (

          <IonButton
            expand="block"
            size="large"
            color="danger"
            style={{
              height: "55px",
              borderRadius: "14px"
            }}
            onClick={stopLogging}
          >
            Stop Recording
          </IonButton>

        )}

      </div>



      {/* EXPORT BUTTON */}

      <IonButton
        expand="block"
        fill="outline"
        size="large"
        style={{
          marginTop: "15px",
          height: "55px",
          borderRadius: "14px"
        }}
        onClick={exportCSV}
      >
        Export CSV
      </IonButton>



      {/* LIVE DATA CARD */}

      <IonCard style={{
        marginTop: "25px",
        borderRadius: "16px"
      }}>

        <IonCardHeader>

          <IonCardTitle>
            Live Data
          </IonCardTitle>

        </IonCardHeader>

        <IonCardContent style={{
          maxHeight: "200px",
          overflowY: "scroll"
        }}>

          {rows.slice(-5).map((row, index) => (

            <div key={index} style={{
              padding: "10px",
              borderBottom: "1px solid #eee"
            }}>

              <div>
                Speed: {row.Location_speed ?? "—"} m/s
              </div>

              <div>
                Lat: {row.Location_latitude ?? "—"}
              </div>

              <div>
                Accel X: {row.Accelerometer_x ?? "—"}
              </div>

            </div>

          ))}

        </IonCardContent>

      </IonCard>


    </IonContent>

  </IonPage>

);

}

export default DataLogger;