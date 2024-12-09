import pandas as pd
file_path = 'children-per-woman-un.csv'
data = pd.read_csv(file_path)

data.rename(columns={
    'Fertility rate - Sex: all - Age: all - Variant: estimates': 'Fertility Rate'
}, inplace=True)

filtered_data = data[data['Year'].isin([1950, 2023])]

pivot_data = filtered_data.pivot(index=['Entity', 'Code'], columns='Year', values='Fertility Rate').reset_index()

pivot_data['Relative Change'] = ((pivot_data[2023] - pivot_data[1950]) / pivot_data[1950]) * 100

final_data = pivot_data[['Entity', 'Code', 'Relative Change']].copy()
final_data.rename(columns={'Entity': 'Country'}, inplace=True)
final_data = final_data[final_data['Code'].notna()]
final_data = final_data[final_data['Country'] != "World"]

# Save the results to a CSV file
output_path = 'fertility_rate_relative_change.csv'
final_data.to_csv(output_path, index=False)
