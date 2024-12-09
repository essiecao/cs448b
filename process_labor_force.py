import pandas as pd
fertility_file_path = 'fertility-and-female-labor-force-participation.csv'
fertility_df = pd.read_csv(fertility_file_path)

# Drop the unnecessary columns: 'time', 'time.1', 'time.2', 'time.3'
fertility_df.drop(columns=['time', 'time.1', 'time.2', 'time.3'], inplace=True)

# Rename the columns for clarity
fertility_df.rename(columns={
    'Labor force participation rate, female (% of female population ages 15+) (national estimate)': 'Labor force participation rate',
    'Fertility rate - Sex: all - Age: all - Variant: estimates': 'Fertility Rate'
}, inplace=True)

# Remove rows without a valid 'Code'
fertility_df = fertility_df[fertility_df['Code'].notnull()]

# Save the cleaned dataset to a new file
output_file_path = 'cleaned_fertility_data.csv'
fertility_df.to_csv(output_file_path, index=False)

