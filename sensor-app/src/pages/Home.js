import { IonPage, IonContent } from "@ionic/react";

function Home() {
  return (
    
    <IonPage>
      <IonContent fullscreen >

        <div className="min-h-screen bg-slate-950 text-white p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-bold">
                OneBusStop
              </h1>
              <p className="text-sm text-slate-400">
                Corporate Bus Mobility Platform
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              🚍
            </div>

          </div>


          {/* HERO CARD */}

          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg">

            <h2 className="text-xl font-semibold">
              Smart Bus Monitoring
            </h2>

            <p className="text-sm text-blue-100 mt-2">
              Monitor fleet activity, driver behaviour and trip safety in real time.
            </p>

            <div className="mt-4 text-sm text-blue-200">
              Currently Active: Bus Monitoring Module
            </div>

          </div>


          {/* QUICK MODULES */}

          <div className="mt-10">

            <h2 className="text-lg font-semibold mb-4">
              Platform Modules
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h3 className="font-semibold">
                  Bus Routes
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Route planning and optimization
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h3 className="font-semibold">
                  Bus Monitoring
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Live tracking and telemetry
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h3 className="font-semibold">
                  Driver Reports
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Behaviour and safety analysis
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h3 className="font-semibold">
                  Attendance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Passenger attendance tracking
                </p>
              </div>

            </div>

          </div>


          {/* PLATFORM STATUS */}

          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-5">

            <h3 className="font-semibold mb-3">
              System Status
            </h3>

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                Active Module
              </span>

              <span className="text-green-400">
                Bus Monitoring
              </span>

            </div>

          </div>

        </div>

      </IonContent>
    </IonPage>
  );
}

export default Home;