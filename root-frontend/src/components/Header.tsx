import { Flex, Heading, Spacer, Button, Image } from "@chakra-ui/react"
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
      bg="#FFD500"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
    >
      <Flex width="90%" align="center">
        <Link to="/">
          <Flex align="center" ml="1">
            <Image src="/root.png" objectFit="cover" boxSize="30px" />
            <Heading as="h6" size="sm" ml="2">
              root
            </Heading>
          </Flex>
        </Link>
        <Spacer />
        {!smartAccount && (
          <Button size="sm" isLoading={isLoading} onClick={login}>
            ログイン
          </Button>
        )}
        {!!smartAccount && (
          <Button size="sm" onClick={() => navigate("/user")}>
            マイページ
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
export default Header
