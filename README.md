# Modern Chart PCF

- **Optimized for Canvas and Model-Driven Apps**
- **Responsive**
- **4 different chart options**

This Power Apps PCF control renders dynamic, responsive charts using Recharts and ShadCN styling. It supports multiple chart types—Bar, Line, Area, and Pie—and includes configuration options for series, category field, text color, chart height, header visibility, locale formatting, and palette customization. Designed for both Model-driven and Canvas apps, it intelligently formats numeric and currency values based on the environment.

![Screenshot 2025-05-10 134941](https://github.com/user-attachments/assets/4f2c868c-a50b-456a-93f2-6f483d3feaa6)

## Important notes

- Make sure your data source view includes the fields you intend to display in the chart.
- The chart only supports numeric and currency fields.

## Input Parameters

| Input               | Description                                               | Values                                              |
|---------------------|-----------------------------------------------------------|-----------------------------------------------------|
| `chartTitle`        | Sets the main title of the chart                          | Custom text string                                  |
| `chartDescription`  | Adds a description below the chart title                  | Custom text string                                  |
| `categoryField`     | Column name used for the X-axis or category labels        | Column name (string)                                |
| `seriesFields`      | Comma-separated list of columns used as data series       | e.g., `new_revenue,new_expenses,profit`                     |
| `chartHeight`       | Height of the chart in pixels                             | Numeric string (e.g., `300`)                        |
| `displayChartHeader`| Whether to show the chart title and description           | `true`, `false`                                     |
| `displayHeaderTotals`| Whether to display the total value for each series       | `true`, `false`                                     |
| `enableSmoothBars`  | Applies smoothing (e.g., rounded corners or curves)       | `true`, `false`                                     |
| `textColor`         | Hex value to override the default text color              | e.g., `#000000`, `#ff5733`                          |
| `chartType`         | Defines the type of chart to render                       | `Bar`, `Line`, `Area`, `Pie`                        |
| `localeOverride`    | Overrides the locale used for number and currency formats | e.g., `en-GB`, `fr-FR`, `de-DE`                     |
| `paletteOverride`   | Comma-separated hex values for custom series colours      | e.g., `#2563eb,#60a5fa,#22d3ee,#4ade80`             |
| `isCanvas`          | Used internally to detect Canvas App mode (hidden input)  | `true`, `false` (default: `false`)                  |

# Example config setup (Canvas App)

![Screenshot 2025-05-10 135754](https://github.com/user-attachments/assets/d2382adf-39b4-4381-b84d-2d0519eb4030)



For any issues or feedback, please use the "Issues" tab at the top of the page.
