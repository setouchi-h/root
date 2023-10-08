import { Flex, Heading, Spacer, Button, Box, Text } from "@chakra-ui/react"

type HeaderProps = {
  login: () => void
  logout: () => void
  smartAccount: any
  isLoading: boolean
}

const Header: React.FC<HeaderProps> = ({ login, logout, smartAccount, isLoading }) => {
  return (
    <Flex justify="center" align="center" width="100%" height="48px" bg="blue.300">
      <Heading color="white" as="h6" size="xs">
        ROOT NFT
      </Heading>
      <Spacer />
      {!smartAccount && (
        <Button isLoading={isLoading} onClick={login}>
          ログイン
        </Button>
      )}
      {!!smartAccount && (
        <div>
          <h3>Smart account address:</h3>
          <p>{smartAccount.address}</p>
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
      {/* <Link to="/">
          <Heading color="white">ROOT NFT</Heading>
        </Link>
        <Spacer />
        {walletAddress ? (
          <>
            <Link to="/sell-nft">
              <Box mr="20" mt="1">
                <Text fontWeight="semibold" fontSize="17pt" color="whiteAlpha.900">
                  Sell NFT
                </Text>
              </Box>
            </Link>
            <Link to="/user" state={{ addr: walletAddress }}>
              <Box border="1px" borderRadius="5" borderColor="whiteAlpha.900" p="2">
                <Text fontWeight="bold" color="whiteAlpha.900">
                  {truncateStr(walletAddress, 15)}
                </Text>
              </Box>
            </Link>
          </>
        ) : (
          <>
            <Button isLoading={isLoading} onClick={createWallet} mr="5">
              Create Wallet
            </Button>
            <Button isLoading={isLoading} onClick={connectWallet}>
              Connect Wallet
            </Button>
          </>
        )} */}
    </Flex>
  )
}
export default Header
