import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";

function Features() {

  const features = [
    {
      title: "Bus Routes",
      desc: "Manage and optimize corporate bus routes and schedules."
    },
    {
      title: "Bus Monitoring",
      desc: "Live monitoring of buses including telemetry and sensor data."
    },
    {
      title: "Driver Analysis Report",
      desc: "AI powered analysis of driver behaviour and safety risk."
    },
    {
      title: "Bus Attendance",
      desc: "Track employee boarding and attendance on corporate buses."
    },
    {
      title: "Your Trips",
      desc: "View personal commute trips and travel analytics."
    }
  ];

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Platform Features</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <div className="min-h-screen bg-slate-950 text-white p-6">

          <p className="text-slate-400 mb-6">
            OneBusStop provides a complete corporate transportation management solution.
          </p>


          <div className="space-y-4">

            {features.map((f, i) => (

              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >

                <h3 className="font-semibold text-lg">
                  {f.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {f.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </IonContent>

    </IonPage>
  );
}

export default Features;