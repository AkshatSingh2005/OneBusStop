import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

df = pd.read_csv("../data/transport_dataset_with_behaviour.csv")

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

X = df[FEATURE_COLUMNS].fillna(0)
y = df["behaviour_class"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(classification_report(y_test, y_pred))

joblib.dump(model, "../models/behaviour_model.pkl")

print("Behaviour model saved.")