import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useLocation, useNavigate } from "react-router-dom"
import MiniNftBox from "./MiniNftBox"
import { useForm } from "react-hook-form"
import ERC6551AccountProxyAbi from "../constants/ERC6551AccountProxy.json"
import RootAbi from "../constants/Root.json"
import { ProviderContext, RootContext, SmartAccountContext } from "../App"
import { useContext } from "react"
import { ethers } from "ethers"
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

  const location = useLocation()
  const { tokenId, tokenURI, tbaAddr } = location.state as State

  const toast = useToast()

  const navigate = useNavigate()

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
      // gas less tx
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      if (import.meta.env.VITE_BICONOMY_DASHBOARD_AUTH_KEY) {
        headers.append("authToken", import.meta.env.VITE_BICONOMY_DASHBOARD_AUTH_KEY)
      }
      if (import.meta.env.VITE_BICONOMY_API_KEY) {
        headers.append("apiKey", import.meta.env.VITE_BICONOMY_API_KEY)
      }
      fetch(
        "https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract",
        {
          method: "POST",
          body: JSON.stringify({
            name: "TBA",
            address: tbaAddr,
            abi: JSON.stringify(ERC6551AccountProxyAbi),
            whitelistedMethods: ["execute"],
          }),
          headers: headers,
        }
      )
        .then(async (response) => {
          const data = await response.json()
          console.log(data)
          if (data.statusCode === 400) {
            return
          }
          return data
        })
        .then((json) => console.log(json))
        .catch((err) => {
          console.log(err)
        })

      const rootInterface = new ethers.utils.Interface(RootAbi)
      const encodedTransferData = rootInterface.encodeFunctionData("transferFrom", [
        tbaAddr,
        data.address,
        tokenId,
      ])
      // const tbaInterface = new ethers.utils.Interface(ERC6551AccountProxyAbi)
      // const encodedExecuteData = tbaInterface.encodeFunctionData("execute", [
      //   root?.address,
      //   0,
      //   encodedTransferData,
      //   0,
      // ])
      const tba = new ethers.Contract(tbaAddr, ERC6551AccountProxyAbi, provider!)
      const executeTx = await tba.populateTransaction.execute(
        root?.address,
        0,
        encodedTransferData,
        0
      )
      const tx = {
        to: tbaAddr,
        data: executeTx.data,
      }
      let partialUserOp = await smartAccount?.buildUserOp([tx])
      partialUserOp!.verificationGasLimit = 1000000
      console.log(partialUserOp)
      const biconomyPaymaster = smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      }
      console.log(paymasterServiceData)
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
        partialUserOp!,
        paymasterServiceData
      )
      partialUserOp!.paymasterAndData = paymasterAndDataResponse.paymasterAndData
      const userOpResponse = await smartAccount?.sendUserOp(partialUserOp!)
      console.log("userOpHash", userOpResponse)
      const { receipt } = await userOpResponse!.wait()
      console.log("txHash", receipt.transactionHash)

      // user paid tx
      // const tba = new ethers.Contract(tbaAddr, ERC6551AccountProxyAbi, provider!)
      // const executeTx = await tba.populateTransaction.execute(
      //   root?.address,
      //   0,
      //   encodedTransferData,
      //   0
      // )
      // const tx = {
      //   to: tbaAddr,
      //   data: executeTx.data,
      // }
      // let userOp = await smartAccount?.buildUserOp([tx])
      // const userOpResponse = await smartAccount?.sendUserOp(userOp!)
      // console.log("userOpHash", userOpResponse)
      // const { receipt } = await userOpResponse!.wait(1)
      // console.log("txHash", receipt.transactionHash)
      toast({
        title: "Transfer Success",
        description: "送信しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      navigate("/")
    } catch (error) {
      console.log(error)
      toast({
        title: "Transfer Failed",
        description: "送信に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const handleOnError = () => {}

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
