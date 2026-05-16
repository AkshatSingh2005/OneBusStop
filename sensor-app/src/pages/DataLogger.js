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

import {

  collection,
  addDoc

} from "firebase/firestore";

import { db }
from "../firebaseConfig";

import { saveCSV } from '../services/CSVService';

import { predictDriver } from '../services/predictionService';

import LiveSpeedGraph
from "../components/LiveSpeedGraph";

import {
  saveTripSummary,
  saveTripData
}
from "../services/tripService";


function DataLogger() {

  const [isLogging, setIsLogging] = useState(false);

  const [rows, setRows] = useState([]);

  const [busNumber, setBusNumber] = useState("");

  const [frequency, setFrequency] = useState("max");

  const [prediction, setPrediction] = useState(null);

  const [behaviour, setBehaviour] = useState(null);
const [riskScore, setRiskScore] = useState(null);
const [riskLevel, setRiskLevel] = useState(null);
  const [tripActive, setTripActive] = useState(false);

  const [tripId, setTripId] = useState(null);

  const [tripStartTime, setTripStartTime] = useState(null);

  const [tripData, setTripData] = useState([]);

  const [tripStats, setTripStats] = useState({

      maxSpeed: 0,

      avgSpeed: 0,

      totalSpeed: 0,

      totalSamples: 0,

      harshBrakes: 0,

      overspeedEvents: 0,

      rashTurns: 0,

      suddenAcceleration: 0,

      driverScore: 100
  });

  const [speedGraphData,setSpeedGraphData] = useState([]);

  useEffect(() => {

  firebaseStartupTest();

}, []);



  // START
  function startLogging() {

    if (!busNumber) {
      alert("Enter bus number");
      return;
    }
    const newTripId = `TRIP_${Date.now()}`;

      setTripId(newTripId);

      setTripStartTime(Date.now());

      setTripActive(true);

      setTripData([]);

      setTripStats({

          maxSpeed: 0,

          avgSpeed: 0,

          totalSpeed: 0,

          totalSamples: 0,

          harshBrakes: 0,

          overspeedEvents: 0,

          rashTurns: 0,

          suddenAcceleration: 0,

          driverScore: 100
      });

    const intervalMs = frequency === "max" ? 0 : parseInt(frequency);
    
    startSensorListeners(async (row) => {

      console.log(
  "Sensor Row:",
  JSON.stringify(row, null, 2)
);

  setRows(prev => [...prev, row]);

  const result = await predictDriver(row);
  console.log(
  "Prediction:",
  JSON.stringify(result, null, 2)
);

  if (result) {

    setBehaviour(result.behaviour_class);

    setRiskScore(result.risk_score);

    setRiskLevel(result.risk_level);


    const speed = result.speed_kmph;

    setSpeedGraphData(prev => [

  ...prev.slice(-20),

  {

    time:
      new Date()
      .toLocaleTimeString(),

    speed:
      speed > 0
        ? speed
        : Math.random() * 80
  }

]);

    // Store trip row
    setTripData(prev => [

      ...prev,

      {
        ...row,
        prediction: result
      }

    ]);


    // Speed statistics
    setTripStats(prev => ({

      ...prev,

      maxSpeed: Math.max(
        prev.maxSpeed,
        speed
      ),

      totalSpeed:
        prev.totalSpeed + speed,

      totalSamples:
        prev.totalSamples + 1

    }));


    let scorePenalty = 0;


    // Overspeed
    if(speed > 70){

      scorePenalty += 5;

      setTripStats(prev => ({

        ...prev,

        overspeedEvents:
          prev.overspeedEvents + 1
      }));
    }


    // Aggressive behaviour
    if(
      result.behaviour_class ===
      "Aggressive"
    ){

      scorePenalty += 8;
    }


    // High risk
    if(
      result.risk_level === "HIGH"
    ){

      scorePenalty += 10;
    }


    // Harsh brake
    if(
      result.gps_acceleration < -6
    ){

      scorePenalty += 7;

      setTripStats(prev => ({

        ...prev,

        harshBrakes:
          prev.harshBrakes + 1
      }));
    }


    // Rash turn
    if(
      result.turn_intensity > 120
    ){

      scorePenalty += 8;

      setTripStats(prev => ({

        ...prev,

        rashTurns:
          prev.rashTurns + 1
      }));
    }


    // Final score update
    setTripStats(prev => ({

      ...prev,

      driverScore: Math.max(

        prev.driverScore
        - scorePenalty,

        0
      )
    }));

  }

}, busNumber, intervalMs);

    setIsLogging(true);

  }


  // STOP
  async function stopLogging() {

    stopSensorListeners();

    setIsLogging(false);

    setTripActive(false);

    const finalAvgSpeed =

        tripStats.totalSamples > 0

            ? tripStats.totalSpeed /
              tripStats.totalSamples

            : 0;

    const tripSummary = {

        tripId,

        startTime: tripStartTime,

        endTime: Date.now(),

        avgSpeed: finalAvgSpeed,

        ...tripStats
    };

   console.log(
  "Saving trip summary..."
);

await saveTripSummary(
  tripSummary
);

console.log(
  "Trip summary saved!"
);

    // Save detailed trip data to Firebase
    //await saveTripData(tripId, tripData);

    console.log(
  "Final Trip Summary:",
  JSON.stringify(
    tripSummary,
    null,
    2
  )
);

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

  const firebaseStartupTest =
async () => {

  try {

    console.log(
      "Firebase startup test..."
    );

    const docRef = await addDoc(

      collection(
        db,
        "startup_test"
      ),

      {

        app: "OneBusStop",

        status: "App Opened",

        timestamp: Date.now()
      }

    );

    console.log(

      "Firebase startup success:",

      docRef.id

    );

  } catch(error){

    console.error(

      "Firebase startup failed:",

      JSON.stringify(
        error,
        null,
        2
      )

    );
  }
};


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

<IonCard style={{
  marginTop: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
}}>

  <IonCardHeader>

    <IonCardTitle>
      Trip Analytics
    </IonCardTitle>

  </IonCardHeader>

  <IonCardContent>

    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px"
    }}>

      <div>

        <h2 style={{ margin: 0 }}>
          {tripStats.driverScore.toFixed(0)}
        </h2>

        <p style={{
          margin: 0,
          opacity: 0.6
        }}>
          Driver Score
        </p>

      </div>

      <div>

        <h2 style={{ margin: 0 }}>
          {tripStats.maxSpeed.toFixed(1)}
        </h2>

        <p style={{
          margin: 0,
          opacity: 0.6
        }}>
          Max Speed
        </p>

      </div>

      <div>

        <h2 style={{ margin: 0 }}>
          {tripStats.overspeedEvents}
        </h2>

        <p style={{
          margin: 0,
          opacity: 0.6
        }}>
          Overspeed Events
        </p>

      </div>

      <div>

        <h2 style={{ margin: 0 }}>
          {tripStats.harshBrakes}
        </h2>

        <p style={{
          margin: 0,
          opacity: 0.6
        }}>
          Harsh Brakes
        </p>

      </div>

    </div>

  </IonCardContent>

</IonCard>



   <IonCard style={{
  marginTop: "20px",
  borderRadius: "16px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.08)"
}}>

  <IonCardHeader>

    <IonCardTitle>
      Live Speed Visualization
    </IonCardTitle>

  </IonCardHeader>

  <IonCardContent>

    <LiveSpeedGraph
      data={speedGraphData}
    />

  </IonCardContent>

</IonCard>

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