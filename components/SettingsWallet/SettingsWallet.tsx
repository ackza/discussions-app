import { Button, Form, Input, InputNumber, Select, Tabs, Typography } from 'antd'
import cx from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
const { TabPane } = Tabs
import { Tab, TabList } from 'react-tabs'
import { RootStore, useStores } from '@stores'
import { eos } from '@novuspherejs'
import { getSignatureAndSubmit, openInNewTab } from '@utils'
import { useObserver } from 'mobx-react-lite'
import { MODAL_OPTIONS } from '@globals'
import ecc from 'eosjs-ecc'

const { Text } = Typography
const { Option } = Select

const UnwrappedDeposit = ({ form }) => {
    const { getFieldDecorator } = form
    const { authStore, walletStore, uiStore }: RootStore = useStores()

    let walletStoreLS = window.localStorage.getItem('walletStore')
    let images: any = []

    if (walletStoreLS) {
        walletStoreLS = JSON.parse(walletStoreLS)
        images = walletStoreLS['supportedTokensImages']
    }

    const [depositSubmitLoading, setDepositSubmitLoading] = useState(false)

    /**
     * Used so the component can get the current selected
     * token's decimals and fee object.
     *
     * By default it is null.
     */
    const [tokenVals, setTokenVals] = useState(null)

    const handleTokenChange = useCallback(val => {
        if (val) {
            setTokenVals(walletStore.tokenFromSupportedUIDWallet(val))
        } else {
            setTokenVals(null)
        }
    }, [])

    const handleDepositSubmit = useCallback(
        e => {
            e.preventDefault()
            form.validateFields(async (err, values) => {
                if (!err) {
                    setDepositSubmitLoading(true)
                    const { amount } = values
                    const { contract, decimals, label, value } = tokenVals

                    const transaction = {
                        account: value,
                        name: 'transfer',
                        data: {
                            from: authStore.eosWalletDisplayName,
                            to: contract,
                            quantity: `${Number(amount).toFixed(decimals)} ${label}`,
                            memo: authStore.uidwWalletPubKey,
                        },
                    }

                    try {
                        const transaction_id = await eos.transact(transaction)

                        if (typeof transaction_id === 'undefined') {
                            uiStore.showToast(
                                'Warning',
                                'Please re-connet your EOS wallet and try again',
                                'warning'
                            )
                            setDepositSubmitLoading(false)
                            return
                        }

                        uiStore.showToast(
                            'Success',
                            'Your deposit was successfully submitted',
                            'success',
                            {
                                btn: (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            openInNewTab(
                                                `https://bloks.io/transaction/${transaction_id}`
                                            )
                                        }
                                    >
                                        View transaction
                                    </Button>
                                ),
                            }
                        )

                        form.resetFields()
                        setDepositSubmitLoading(false)
                    } catch (error) {
                        let message = error.message || 'Deposit failed to submit'
                        uiStore.showToast('Failed', message, 'error')
                        setDepositSubmitLoading(false)
                        return error
                    }
                }
            })
        },
        [tokenVals]
    )

    return useObserver(() => (
        <div className={'ba b--light-gray pa3 br3'}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16, offset: 4 }}
                onSubmit={() => console.log('hey')}
                className={'center'}
            >
                <Form.Item label="Token">
                    {getFieldDecorator('token', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select a token',
                            },
                        ],
                    })(
                        <Select
                            size={'large'}
                            showSearch
                            className={'w-100'}
                            placeholder={'Select a token'}
                            onChange={handleTokenChange}
                        >
                            {walletStore.supportedTokensAsSelectable.map(option => {
                                return (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                        className={'flex flex-row items-center'}
                                    >
                                        {images[option.label] && (
                                            <img
                                                src={images[option.label][0]}
                                                className={'mr2 dib'}
                                                width={15}
                                            />
                                        )}
                                        {option.label}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Amount">
                    {getFieldDecorator('amount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            disabled={!tokenVals}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
            </Form>

            <div className={'mt3 flex flex-row justify-end'}>
                <Button
                    loading={depositSubmitLoading}
                    type={'primary'}
                    onClick={handleDepositSubmit}
                    disabled={!tokenVals}
                >
                    Submit Deposit
                </Button>
            </div>

            {walletStore.selectedToken && (
                <div className={'mt5 tc'}>
                    <span className={'light-silver f6'}>
                        Alternatively, to manually deposit funds from your wallet or an exchange
                        please send them to
                    </span>

                    <div className={'center db mw6 mv4'}>
                        <div className={'flex flex-row items-center justify-between mb3'}>
                            <span className={'f6 b'}>Account</span>
                            <Text ellipsis copyable mark>
                                {walletStore.selectedToken.contract}
                            </Text>
                        </div>

                        <div className={'flex flex-row items-center justify-between mb3'}>
                            <span className={'f6 b'}>Memo</span>
                            <Text ellipsis copyable mark>
                                {authStore.uidwWalletPubKey}
                            </Text>
                        </div>
                    </div>
                </div>
            )}

            <div className={'mt3 tc'}>
                <span className={'light-silver f6'}>
                    <strong>Please note:</strong> It's important you use this memo EXACTLY! If you
                    are depositing from an exchange and cannot specify a memo then you must first
                    withdraw to an EOS wallet of your own first!
                </span>
            </div>
        </div>
    ))
}

const Deposit = Form.create({ name: 'depositForm' })(UnwrappedDeposit)

const UnwrappedTransfer = ({ form }) => {
    const { getFieldDecorator } = form
    const { authStore, walletStore, uiStore }: RootStore = useStores()

    let walletStoreLS = window.localStorage.getItem('walletStore')
    let images: any = []

    if (walletStoreLS) {
        walletStoreLS = JSON.parse(walletStoreLS)
        images = walletStoreLS['supportedTokensImages']
    }

    const [transferSubmitLoading, setTransferSubmitLoading] = useState(false)

    /**
     * Used so the component can get the current selected
     * token's decimals and fee object.
     *
     * By default it is null.
     */
    const [tokenVals, setTokenVals] = useState(null)

    const handleTransferSubmit = useCallback(
        e => {
            e.preventDefault()
            form.validateFields(async (err, values) => {
                if (!err) {
                    setTransferSubmitLoading(true)
                    const { amount, fee, finalAmount, to, memo } = values
                    const { chain, decimals, label } = tokenVals

                    // set the active modal
                    uiStore.setActiveModal(MODAL_OPTIONS.walletActionPasswordReentry)

                    authStore.setTEMPTransfers([
                        {
                            symbol: label,
                            token: {
                                label,
                                decimals,
                            },
                            chain,
                            to,
                            username: null,
                            amount: `${Number(amount).toFixed(decimals)} ${label}`,
                            fee: `${Number(fee).toFixed(decimals)} ${label}`,
                            nonce: new Date().getTime(),
                            memo: memo || '',
                        },
                    ])

                    // now wait for user submission
                    const int = setInterval(async () => {
                        if (uiStore.activeModal === MODAL_OPTIONS.none) {
                            setTransferSubmitLoading(false)
                            uiStore.showToast('Failed', 'User cancelled transaction', 'error')
                            clearInterval(int)
                            return
                        }

                        const { TEMP_WalletPrivateKey } = authStore

                        if (TEMP_WalletPrivateKey) {
                            setTransferSubmitLoading(false)
                            uiStore.clearActiveModal()
                            clearInterval(int)

                            try {
                                // continue with the rest of the transaction
                                const walletPrivateKey = `${TEMP_WalletPrivateKey}`
                                authStore.clearTEMPVariables()

                                const robj = {
                                    chain: parseInt(String(chain)),
                                    from: ecc.privateToPublic(walletPrivateKey),
                                    to: to,
                                    amount: `${Number(amount).toFixed(decimals)} ${label}`,
                                    fee: `${Number(fee).toFixed(decimals)} ${label}`,
                                    nonce: new Date().getTime(),
                                    memo: memo || '',
                                    sig: '',
                                }

                                const data = await getSignatureAndSubmit(robj, walletPrivateKey)

                                if (data.error) {
                                    setTransferSubmitLoading(false)
                                    uiStore.showToast('Failed', data.message, 'error')
                                    return
                                }

                                const { transaction_id } = data

                                uiStore.showToast(
                                    'Success',
                                    'Your transfer was successfully submitted',
                                    'success',
                                    {
                                        btn: (
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    openInNewTab(
                                                        `https://bloks.io/transaction/${transaction_id}`
                                                    )
                                                }
                                            >
                                                View transaction
                                            </Button>
                                        ),
                                    }
                                )

                                form.resetFields()
                                setTransferSubmitLoading(false)
                                walletStore.fetchBalanceForSelectedToken(label)
                            } catch (error) {
                                setTransferSubmitLoading(false)
                                let message = error.message || 'Transfer failed to submit'
                                uiStore.showToast('Failed', message, 'error')
                                return error
                            }
                        }
                    }, 250)
                }
            })
        },
        [tokenVals]
    )

    const handleTokenChange = useCallback(val => {
        if (val) {
            setTokenVals(walletStore.tokenFromSupportedUIDWallet(val))
        } else {
            setTokenVals(null)
        }
    }, [])

    const handleAmountChange = useCallback(
        (initialAmount: number) => {
            if (typeof initialAmount !== 'number' || !initialAmount) return

            const {
                fee: { percent, flat },
                decimals,
            } = tokenVals

            const fee = initialAmount * percent + flat
            const finalAmount = initialAmount + fee

            form.setFieldsValue({
                fee: Number(fee.toFixed(decimals)),
                finalAmount: Number(finalAmount.toFixed(decimals)),
            })
        },
        [tokenVals]
    )

    const handleFinalAmountChange = useCallback(
        (finalAmount: number) => {
            if (typeof finalAmount !== 'number' || !finalAmount) return

            const {
                fee: { percent, flat },
                decimals,
            } = tokenVals

            const fee = finalAmount * percent + flat
            const initialAmount = finalAmount - fee

            form.setFieldsValue({
                fee: Number(fee.toFixed(decimals)),
                amount: Number(initialAmount.toFixed(decimals)),
            })
        },
        [tokenVals]
    )

    return useObserver(() => (
        <div className={'ba b--light-gray pa3 br3'}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16, offset: 4 }}
                onSubmit={() => console.log('hey')}
                className={'center'}
            >
                <Form.Item label="Token">
                    {getFieldDecorator('token', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select a token',
                            },
                        ],
                    })(
                        <Select
                            size={'large'}
                            showSearch
                            className={'w-100'}
                            placeholder={'Select a token'}
                            onChange={handleTokenChange}
                        >
                            {walletStore.supportedTokensAsSelectable.map(option => {
                                return (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                        className={'flex flex-row items-center'}
                                    >
                                        {images[option.label] && (
                                            <img
                                                src={images[option.label][0]}
                                                className={'mr2 dib'}
                                                width={15}
                                            />
                                        )}
                                        {option.label}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Amount">
                    {getFieldDecorator('amount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            placeholder={
                                tokenVals ? `Min ${tokenVals.min} ${tokenVals.label}` : null
                            }
                            min={tokenVals ? tokenVals.min : 0}
                            disabled={!tokenVals}
                            onChange={handleAmountChange}
                            size={'large'}
                            step={tokenVals ? tokenVals.fee.percent : 0.001}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Fee">
                    {getFieldDecorator('fee')(
                        <InputNumber readOnly size={'large'} style={{ width: '100%' }} />
                    )}
                </Form.Item>
                <Form.Item label="Final Amount">
                    {getFieldDecorator('finalAmount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            min={tokenVals ? tokenVals.min : 0}
                            onChange={handleFinalAmountChange}
                            disabled={!tokenVals}
                            step={tokenVals ? tokenVals.fee.percent : 0.001}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="To">
                    {getFieldDecorator('to', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an address',
                            },
                        ],
                    })(
                        <Input
                            disabled={!tokenVals}
                            placeholder={
                                'i.e. EOS6UNfkgYbuvD8JJfbmkqy89tjCc75RMEByKsRzwHBuHTwFFPmtE'
                            }
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Memo">
                    {getFieldDecorator('memo')(
                        <Input disabled={!tokenVals} size={'large'} style={{ width: '100%' }} />
                    )}
                </Form.Item>
            </Form>

            <div className={'mt3 flex flex-row justify-end'}>
                <Button
                    type={'primary'}
                    onClick={handleTransferSubmit}
                    disabled={!tokenVals}
                    loading={transferSubmitLoading}
                >
                    Submit Transfer
                </Button>
            </div>
        </div>
    ))
}

const Transfer = Form.create({ name: 'transferForm' })(UnwrappedTransfer)

const UnwrappedWithdrawal = ({ form }) => {
    const { getFieldDecorator } = form
    const { authStore, walletStore, uiStore }: RootStore = useStores()

    let walletStoreLS = window.localStorage.getItem('walletStore')
    let images: any = []

    if (walletStoreLS) {
        walletStoreLS = JSON.parse(walletStoreLS)
        images = walletStoreLS['supportedTokensImages']
    }

    const [withdrawalSubmitLoading, setWithdrawalSubmitLoading] = useState(false)

    /**
     * Used so the component can get the current selected
     * token's decimals and fee object.
     *
     * By default it is null.
     */
    const [tokenVals, setTokenVals] = useState(null)

    const handleWithdrawalSubmit = useCallback(
        e => {
            e.preventDefault()
            form.validateFields(async (err, values) => {
                if (!err) {
                    setWithdrawalSubmitLoading(true)
                    const { amount, fee, finalAmount, to, memo } = values
                    const { chain, decimals, label } = tokenVals

                    // set the active modal
                    uiStore.setActiveModal(MODAL_OPTIONS.walletActionPasswordReentry)

                    authStore.setTEMPTransfers([
                        {
                            symbol: label,
                            token: {
                                label,
                                decimals,
                            },
                            chain,
                            to: null,
                            username: to,
                            amount: `${Number(amount).toFixed(decimals)} ${label}`,
                            fee: `${Number(fee).toFixed(decimals)} ${label}`,
                            nonce: new Date().getTime(),
                            memo: memo || '',
                        },
                    ])

                    // now wait for user submission
                    const int = setInterval(async () => {
                        if (uiStore.activeModal === MODAL_OPTIONS.none) {
                            setWithdrawalSubmitLoading(false)
                            uiStore.showToast('Failed', 'User cancelled transaction', 'error')
                            clearInterval(int)
                            return
                        }

                        const { TEMP_WalletPrivateKey } = authStore

                        if (TEMP_WalletPrivateKey) {
                            setWithdrawalSubmitLoading(false)
                            uiStore.clearActiveModal()
                            clearInterval(int)

                            try {
                                // continue with the rest of the transaction
                                const walletPrivateKey = `${TEMP_WalletPrivateKey}`
                                authStore.setTEMPPrivateKey('')

                                const robj = {
                                    chain: parseInt(String(chain)),
                                    from: ecc.privateToPublic(walletPrivateKey),
                                    to: 'EOS1111111111111111111111111111111114T1Anm', // special withdraw address
                                    amount: `${Number(amount).toFixed(decimals)} ${label}`,
                                    fee: `${Number(fee).toFixed(decimals)} ${label}`,
                                    nonce: new Date().getTime(),
                                    memo: `${to}:${memo || ''}`,
                                    sig: '',
                                }

                                const data = await getSignatureAndSubmit(robj, walletPrivateKey)

                                if (data.error) {
                                    uiStore.showToast('Failed', data.message, 'error')
                                    setWithdrawalSubmitLoading(false)
                                    return
                                }

                                const { transaction_id } = data

                                uiStore.showToast(
                                    'Success',
                                    'Your withdrawal was successfully submitted',
                                    'success',
                                    {
                                        btn: (
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    openInNewTab(
                                                        `https://bloks.io/transaction/${transaction_id}`
                                                    )
                                                }
                                            >
                                                View transaction
                                            </Button>
                                        ),
                                    }
                                )

                                form.resetFields()
                                setWithdrawalSubmitLoading(false)
                                walletStore.fetchBalanceForSelectedToken(label)
                            } catch (error) {
                                setWithdrawalSubmitLoading(false)
                                let message = error.message || 'Transfer failed to submit'
                                uiStore.showToast('Failed', message, 'error')
                                return error
                            }
                        }
                    }, 250)
                }
            })
        },
        [tokenVals]
    )

    const handleTokenChange = useCallback(val => {
        if (val) {
            setTokenVals(walletStore.tokenFromSupportedUIDWallet(val))
        } else {
            setTokenVals(null)
        }
    }, [])

    const handleAmountChange = useCallback(
        (initialAmount: number) => {
            if (typeof initialAmount !== 'number' || !initialAmount) return

            const {
                fee: { percent, flat },
                decimals,
            } = tokenVals

            const fee = initialAmount * percent + flat
            const finalAmount = initialAmount + fee

            form.setFieldsValue({
                fee: Number(fee.toFixed(decimals)),
                finalAmount: Number(finalAmount.toFixed(decimals)),
            })
        },
        [tokenVals]
    )

    const handleFinalAmountChange = useCallback(
        (finalAmount: number) => {
            if (typeof finalAmount !== 'number' || !finalAmount) return

            const {
                fee: { percent, flat },
                decimals,
            } = tokenVals

            const fee = finalAmount * percent + flat
            const initialAmount = finalAmount - fee

            form.setFieldsValue({
                fee: Number(fee.toFixed(decimals)),
                amount: Number(initialAmount.toFixed(decimals)),
            })
        },
        [tokenVals]
    )

    return useObserver(() => (
        <div className={'ba b--light-gray pa3 br3'}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16, offset: 4 }}
                onSubmit={() => console.log('hey')}
                className={'center'}
            >
                <Form.Item label="Token">
                    {getFieldDecorator('token', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select a token',
                            },
                        ],
                    })(
                        <Select
                            size={'large'}
                            showSearch
                            className={'w-100'}
                            placeholder={'Select a token'}
                            onChange={handleTokenChange}
                        >
                            {walletStore.supportedTokensAsSelectable.map(option => {
                                return (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                        className={'flex flex-row items-center'}
                                    >
                                        {images[option.label] && (
                                            <img
                                                src={images[option.label][0]}
                                                className={'mr2 dib'}
                                                width={15}
                                            />
                                        )}
                                        {option.label}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Amount">
                    {getFieldDecorator('amount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            placeholder={
                                tokenVals ? `Min ${tokenVals.min} ${tokenVals.label}` : null
                            }
                            min={tokenVals ? tokenVals.min : 0}
                            disabled={!tokenVals}
                            onChange={handleAmountChange}
                            size={'large'}
                            step={tokenVals ? tokenVals.fee.percent : 0.001}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Fee">
                    {getFieldDecorator('fee')(
                        <InputNumber readOnly size={'large'} style={{ width: '100%' }} />
                    )}
                </Form.Item>
                <Form.Item label="Final Amount">
                    {getFieldDecorator('finalAmount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            min={tokenVals ? tokenVals.min : 0}
                            onChange={handleFinalAmountChange}
                            disabled={!tokenVals}
                            step={tokenVals ? tokenVals.fee.percent : 0.001}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="To">
                    {getFieldDecorator('to', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an EOS account name',
                            },
                        ],
                    })(
                        <Input
                            disabled={!tokenVals}
                            placeholder={'An EOS account name'}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Memo">
                    {getFieldDecorator('memo')(
                        <Input disabled={!tokenVals} size={'large'} style={{ width: '100%' }} />
                    )}
                </Form.Item>
            </Form>

            <div className={'mt3 flex flex-row justify-end'}>
                <Button
                    type={'primary'}
                    onClick={handleWithdrawalSubmit}
                    disabled={!tokenVals}
                    loading={withdrawalSubmitLoading}
                >
                    Submit Withdrawal
                </Button>
            </div>
        </div>
    ))
}

const Withdrawal = Form.create({ name: 'withdrawalForm' })(UnwrappedWithdrawal)

const UnwrappedAccountCreation = ({ form }) => {
    const { getFieldDecorator } = form
    const { authStore, walletStore, uiStore }: RootStore = useStores()

    let walletStoreLS = window.localStorage.getItem('walletStore')
    let images: any = []

    if (walletStoreLS) {
        walletStoreLS = JSON.parse(walletStoreLS)
        images = walletStoreLS['supportedTokensImages']
    }

    const [withdrawalSubmitLoading, setWithdrawalSubmitLoading] = useState(false)

    /**
     * Used so the component can get the current selected
     * token's decimals and fee object.
     *
     * By default it is null.
     */
    const [tokenVals, setTokenVals] = useState(null)
    const [tempWalletKey, setTempKey] = useState(null)
    const [isSubmitting, setSubmitting] = useState(false)
    const [showTempWalletKey, setShowStatus] = useState(false)

    useEffect(() => {
        const val = 'eosio.token'

        form.setFields({
            token: {
                value: val,
            },
        })

        setTokenVals(walletStore.tokenFromSupportedUIDWallet(val))
        setAmount(0.5)
    }, [tokenVals])

    const getTempWalletKey = () => {
        const int = setInterval(async () => {
            if (uiStore.activeModal === MODAL_OPTIONS.none) {
                setWithdrawalSubmitLoading(false)
                uiStore.showToast('Failed', 'User cancelled transaction', 'error')
                clearInterval(int)
                setTempKey(null)
            }

            const { TEMP_WalletPrivateKey } = authStore

            if (TEMP_WalletPrivateKey) {
                clearInterval(int)
                setTempKey(TEMP_WalletPrivateKey)
            }
        }, 250)
    }

    const handleShowPrivateKey = useCallback(() => {
        setShowStatus(true)
        uiStore.setActiveModal(MODAL_OPTIONS.walletActionPasswordReentry)
        getTempWalletKey()
    }, [tempWalletKey, showTempWalletKey])

    useEffect(() => {
        if (tempWalletKey) {
            if (!isSubmitting && showTempWalletKey) {
                form.setFields({
                    privateKey: {
                        value: tempWalletKey,
                    },
                })
            } else {
                submitAccountCreation()
            }

            uiStore.clearActiveModal()
            authStore.clearTEMPVariables()
        }
    }, [isSubmitting, tempWalletKey, showTempWalletKey])

    const submitAccountCreation = () => {
        form.validateFields(async (err, values) => {
            if (!err) {
                setWithdrawalSubmitLoading(true)
                const { amount, fee, accountName, publicKey } = values
                const { chain, decimals, label } = tokenVals
                const memo = `${accountName}-${publicKey}` || ''

                if (accountName.length !== 12) {
                    form.setFields({
                        accountName: {
                            errors: [
                                new Error(
                                    'Please make sure the account name is exactly 12 characters long'
                                ),
                            ],
                        },
                    })
                    setWithdrawalSubmitLoading(false)
                    return
                }

                if (/[^(a-z|1-5)]/g.test(accountName)) {
                    form.setFields({
                        accountName: {
                            errors: [
                                new Error(
                                    'Please make sure the account name is all lower case letters and only contains numbers 1 through 5.'
                                ),
                            ],
                        },
                    })
                    setWithdrawalSubmitLoading(false)
                    return
                }

                authStore.setTEMPTransfers([
                    {
                        symbol: label,
                        token: {
                            label,
                            decimals,
                        },
                        chain,
                        to: null,
                        username: accountName,
                        amount: `${Number(amount).toFixed(decimals)} ${label}`,
                        fee: `${Number(fee).toFixed(decimals)} ${label}`,
                        nonce: new Date().getTime(),
                        memo: memo,
                    },
                ])

                if (tempWalletKey) {
                    console.log(tempWalletKey)

                    setWithdrawalSubmitLoading(false)
                    uiStore.clearActiveModal()
                    authStore.clearTEMPVariables()

                    try {
                        // continue with the rest of the transaction
                        authStore.setTEMPPrivateKey('')

                        const robj = {
                            chain: parseInt(String(chain)),
                            from: ecc.privateToPublic(tempWalletKey),
                            to: 'EOS1111111111111111111111111111111114T1Anm', // special withdraw address
                            amount: `${Number(amount).toFixed(decimals)} ${label}`,
                            fee: `${Number(fee).toFixed(decimals)} ${label}`,
                            nonce: new Date().getTime(),
                            memo: `signupeoseos:${memo || ''}`,
                            sig: '',
                        }

                        const data = await getSignatureAndSubmit(robj, tempWalletKey)

                        if (data.error) {
                            uiStore.showToast('Failed', data.message, 'error')
                            setWithdrawalSubmitLoading(false)
                            return
                        }

                        const { transaction_id } = data

                        uiStore.showToast(
                            'Success',
                            'Your account creation was successfully submitted',
                            'success',
                            {
                                btn: (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            openInNewTab(
                                                `https://bloks.io/transaction/${transaction_id}`
                                            )
                                        }
                                    >
                                        View transaction
                                    </Button>
                                ),
                            }
                        )

                        form.resetFields()
                        walletStore.fetchBalanceForSelectedToken(label)
                    } catch (error) {
                        let message = error.message || 'Transfer failed to submit'
                        uiStore.showToast('Failed', message, 'error')
                        return error
                    } finally {
                        setSubmitting(false)
                        setWithdrawalSubmitLoading(false)
                    }
                } else {
                    // set the active modal
                    uiStore.setActiveModal(MODAL_OPTIONS.walletActionPasswordReentry)
                    getTempWalletKey()
                }
            }
        })
    }

    const handleAccountCreationSubmit = useCallback(
        e => {
            e.preventDefault()
            submitAccountCreation()
        },
        [tokenVals, tempWalletKey]
    )

    const handleTokenChange = useCallback(val => {
        if (val) {
            setTokenVals(walletStore.tokenFromSupportedUIDWallet(val))
        } else {
            setTokenVals(null)
        }
    }, [])

    const setAmount = initialAmount => {
        if (tokenVals) {
            if (typeof initialAmount !== 'number' || !initialAmount) return

            const {
                fee: { percent, flat },
                decimals,
            } = tokenVals

            const fee = initialAmount * percent + flat

            form.setFieldsValue({
                amount: initialAmount,
                fee: Number(fee.toFixed(decimals)),
            })
        }
    }

    const handleAmountChange = useCallback(
        (initialAmount: number) => {
            setAmount(initialAmount)
        },
        [tokenVals]
    )

    return useObserver(() => (
        <div className={'ba b--light-gray pa3 br3'}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16, offset: 4 }}
                onSubmit={() => console.log('hey')}
                className={'center'}
            >
                <Form.Item label="Token">
                    {getFieldDecorator('token', {
                        // initialValue: walletStore.supportedTokensAsSelectable.filter(option => option.label === 'EOS'),
                        rules: [
                            {
                                required: true,
                                message: 'Please select a token',
                            },
                        ],
                    })(
                        <Select
                            disabled
                            size={'large'}
                            showSearch
                            className={'w-100'}
                            placeholder={'Select a token'}
                            onChange={handleTokenChange}
                        >
                            {walletStore.supportedTokensAsSelectable.map(option => {
                                return (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                        className={'flex flex-row items-center'}
                                    >
                                        {images[option.label] && (
                                            <img
                                                src={images[option.label][0]}
                                                className={'mr2 dib'}
                                                width={15}
                                            />
                                        )}
                                        {option.label}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Amount">
                    {getFieldDecorator('amount', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an amount',
                            },
                        ],
                    })(
                        <InputNumber
                            disabled
                            placeholder={
                                tokenVals ? `Min ${tokenVals.min} ${tokenVals.label}` : null
                            }
                            min={tokenVals ? tokenVals.min : 0}
                            onChange={handleAmountChange}
                            size={'large'}
                            step={tokenVals ? tokenVals.fee.percent : 0.001}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Fee">
                    {getFieldDecorator('fee')(
                        <InputNumber disabled size={'large'} style={{ width: '100%' }} />
                    )}
                </Form.Item>
                <Form.Item label="Account Name">
                    {getFieldDecorator('accountName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter an EOS account name',
                            },
                        ],
                    })(
                        <Input
                            placeholder={'An EOS account name'}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                    <p className={'f6 silver lh-copy pt1'}>
                        EOS account name should be 12 characters long, all lowercase (a-z) and can
                        only contain numbers 1-5.
                    </p>
                </Form.Item>
                <Form.Item label="Public Key">
                    {getFieldDecorator('publicKey', {
                        initialValue: authStore.uidwWalletPubKey,
                        rules: [
                            {
                                required: true,
                                message: 'Please enter a valid EOS public key',
                            },
                        ],
                    })(
                        <Input
                            placeholder={'A valid EOS public key'}
                            size={'large'}
                            style={{ width: '100%' }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Private Key">
                    {tempWalletKey && showTempWalletKey ? (
                        getFieldDecorator('privateKey')(
                            <Input
                                defaultValue={tempWalletKey}
                                disabled={true}
                                size={'large'}
                                style={{ width: '100%' }}
                            />
                        )
                    ) : (
                        <Button type={'danger'} onClick={handleShowPrivateKey}>
                            Reveal Private Key
                        </Button>
                    )}
                </Form.Item>
            </Form>

            <div className="mt3 tc">
                <span className="light-silver f6">
                    <strong>Please note:</strong> The fee is used to pay for initial EOS resources
                    (RAM, CPU, NET) and any excess from the fee will be forwarded to the your newly
                    created EOS account. No commission is taken by Discussions for account creation.
                </span>
            </div>

            <div className={'mt3 flex flex-row justify-end'}>
                <Button
                    type={'primary'}
                    onClick={e => {
                        setSubmitting(true)
                        handleAccountCreationSubmit(e)
                    }}
                    disabled={!tokenVals}
                    loading={withdrawalSubmitLoading}
                >
                    Submit
                </Button>
            </div>
        </div>
    ))
}

const AccountCreation = Form.create({ name: 'accountCreationForm' })(UnwrappedAccountCreation)

const Wallet = () => {
    return (
        <>
            <div className={'db'}>
                <Tabs
                    defaultActiveKey={'1'}
                    renderTabBar={props => {
                        return (
                            <TabList
                                className={
                                    'list ma0 pa0 flex flex-row items-center justify-stretch card mb3 mh1'
                                }
                            >
                                {props['panels'].map(panel => (
                                    <Tab
                                        key={panel.key}
                                        className={cx([
                                            'w-100 bg-white pa3 tc b pointer',
                                            {
                                                'bg-primary white':
                                                    props['activeKey'] === panel.key,
                                            },
                                        ])}
                                        {...panel.props}
                                        onClick={e => props.onTabClick(panel.key, e)}
                                    >
                                        {panel.props.tab}
                                    </Tab>
                                ))}
                            </TabList>
                        )
                    }}
                >
                    <TabPane tab="Deposit" key="1">
                        <Deposit />
                    </TabPane>
                    <TabPane tab="Withdrawal" key="3">
                        <Withdrawal />
                    </TabPane>
                    <TabPane tab="Account Creation" key="4">
                        <AccountCreation />
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

export default Wallet
