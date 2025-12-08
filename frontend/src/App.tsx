import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import './App.css'
import { socket } from './services/socket'

function App() {
  const [prices, setPrices] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    // Listen for price updates from the server
    socket.on('priceUpdate', (data: { price: string; timestamp: number }
    ) => {
      console.log("received: ",data)
      setPrices((prevPrices) => [...prevPrices, data.price])
      setLabels((prevLabels) => [...prevLabels, new Date(data.timestamp).toLocaleTimeString()])
    })

  
  }, [])


  return (
      <div>
       <h2>Live BTC price</h2>
       <Line 
          data = {{
            labels,
            datasets:[
              {
                label:'BTC-USDT',
                data:prices,
                borderColor:'rgba(75,192,192,1)',
                backgroundColor:'rgba(75,192,192,0.2)',
              }
            ]
          }}
       />

      </div>
      
  )
}

export default App
