import { useLocation } from "react-router-dom"

interface State {
  tokenId: number
}

const Transfer: React.FC = () => {
  const location = useLocation()
  const { tokenId } = location.state as State
  return <div>Have a good coding {tokenId}</div>
}
export default Transfer
