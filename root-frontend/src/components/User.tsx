import { useContext, useEffect, useState } from "react"
import { SmartAccountContext } from "../App"
import {
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { LogoutContext } from "./Layout"
import { LinkIcon } from "@chakra-ui/icons"
import { truncateStr } from "../utils/truncateStr"

const User: React.FC = () => {
  const { logout } = useContext(LogoutContext)
  const { smartAccount } = useContext(SmartAccountContext)
  const [address, setAddress] = useState<string>("")

  useEffect(() => {
    if (!smartAccount) return

    const getAddress = async () => {
      const address = await smartAccount?.getSmartAccountAddress()
      setAddress(address)
    }
    getAddress()
  }, [smartAccount])

  return (
    <Stack direction="column" align="center" justify="center" mt="20" spacing="7">
      {address ? (
        <>
          <Heading size="lg">マイページ</Heading>
          <Flex direction="column">
            <Text>アドレス:</Text>
            <Stack direction="row" align="center" spacing="2">
              <Text>{truncateStr(address, 30)}</Text>
              <Popover>
                <PopoverTrigger>
                  <Icon as={LinkIcon} onClick={() => navigator.clipboard.writeText(address)} />
                </PopoverTrigger>
                <PopoverContent boxSize="min">
                  <PopoverArrow />
                  <Text fontSize="sm" p="1">
                    Copied!
                  </Text>
                </PopoverContent>
              </Popover>
            </Stack>
          </Flex>
          <Text>
            <Link
              href={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=https://mumbai.polygonscan.com/address/${address}&choe=UTF-8`}
              isExternal
              color="blue.500"
            >
              こちら
            </Link>
            からアドレスのQRコードを作成できます
          </Text>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Spinner />
      )}
    </Stack>
  )
}
export default User
