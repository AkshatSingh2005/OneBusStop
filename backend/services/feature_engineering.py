import pandas as pd
import numpy as np

def compute_features(df):

    df = df.copy()

    if "Location_speed" not in df.columns:
        df["Location_speed"] = 0

    df["Location_speed"] = \
        df["Location_speed"].fillna(0)

    df["time_sec"] = df["global_time"] / 1e9

    df["delta_t"] = df["time_sec"].diff().fillna(0.01)

    df["speed_kmph"] = df["Location_speed"] * 3.6

    df["speed_delta"] = df["speed_kmph"].diff().fillna(0)

    df["gps_acceleration"] = df["speed_delta"] / df["delta_t"]

    ax = df["TotalAcceleration_x"]
    ay = df["TotalAcceleration_y"]
    az = df["TotalAcceleration_z"]

    df["acc_magnitude"] = np.sqrt(ax**2 + ay**2 + az**2)

    df["jerk"] = df["acc_magnitude"].diff().fillna(0) / df["delta_t"]

    gx = df["Gyroscope_x"]
    gy = df["Gyroscope_y"]
    gz = df["Gyroscope_z"]

    df["gyro_magnitude"] = np.sqrt(gx**2 + gy**2 + gz**2)

    df["turn_intensity"] = np.abs(gz) * df["speed_kmph"]

    df["rolling_speed_mean"] = df["speed_kmph"]
    df["rolling_speed_std"] = 0
    df["rolling_jerk_mean"] = df["jerk"]
    df["rolling_jerk_max"] = df["jerk"]
    df["rolling_acc_std"] = 0

    df["bearing_change"] = df["Location_bearing"].diff().abs().fillna(0)

    return df