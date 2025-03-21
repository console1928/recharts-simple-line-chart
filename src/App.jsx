import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const UV = "uv";
const PV = "pv";
const REDCOLOR = "red";
const WHITECOLOR = "#ffffff";

const chartIdColors = {
  uv: "#82ca9d",
  pv: "#8884d8"
};

const getArithmeticMean = (chartId) => {
  const chartIdValues = [...data.map((page) => page[chartId])];

  return chartIdValues.reduce((accumulator, currentValue) => accumulator + currentValue) / chartIdValues.length;
};

const getStandardDeviation = (chartId) => {
  const chartIdValues = [...data.map((page) => page[chartId])];
  const arithmeticMean = getArithmeticMean(chartId);

  return Math.sqrt(chartIdValues.reduce((accumulator, currentValue) => accumulator + Math.pow((currentValue - arithmeticMean), 2)) / chartIdValues.length);
};

const getStandardScoreRange = (chartId) => {
  return {
    maximum: getArithmeticMean(chartId) + getStandardDeviation(chartId),
    minimum: getArithmeticMean(chartId) - getStandardDeviation(chartId)
  };
};

const getLinearGradientOffset = (chartId) => {
  const dataMaximum = Math.max(...data.map((page) => page[chartId]));
  const dataMinimum = Math.min(...data.map((page) => page[chartId]));
  const standardScoreRange = getStandardScoreRange(chartId);

  return {
    maximum: (dataMaximum - standardScoreRange.maximum) / (dataMaximum - dataMinimum),
    minimum: (dataMaximum - standardScoreRange.minimum) / (dataMaximum - dataMinimum)
  };
};

const getDotFillColor = (active, isDotInRange, chartId) => {
  if (active) {
    if (isDotInRange) {
      return chartIdColors[chartId];
    }

    return REDCOLOR;
  }

  return WHITECOLOR;
};

const setLegendTextColor = (value, entry) => {
  const { dataKey } = entry;

  return <span style={{ color: chartIdColors[dataKey] }}>{value}</span>;
};

const CustomizedDot = (props) => {
  const { cx, cy, value, chartId, active, radius } = props;
  const standardScoreRange = getStandardScoreRange(chartId);
  const isDotInRange = value >= standardScoreRange.minimum && value <= standardScoreRange.maximum;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius || 3}
      stroke={isDotInRange ? chartIdColors[chartId] : REDCOLOR}
      fill={getDotFillColor(active, isDotInRange, chartId)}
    />
  );
};

export default function App() {
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data} margin={{ top: 20 }} accessibilityLayer>
        <CartesianGrid strokeDasharray={"3 3"} />
        <XAxis dataKey={"name"} padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend formatter={setLegendTextColor} />
        <defs>
          {Object.keys(chartIdColors).map((chartId) =>
            <linearGradient key={chartId} id={chartId} x1={"0%"} y1={"0%"} x2={"0%"} y2={"100%"}>
              <stop offset={getLinearGradientOffset(chartId).maximum} stopColor={REDCOLOR} />
              <stop offset={getLinearGradientOffset(chartId).maximum} stopColor={chartIdColors[chartId]} />
              <stop offset={getLinearGradientOffset(chartId).minimum} stopColor={chartIdColors[chartId]} />
              <stop offset={getLinearGradientOffset(chartId).minimum} stopColor={REDCOLOR} />
            </linearGradient>
          )}
        </defs>
        <Line
          type="monotone"
          dataKey={PV}
          stroke={`url(#${PV})`}
          dot={<CustomizedDot chartId={PV} active={false} />}
          activeDot={<CustomizedDot chartId={PV} active={true} radius={8} />}
        ></Line>
        <Line
          type="monotone"
          dataKey={UV}
          stroke={`url(#${UV})`}
          dot={<CustomizedDot chartId={UV} active={false} />}
          activeDot={<CustomizedDot chartId={UV} active={true} />}
        ></Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
