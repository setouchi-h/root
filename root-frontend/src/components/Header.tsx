import { Flex, Heading, Spacer, Button } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { BiconomySmartAccount } from "@biconomy/account"

type HeaderProps = {
  login: () => void
  smartAccount: BiconomySmartAccount | null
  isLoading: boolean
}

const Header: React.FC<HeaderProps> = ({ login, smartAccount, isLoading }) => {
  const navigate = useNavigate()

  return (
    <Flex
      justify="center"
      align="center"
      width="100%"
      height="48px"
      bg="blackAlpha.500"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
    >
      <Flex width="90%" align="center">
        <Link to="/">
          <Heading color="white" as="h6" size="xs" ml="2">
            ROOT NFT
          </Heading>
        </Link>
        <Spacer />
        {!smartAccount && (
          <Button size="sm" variant="outline" color="white" isLoading={isLoading} onClick={login}>
            ログイン
          </Button>
        )}
        {!!smartAccount && (
          <Button size="sm" variant="outline" color="white" onClick={() => navigate("/user")}>
            マイページ
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
export default Header
