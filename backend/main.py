from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import joblib
import pandas as pd
import os

from services.feature_engineering import compute_features


# -----------------------------
# App Setup
# -----------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load Model Safely
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "driver_model.pkl")
behaviour_model = joblib.load("models/behaviour_model.pkl")
risk_model = joblib.load("models/risk_model.pkl")

model = joblib.load(MODEL_PATH)


FEATURE_COLUMNS = [
    "speed_kmph",
    "speed_delta",
    "gps_acceleration",
    "acc_magnitude",
    "jerk",
    "gyro_magnitude",
    "turn_intensity",
    "rolling_speed_std",
    "rolling_jerk_max",
    "rolling_acc_std",
    "bearing_change"
]


# -----------------------------
# Prediction Endpoint
# -----------------------------

@app.post("/predict")
def predict(data: dict):

    df = pd.DataFrame([data])
    df = compute_features(df)
    df = df.fillna(0)

    features = df[FEATURE_COLUMNS]

    behaviour = behaviour_model.predict(features)[0]
    risk_score = float(risk_model.predict(features)[0])

    if risk_score < 33:
        risk_level = "SAFE"
    elif risk_score < 66:
        risk_level = "MODERATE"
    else:
        risk_level = "HIGH"

    return {

    "behaviour_class": behaviour,

    "risk_score": round(risk_score, 2),

    "risk_level": risk_level,

    "speed_kmph":
        float(df["speed_kmph"].iloc[0]),

    "jerk":
        float(df["jerk"].iloc[0]),

    "turn_intensity":
        float(
            df["turn_intensity"].iloc[0]
        ),

    "gps_acceleration":
        float(
            df["gps_acceleration"].iloc[0]
        )
}