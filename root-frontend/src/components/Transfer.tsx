import { Button, Flex, FormControl, FormLabel, Input, Stack, Text } from "@chakra-ui/react"
import { useLocation } from "react-router-dom"
import MiniNftBox from "./MiniNftBox"
import { useForm } from "react-hook-form"
import ERC6551AccountAbi from "../../constants/ERC6551Account.json"
import { ProviderContext, RootContext, SmartAccountContext } from "../App"
import { useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import { contractAddressesInterface } from "../types/networkAddress"
import networkConfig from "../../constants/networkMapping.json"
import { ChainId } from "@biconomy/core-types"
import { IHybridPaymaster, PaymasterMode, SponsorUserOperationDto } from "@biconomy/paymaster"

interface State {
  tokenId: number
  tokenURI: string
  tbaAddr: string
}

type FormData = {
  address: string
}

const Transfer: React.FC = () => {
  const { provider } = useContext(ProviderContext)
  const { root } = useContext(RootContext)
  const { smartAccount } = useContext(SmartAccountContext)
  const [tba, setTba] = useState<ethers.Contract | null>(null)
  const location = useLocation()
  const { tokenId, tokenURI, tbaAddr } = location.state as State
  console.log(tokenId)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    criteriaMode: "all",
    defaultValues: {
      address: "",
    },
  })

  const handleOnSubmit = async (data: FormData) => {
    try {
      const transferTx = await root?.populateTransaction.transferFrom(
        await smartAccount?.getSmartAccountAddress(),
        data.address,
        tokenId
      )
      console.log(transferTx?.data)
      const addresses: contractAddressesInterface = networkConfig
      const chainId = ChainId.POLYGON_MUMBAI.toString()
      const rootAddr = addresses[chainId].ERC6551Account[0]
      const executeTx = await tba?.populateTransaction.execute(rootAddr, 0, transferTx?.data, 0)
      const tx = {
        to: tbaAddr,
        data: executeTx?.data,
      }
      console.log(tx)
      let userOp = await smartAccount?.buildUserOp([tx])
      const biconomyPaymaster = smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      }
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
        userOp!,
        paymasterServiceData
      )

      userOp!.paymasterAndData = paymasterAndDataResponse.paymasterAndData
      const userOpResponse = await smartAccount?.sendUserOp(userOp!)
      console.log("userOpHash", userOpResponse)
      const { receipt } = await userOpResponse!.wait(1)
      console.log("txHash", receipt.transactionHash)
    } catch (error) {
      console.log(error)
    }
  }
  const handleOnError = () => {}

  useEffect(() => {
    /** コントラクトの作成 */
    if (!provider) return
    if (!tbaAddr) return
    const tba = new ethers.Contract(tbaAddr, ERC6551AccountAbi, provider)
    setTba(tba)
  }, [provider])

  return (
    <Stack direction="column" align="center" justify="center" mt="20" spacing="7">
      <Text fontSize="3xl">転送</Text>
      <MiniNftBox tokenId={tokenId} tokenURI={tokenURI} />
      <FormControl>
        <FormLabel mt="5">転送先：</FormLabel>
        <Input
          placeholder="e.g. 0x123...abc"
          {...register("address", { required: "送信先のアドレスを入力して下さい" })}
          type="text"
        />
        {errors.address && <Text color="red.500">{errors.address.message}</Text>}
        <Flex align="center" justify="center">
          <Button
            mt="6"
            w="40"
            type="submit"
            onClick={handleSubmit(handleOnSubmit, handleOnError)}
            isLoading={isSubmitting}
          >
            送信
          </Button>
        </Flex>
      </FormControl>
    </Stack>
  )
}
export default Transfer
