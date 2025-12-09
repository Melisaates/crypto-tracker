import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function LiveChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);
  console.log("LiveChart rendered with symbol:", symbol);
useEffect(() => {
  const handler = (update: { symbol: string; price: number }) => {
    console.log("PRICE EVENT RECEIVED: symbol : ", update.symbol);
    console.log("PRICE EVENT RECEIVED: price : ", update.price);


    if (update.symbol !== symbol) return;

    setData(prev => [
      ...prev.slice(-20),
      {
        time: new Date().toLocaleTimeString(),
        price: Number(update.price)
      }
    ]);
  };

  socket.on("priceUpdate", handler);

  return () => {
    socket.off("priceUpdate", handler);
  };
}, [symbol]);


  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="time" stroke='pink'/>
      <YAxis stroke='pink' />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke='pink' />
    </LineChart>
  );
}