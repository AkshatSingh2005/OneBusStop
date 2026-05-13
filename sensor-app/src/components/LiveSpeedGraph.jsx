import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer

} from "recharts";

export default function LiveSpeedGraph({ data }) {

  return (

    <ResponsiveContainer
      width="100%"
      height={250}
    >

      <LineChart data={data}>

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="time" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="speed"
          stroke="#3880ff"
          dot={false}
        />

      </LineChart>

    </ResponsiveContainer>
  );
}