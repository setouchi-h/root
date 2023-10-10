import { Flex, Heading, Spacer, Button, Box, Text } from "@chakra-ui/react"
import { truncateStr } from "../utils/truncateStr"
import { Link } from "react-router-dom"
import { BiconomySmartAccount } from "@biconomy/account"

type HeaderProps = {
  login: () => void
  logout: () => void
  smartAccount: BiconomySmartAccount | null
  isLoading: boolean
}

const Header: React.FC<HeaderProps> = ({ login, logout, smartAccount, isLoading }) => {
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
          <div>
            <Button onClick={logout} size="sm" variant="outline" color="white">
              マイページ
            </Button>
          </div>
        )}
      </Flex>
    </Flex>
  )
}
export default Header
