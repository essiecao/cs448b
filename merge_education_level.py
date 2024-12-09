import pandas as pd

# File paths for the datasets
fertility_file_path = 'fertility_with_workweek_data.csv'
education_file_path = 'womens-educational-attainment-vs-fertility.csv'

# Load the datasets
fertility_df = pd.read_csv(fertility_file_path)
education_df = pd.read_csv(education_file_path)

# Rename relevant columns in the education dataset
education_df.rename(columns={
    'Combined - average years of education for 15-64 years female youth and adults': 'Years of Education',
    'Code': 'Country Code'
}, inplace=True)

# Select only the columns needed for the merge
processed_education_df = education_df[['Country Code', 'Years of Education']]

# Merge the datasets on the matching country code
merged_df = pd.merge(fertility_df, processed_education_df, how='left', left_on='Code', right_on='Country Code')

# Drop the redundant 'Country Code' column
merged_df.drop(columns=['Country Code'], inplace=True)
merged_df = merged_df.dropna(subset=['Years of Education'])
# Save the resulting merged dataset to a new CSV file
output_file_path = 'fertility_with_workweek_and_education_data.csv'
merged_df.to_csv(output_file_path, index=False)
