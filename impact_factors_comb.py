import pandas as pd

fertility_file = 'fertility-and-female-labor-force-participation.csv'
weekly_hours_file = 'average-usual-weekly-hours-worked-women-15-years-and-older.csv'

fertility_df = pd.read_csv(fertility_file)
weekly_hours_df = pd.read_csv(weekly_hours_file)

weekly_hours_df.rename(columns={
    'Average weekly hours worked (women, 15+) (OECD Labor Force Statistics (2017))': 'Average weekly hours worked'
}, inplace=True)

fertility_df.rename(columns={
    'Fertility rate - Sex: all - Age: all - Variant: estimates': 'Fertility Rate',
    'Labor force participation rate, female (% of female population ages 15+) (national estimate)': 'Labor force participation rate'
}, inplace=True)

weekly_hours_2016 = weekly_hours_df[weekly_hours_df['Year'] == 2016]

# Select only the relevant columns (Country code and Average weekly hours worked)
weekly_hours_2016 = weekly_hours_2016[['Code', 'Average weekly hours worked']]

# Merge the datasets on the Country code
merged_df = pd.merge(fertility_df, weekly_hours_2016, how='left', left_on='Code', right_on='Code')

output_file = 'merged_fertility_and_weekly_hours.csv'
merged_df.to_csv(output_file, index=False)

