import pandas as pd

# Load files
df_akshat = pd.read_csv("transport_dataset_final_akshat.csv")
df_lok = pd.read_csv("transport_dataset_final_Lok.csv")
df_sak = pd.read_csv("transport_dataset_final_sak.csv")

# Add bus_number column
df_akshat["bus_number"] = 19
df_sak["bus_number"] = 6
df_lok["bus_number"] = 29

# Combine all
combined_df = pd.concat(
    [df_akshat, df_lok, df_sak],
    ignore_index=True
)

# Save final dataset
combined_df.to_csv("transport_dataset_all.csv", index=False)

print("Bus numbers added and files combined successfully!")
