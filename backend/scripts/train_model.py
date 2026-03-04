import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score


# Load dataset
df = pd.read_csv("../data/transport_dataset_final_feature.csv")

print("Dataset loaded:", df.shape)


# Features to use
FEATURE_COLUMNS = [

    "speed_kmph",
    "speed_delta",
    "gps_acceleration",
    "acc_magnitude",
    "jerk",
    "gyro_magnitude",
    "turn_intensity",
    "rolling_speed_mean",
    "rolling_speed_std",
    "rolling_jerk_mean",
    "rolling_jerk_max",
    "rolling_acc_std",
    "bearing_change"

]


# Remove rows with missing values
df = df.dropna(subset=FEATURE_COLUMNS)


# Target label (driver identity)
y = df["bus_number"]

# Features
X = df[FEATURE_COLUMNS]


print("Training samples:", len(X))


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = RandomForestClassifier(

    n_estimators=200,
    max_depth=12,
    random_state=42,
    n_jobs=-1

)


# Train model
model.fit(X_train, y_train)

print("Model trained")


# Evaluate model
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# Save model
joblib.dump(model, "../models/driver_model.pkl")

print("\nModel saved to models/driver_model.pkl")