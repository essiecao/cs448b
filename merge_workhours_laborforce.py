import pandas as pd
workweek_file_path = 'average-workweek-by-country-2024.csv'
workweek_df = pd.read_csv(workweek_file_path)

workweek_df.rename(columns={
    'AvgWorkWeek_AvgWeeklyHoursWorkedFemales_ILOSTAT_Est2024': 'Women Weekly Working Hours'
}, inplace=True)

# Select only the columns for country and average work hours
processed_workweek_df = workweek_df[['country', 'Women Weekly Working Hours']]

# Save the processed dataset to a new file
output_file_path = 'processed_workweek_data.csv'
processed_workweek_df.to_csv(output_file_path, index=False)

# Load the datasets
fertility_file_path = 'cleaned_fertility_data.csv'
workweek_file_path = 'processed_workweek_data.csv'

fertility_df = pd.read_csv(fertility_file_path)
workweek_df = pd.read_csv(workweek_file_path)

# Merge the datasets on the matching country columns
merged_df = pd.merge(fertility_df, workweek_df, how='left', left_on='Entity', right_on='country')
merged_df.drop(columns=['country'], inplace=True)
merged_df = merged_df.dropna(subset=['Women Weekly Working Hours'])
# Save the resulting merged dataset to a CSV file
output_file_path = 'fertility_with_workweek_data.csv'
merged_df.to_csv(output_file_path, index=False)

