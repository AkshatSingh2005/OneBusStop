import pandas as pd
import numpy as np

# Load merged dataset
df = pd.read_csv("transport_dataset_all.csv")

# -----------------------------
# 1️⃣ Time Processing
# -----------------------------

# Convert nanoseconds to seconds
df["time_sec"] = df["global_time"] / 1e9

# Time difference
df["delta_t"] = df["time_sec"].diff().fillna(0.01)

# Avoid division by zero
df["delta_t"] = df["delta_t"].replace(0, 0.01)


# -----------------------------
# 2️⃣ Speed Features
# -----------------------------

# Convert m/s to km/h
df["speed_kmph"] = df["Location_speed"] * 3.6

# Speed change
df["speed_delta"] = df["speed_kmph"].diff().fillna(0)

# GPS acceleration
df["gps_acceleration"] = df["speed_delta"] / df["delta_t"]


# -----------------------------
# 3️⃣ Acceleration Features
# -----------------------------

ax = df["TotalAcceleration_x"]
ay = df["TotalAcceleration_y"]
az = df["TotalAcceleration_z"]

# Acceleration magnitude
df["acc_magnitude"] = np.sqrt(ax**2 + ay**2 + az**2)

# Jerk
df["jerk"] = df["acc_magnitude"].diff().fillna(0) / df["delta_t"]


# -----------------------------
# 4️⃣ Gyroscope Features
# -----------------------------

gx = df["Gyroscope_x"]
gy = df["Gyroscope_y"]
gz = df["Gyroscope_z"]

# Gyro magnitude
df["gyro_magnitude"] = np.sqrt(gx**2 + gy**2 + gz**2)

# Turn intensity (very powerful feature)
df["turn_intensity"] = np.abs(gz) * df["speed_kmph"]


# -----------------------------
# 5️⃣ Rolling Window Features (5-second approx)
# -----------------------------

window_size = 5  # adjust if needed

df["rolling_speed_mean"] = df["speed_kmph"].rolling(window_size).mean()
df["rolling_speed_std"] = df["speed_kmph"].rolling(window_size).std()

df["rolling_jerk_mean"] = df["jerk"].rolling(window_size).mean()
df["rolling_jerk_max"] = df["jerk"].rolling(window_size).max()

df["rolling_acc_std"] = df["acc_magnitude"].rolling(window_size).std()


# -----------------------------
# 6️⃣ Bearing Change (Road Curvature Proxy)
# -----------------------------

df["bearing_change"] = df["Location_bearing"].diff().abs().fillna(0)


# -----------------------------
# 7️⃣ Road Type Classification (Simple Heuristic)
# -----------------------------

def classify_road(speed):
    if speed > 70:
        return "highway"
    elif speed > 40:
        return "city"
    else:
        return "rural"

df["road_type"] = df["rolling_speed_mean"].apply(
    lambda x: classify_road(x) if not pd.isna(x) else "unknown"
)


# -----------------------------
# 8️⃣ Basic Event Flags (Optional)
# -----------------------------

df["overspeed_flag"] = (df["speed_kmph"] > 60).astype(int)
df["harsh_brake_flag"] = (df["TotalAcceleration_x"] < -3).astype(int)
df["sudden_acc_flag"] = (df["TotalAcceleration_x"] > 3).astype(int)
df["rash_turn_flag"] = (np.abs(df["Gyroscope_z"]) > 1.5).astype(int)


# -----------------------------
# Save Final Feature Dataset
# -----------------------------

df.to_csv("transport_dataset_final_feature.csv", index=False)

print("Feature engineering complete. Saved as transport_dataset_with_features.csv")