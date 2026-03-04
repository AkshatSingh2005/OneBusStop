import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
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
y = df["risk_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, pred))

joblib.dump(model, "../models/risk_model.pkl")

print("Risk model saved.")