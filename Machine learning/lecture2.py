import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# --- 1. Pie Chart: Political Parties 2017 ---
# Data based on 2017 UK General Election results
parties = ['Conservative', 'Labour', 'SNP', 'Lib Dem', 'Others']
votes = [42.4, 40.0, 3.0, 7.4, 7.2]
plt.figure(figsize=(8, 6))
plt.pie(votes, labels=parties, autopct='%1.1f%%', startangle=140, colors=['blue', 'red', 'yellow', 'orange', 'grey'])
plt.title("UK Political Parties Vote Percentage (2017)")
plt.show()

# --- 2. First 10 Fibonacci Numbers ---
def fib(n):
    a, b = 0, 1
    sequence = []
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

fib_data = fib(10)
plt.figure()
plt.plot(fib_data, label='Continuous Line', color='green')
plt.scatter(range(10), fib_data, label='Independent Dots', color='red')
plt.title("First 10 Fibonacci Numbers")
plt.legend()
plt.show()

# --- Load Company Dataset for Q3-Q7 ---
# Note: Ensure company_sales_data.csv is in your folder
try:
    df = pd.read_csv('company_sales_data.csv')
except FileNotFoundError:
    # Dummy data generation if file is missing
    data = {
        'month_number': range(1, 13),
        'facecream': [2500, 2630, 2140, 3400, 3600, 2760, 2980, 3700, 3540, 1990, 2340, 2900],
        'facewash': [1500, 1200, 1340, 1130, 1740, 1555, 1120, 1400, 1780, 1890, 2100, 1760],
        'total_profit': [211000, 183300, 224700, 222700, 209600, 201400, 295500, 361400, 234000, 266700, 412800, 300200]
    }
    df = pd.DataFrame(data)

# --- 3. Total Profit Line Plot ---
plt.figure()
plt.plot(df['month_number'], df['total_profit'])
plt.xlabel('Month Number')
plt.ylabel('Total Profit')
plt.title('Total Profit of All Months')
plt.show()

# --- 4. Pie Chart: Units Sold per Product ---
# Assuming product columns: facecream, facewash, toothpaste, bathingsoap, shampoo, moisturizer
# We use the columns available in the standard dataset
products = ['FaceCream', 'FaceWash'] # Add more based on your CSV
sales_data = [df['facecream'].sum(), df['facewash'].sum()]
plt.figure()
plt.pie(sales_data, labels=products, autopct='%1.1f%%')
plt.title('Units Sold per Year per Product')
plt.show()

# --- 5. Styled Profit Line Plot ---
plt.figure()
plt.plot(df['month_number'], df['total_profit'], 
         label='Profit Data', color='red', marker='o', 
         linestyle='--', linewidth=3, markerfacecolor='black')
plt.xlabel('Month Number')
plt.ylabel('Profit')
plt.legend(loc='lower right')
plt.title('Company Profit - Styled')
plt.show()

# --- 6. Face Cream vs Face Wash Bar Chart ---
plt.figure()
plt.bar(df['month_number'] - 0.2, df['facecream'], width=0.4, label='Face Cream')
plt.bar(df['month_number'] + 0.2, df['facewash'], width=0.4, label='Face Wash')
plt.xlabel('Month Number')
plt.ylabel('Sales Units')
plt.title('Face Cream and Face Wash Sales')
plt.legend()
plt.show()

# --- 7. Profit Histogram ---
plt.figure()
profit_range = [150000, 175000, 200000, 225000, 250000, 300000, 350000, 400000, 450000]
plt.hist(df['total_profit'], bins=profit_range)
plt.title('Profit Range Histogram')
plt.show()

# --- 8. Box Plot Analysis & Student Scores ---
# Explanation: 
# - Skewness: If the median (line inside box) is closer to the bottom, it's positively skewed. 
#   If closer to the top, it's negatively skewed. Symmetric if centered.
# - Outliers: Any dots appearing beyond the whiskers (the lines extending from the box).

scores = np.random.normal(70, 10, 100) # Normal distribution
scores = np.append(scores, [10, 110])   # Adding manual outliers
plt.figure()
plt.boxplot(scores)
plt.title('Student Scores Box Plot')
plt.ylabel('Scores')
plt.show()