import { RootStore } from '@stores/index'
import { persist } from 'mobx-persist'
import { computed, observable, action } from 'mobx'
import { eos, nsdb } from '@novuspherejs'
import { isServer, sleep } from '@utils'
import { ApiGetUnifiedId } from '../interfaces/ApiGet-UnifiedId'
import { AuthStore } from '@stores/authStore'
import { task } from 'mobx-task'

export class WalletStore {
    @persist('list')
    @observable
    supportedTokensForUID = []

    @persist('object')
    @observable
    supportedTokensImages: { [symbol: string]: [string, number] } = {}

    @observable supportedTokensForUnifiedWallet = []
    @observable selectedToken = null
    @observable eosTokens = [] // all the possible tokens we support

    balances = observable.map<string, string>()
    supply = observable.map<
        string,
        {
            chain_id: string
            token_contract: string
            symbol: string
            supply: number
        }
    >()
    dailyEstimate = observable.map<string, string>()

    @observable authStore: AuthStore

    constructor(rootStore: RootStore) {
        this.authStore = rootStore.authStore
    }

    setTokens = tokens => {
        this.eosTokens = tokens.map(token => ({
            label: `${token.name} (${token.account})`,
            name: token.name,
            value: token.account,
            symbol: token.symbol,
        }))
    }

    /**
     * Returns the token from supportedTokensForUnifiedWallet
     */
    tokenFromSupportedUIDWallet = (value: string) => {
        return this.supportedTokensForUnifiedWallet.find(token => token.value === value)
    }

    /**
     * Returns the token from supportedTokensForUnifiedWallet
     */
    tokenFromAllAvailableTokens = (value: string) => {
        return this.eosTokens.find(token => token.value === value)
    }

    @computed get supportedTokensAsSelectable() {
        return this.supportedTokensForUnifiedWallet.map(token => ({
            value: token.value,
            label: token.label,
        }))
    }

    getSupportedTokensForUnifiedWallet = () => {
        try {
            nsdb.getSupportedTokensForUnifiedWallet().then(async data => {
                this.setDepositTokenOptions(data)
                this.refreshAllBalances()
                this.updateTokenImages(data)
            })
        } catch (error) {
            throw error
        }
    }

    @task.resolved
    @action.bound
    async refreshAllBalances() {
        try {
            await this.supportedTokensForUnifiedWallet.map(async datum => {
                await this.fetchBalanceForSelectedToken(datum)
                await this.fetchTokenSupply()
                this.calculateDailyEstimate()
            })
        } catch (error) {
            throw error
        }
    }

    fetchTokenSupply = async () => {
        try {
            this.supply.replace(await eos.getTotalSupplyAsync())
        } catch (error) {
            return error
        }
    }

    // https://github.com/Novusphere/discussions-app/issues/270#issuecomment-601426400
    calculateDailyEstimate = async () => {
        this.balances.forEach((balance, symbol) => {
            if (symbol !== 'ATMOS') return
            this.dailyEstimate.set(
                symbol,
                ((Number(balance) / this.supply.get(symbol).supply) * 2740).toFixed(
                    this.supportedTokensImages[symbol][1]
                )
            )
        })
    }

    fetchBalanceForSelectedToken = async (token = this.selectedToken) => {
        try {
            let symbol, chain, contract

            if (!token.hasOwnProperty('symbol')) {
                symbol = token.label
                chain = token.chain
                contract = token.contract
            } else {
                symbol = token.symbol
                chain = token.p2k.chain
                contract = token.p2k.contract
            }

            let balance = await eos.getBalance(this.authStore.uidwWalletPubKey, chain, contract)

            if (!balance.length) {
                return
            }

            this.balances.set(symbol, balance[0].amount)
        } catch (error) {
            return error
        }
    }

    setDepositTokenOptions = (depositTokens: ApiGetUnifiedId) => {
        let tokens = []

        this.supportedTokensForUnifiedWallet = depositTokens.map(token => {
            tokens.push(token.symbol)

            return {
                label: token.symbol,
                value: token.contract,
                contract: token.p2k.contract,
                chain: token.p2k.chain,
                decimals: token.precision,
                fee: token.fee,
                min: token.min,
            }
        })

        this.selectedToken = this.supportedTokensForUnifiedWallet[0]

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('supp_tokens', tokens.join('|'))
        }
    }

    updateTokenImages = depositTokens => {
        depositTokens.map(token => {
            if (
                !this.supportedTokensImages ||
                !this.supportedTokensImages.hasOwnProperty(token.symbol)
            ) {
                let logo

                if (!eos.tokens) return

                const tokenFromList = eos.tokens.find(t => t.name === token.symbol)

                if (tokenFromList) {
                    logo = tokenFromList.logo
                }

                this.supportedTokensImages = {
                    ...this.supportedTokensImages,
                    [token.symbol]: [logo, token.precision],
                }
            }
        })
    }
}
