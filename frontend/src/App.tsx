import { useEffect, useState } from 'react';
import { socket } from './services/socket';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function LiveChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    const handler = (update: { symbol: string; price: number }) => {
      if (update.symbol === symbol) {
        setData(prev => [
          ...prev.slice(-20), // sadece son 20 veri
          { time: new Date().toLocaleTimeString(), price: update.price },
        ]);
      }
    };

    socket.on('priceUpdate', handler);

    return () => {
      socket.off('priceUpdate', handler);
    };
  }, [symbol]);

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  );
}
