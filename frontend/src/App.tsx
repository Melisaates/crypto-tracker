import LiveChart from './components/LiveChart'

function App() {
  return (
    <div>
      <h2 style={{color:"white"}}>BTC/USDT Live Price</h2>
      <LiveChart symbol="BTCUSDT" />
    </div>
  )
}

export default App
export { App }