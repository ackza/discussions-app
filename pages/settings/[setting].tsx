import React, { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import { observer, useObserver } from 'mobx-react-lite'
import { RootStore, useStores } from '@stores'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import _ from 'lodash'
import {
    Form,
    Icon,
    Input,
    Tabs,
    Button,
    Typography,
    Select,
    InputNumber,
    Switch,
    Divider,
    List,
    Avatar,
    Table,
} from 'antd'
const { Text } = Typography
const { TabPane } = Tabs
import { Tab, TabList } from 'react-tabs'
import { eos } from '@novuspherejs'
import { checkIfNameIsValid, getIdenticon, getSignatureAndSubmit, openInNewTab } from '@utils'
import { MODAL_OPTIONS } from '@globals'
import ecc from 'eosjs-ecc'
import { UserBalances } from '@components'
const { TextArea } = Input
const { Option } = Select
import mapSeries from 'async/mapSeries'
import axios from 'axios'
import fileDownload from 'js-file-download'

const Connections = () => {
    const { authStore }: RootStore = useStores()

    return (
        <>
            <div className={'flex flex-row items-center justify-between'}>
                <span className={'db'}>
                    <span className={'db b black f6'}>EOS Wallet</span>
                    <span className={'db gray f6'}>
                        You can connect your EOS wallets to Discussions App.
                    </span>
                </span>
                <span
                    className={'db primary pointer'}
                    onClick={() => authStore.connectScatterWallet(authStore.hasEOSWallet)}
                >
                    {useObserver(() => (
                        <>
                            {!authStore.connectScatterWallet['pending'] ? (
                                authStore.hasEOSWallet ? (
                                    '(disconnect)'
                                ) : (
                                    '(connect)'
                                )
                            ) : (
                                <Icon type="loading" />
                            )}
                        </>
                    ))}
                </span>
            </div>
        </>
    )
}

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
                                authStore.setTEMPPrivateKey('')

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
                    <TabPane tab="Transfer" key="2">
                        <Transfer />
                    </TabPane>
                    <TabPane tab="Withdrawal" key="3">
                        <Withdrawal />
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

const Blocked = () => {
    const { userStore, tagStore, settingStore }: RootStore = useStores()

    const handleHiddenOnChange = useCallback(val => {
        if (val) {
            settingStore.setBlockedContent('hidden')
        } else {
            settingStore.setBlockedContent('collapsed')
        }
    }, [])

    const handleCollapsedOnChange = useCallback(val => {
        if (val) {
            settingStore.setBlockedContent('collapsed')
        } else {
            settingStore.setBlockedContent('hidden')
        }
    }, [])

    return useObserver(() => (
        <>
            <span className={'f6 gray'}>
                Here you can set how you wish to view blocked content.
            </span>
            <div className={'mt4'}>
                <div className={'flex flex-row items-center justify-between mb4'}>
                    <span className={'f6'}>
                        <span className={'b db'}>Hidden</span>
                        <span className={'db silver'}>
                            Hide blocked content entirely including all replies.
                        </span>
                    </span>
                    <Switch
                        checked={settingStore.blockedContentSetting === 'hidden'}
                        onChange={handleHiddenOnChange}
                    />
                </div>
                <div className={'flex flex-row items-center justify-between mb4'}>
                    <span className={'f6'}>
                        <span className={'b db'}>Collapse</span>
                        <span className={'db silver'}>
                            Auto-Collapse all blocked content, with the ability to expand the post.
                        </span>
                    </span>
                    <Switch
                        checked={settingStore.blockedContentSetting === 'collapsed'}
                        onChange={handleCollapsedOnChange}
                    />
                </div>
                <div className={'flex flex-row items-center justify-between mb4'}>
                    <span className={'f6'}>
                        <span className={'b db'}>Hide Unsigned Posts</span>
                        <span className={'db silver'}>
                            If a post has no signature, hide it with the above settings.
                        </span>
                    </span>
                    <Switch
                        checked={settingStore.unsignedPostsIsSpam}
                        onChange={settingStore.toggleUnsignedPostsIsSpam}
                    />
                </div>
            </div>
            <Divider />
            <div className={'mt4'}>
                <span className={'f4 b black db mb3'}>Users</span>
                <List
                    locale={{
                        emptyText: <span>You have no blocked users</span>,
                    }}
                    itemLayout="horizontal"
                    dataSource={[...userStore.blockedUsers.toJS()]}
                    renderItem={([keys, name]) => (
                        <List.Item
                            actions={[
                                <Button
                                    size={'small'}
                                    type={'danger'}
                                    key={'unblock'}
                                    onClick={() => userStore.toggleBlockUser(name, keys)}
                                >
                                    unblock
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={getIdenticon(keys)} size={'large'} />}
                                title={
                                    <Link href={`/u/[username]`} as={`/u/${name}-${keys}`}>
                                        <a>{name}</a>
                                    </Link>
                                }
                                description={<Text ellipsis>{keys}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <div className={'mt4'}>
                <span className={'f4 b black db mb3'}>Posts</span>
                <List
                    locale={{
                        emptyText: <span>You have no blocked posts</span>,
                    }}
                    itemLayout="horizontal"
                    dataSource={[...userStore.blockedPosts.toJS()]}
                    renderItem={([path, date]) => {
                        const [, tagName] = path.split('/')
                        const tag = tagStore.tagModelFromObservables(tagName)
                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        size={'small'}
                                        type={'danger'}
                                        key={'unblock'}
                                        onClick={() => userStore.toggleBlockPost(path)}
                                    >
                                        unblock
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={tag.logo} size={'large'} />}
                                    title={
                                        <Link href={'/tag/[name]/[id]/[title]'} as={path}>
                                            {path}
                                        </Link>
                                    }
                                />
                            </List.Item>
                        )
                    }}
                />
            </div>
        </>
    ))
}

const Moderation = () => {
    const { userStore, tagStore }: RootStore = useStores()

    const dataSource = useObserver(() =>
        [...userStore.delegated.toJS()].map(([delegated, date]) => {
            const [name, key, tag] = delegated.split(':')
            return {
                key: delegated,
                name: name,
                tag: tag,
                uidw: key,
            }
        })
    )

    const columns = [
        {
            title: 'Display Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => {
                return (
                    <>
                        <Avatar src={getIdenticon(record.uidw)} />
                        <span className={'ml3'}>
                            <Link href={`/u/[username]`} as={`/u/${name}-${record.uidw}`}>
                                <a>{name}</a>
                            </Link>
                        </span>
                    </>
                )
            },
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
            render: (tag, record) => {
                const tagModel = tagStore.tagModelFromObservables(tag)
                return (
                    <>
                        <Avatar src={tagModel.logo} />
                        <span className={'ml3'}>
                            <Link href={'/tag/[name]'} as={`/tag/${tag}`}>
                                <a>#{tag}</a>
                            </Link>
                        </span>
                    </>
                )
            },
        },
        {
            key: 'action',
            render: (text, record) => (
                <>
                    <Button
                        size={'small'}
                        type={'danger'}
                        key={'unblock'}
                        onClick={() =>
                            userStore.setModerationMemberByTag(
                                `${record.name}:${record.uidw}`,
                                record.tag
                            )
                        }
                    >
                        remove
                    </Button>
                </>
            ),
        },
    ]

    return useObserver(() => (
        <>
            <span className={'f6 gray'}>Here you can set the moderators you have delegated.</span>
            <Table pagination={false} dataSource={dataSource} columns={columns} className={'mt4'} />
        </>
    ))
}

const UnwrappedAirdrop = ({ form }) => {
    const { getFieldDecorator } = form
    const { authStore, walletStore, uiStore }: RootStore = useStores()

    const [airdropSubmitLoading, setAirdropSubmitLoading] = useState(false)
    const [downloadAirdropSubmitLoading, setDownloadAirdropSubmitLoading] = useState(false)

    /**
     * Used so the component can get the current selected
     * token's decimals and fee object.
     *
     * By default it is null.
     */
    const [tokenVals, setTokenVals] = useState(null)

    const handleTokenChange = useCallback(val => {
        if (val) {
            setTokenVals(walletStore.tokenFromAllAvailableTokens(val))
        } else {
            setTokenVals(null)
        }
    }, [])

    // validate names and show in the UI which account you are validating (numerical)
    const [totalNumberOfAccountsToValidate, setTotalNumberOfAccountsToValidate] = useState(0)
    const [currentIndexDuringAccountValidation, setCurrentIndexDuringAccountValidation] = useState(
        0
    )
    const [areAllAccountsValid, setAreAllAccountsValid] = useState(false)

    const clearStates = () => {
        setAirdropSubmitLoading(false)
        setDownloadAirdropSubmitLoading(false)
        setAreAllAccountsValid(false)
        setTotalNumberOfAccountsToValidate(0)
        setCurrentIndexDuringAccountValidation(0)
    }

    const methodicallyGetAirdropFormValues = async ({
        token,
        results,
        accountNamesAsArray,
        amount,
        triggerP2k,
        value,
        symbol,
        values,
    }) => {
        /**
         * Check if results have invalid names
         * results = string[]
         */
        if (results.length > 0 || results.length < accountNamesAsArray.length) {
            clearStates()
            return form.setFields({
                accountNames: {
                    value: accountNamesAsArray.join(),
                    errors: [
                        new Error(
                            `Invalid account names:\n\n ${results.join(
                                '\n'
                            )}.\n\n Ensure you are entering valid EOS usernames or public keys.`
                        ),
                    ],
                },
            })
        }

        values.token = walletStore.tokenFromAllAvailableTokens(token)

        // no invalid account names, continue
        const precision = await eos.getTokenPrecision(values.token.value, values.token.name)
        const amountAsString = amount.toFixed(precision)
        const actor = authStore.displayName

        values.amount = Number(amountAsString).toFixed(precision)
        values.actor = actor

        if (triggerP2k) {
            const token = walletStore.supportedTokensForUnifiedWallet.find(
                q => q.label === values.token.symbol
            )

            if (!token) {
                return form.setFields({
                    token: {
                        value: token,
                        errors: [
                            new Error(`Token ${symbol} does not support public key transfers!`),
                        ],
                    },
                })
            }

            values.p2k = token
        }

        return values
    }

    /**
     * @param {Event} e
     * @param {type} 'airdrop' | 'downloadAirdrop'
     */
    const handleAirdropSubmit = useCallback(
        (e, type = 'airdrop') => {
            e.preventDefault()
            form.validateFields(async (err, values) => {
                if (!err) {
                    if (type === 'airdrop') {
                        setAirdropSubmitLoading(true)
                    } else {
                        setDownloadAirdropSubmitLoading(true)
                    }

                    const { token, amount, accountNames } = values
                    const { value, symbol } = tokenVals

                    // validate account names or addresses
                    const accountNamesAsArray = accountNames.match(/[^\,\;\n\s]+/gi)

                    // set the initial amount
                    setTotalNumberOfAccountsToValidate(accountNamesAsArray.length)

                    let triggerP2k = false

                    mapSeries(
                        accountNamesAsArray,
                        (accountName, cb) => {
                            setCurrentIndexDuringAccountValidation(prevState => prevState + 1)
                            checkIfNameIsValid(accountName)
                                .then(isValidAccountName => {
                                    // we don't set anything in cb() because we only care for invalid names
                                    if (Array.isArray(isValidAccountName)) {
                                        triggerP2k = true
                                        return cb()
                                    }

                                    return cb()
                                })
                                .catch(err => {
                                    // return a resolved promise otherwise mapSeries will stop iteration
                                    return cb(null, err.message)
                                })
                        },
                        async (err, results) => {
                            const result = await methodicallyGetAirdropFormValues({
                                token,
                                results: results.filter(q => typeof q !== 'undefined'),
                                accountNamesAsArray,
                                amount,
                                triggerP2k,
                                value,
                                symbol,
                                values,
                            })

                            const message = 'Failed to detect EOS wallet'

                            if (result) {
                                // deal with download airdrop click
                                if (type === 'downloadAirdrop') {
                                    clearStates()

                                    try {
                                        const { data } = await axios.get('/api/writeFile', {
                                            params: result,
                                        })

                                        fileDownload(JSON.stringify(data), 'airdrop.json')
                                        uiStore.showToast(
                                            'Success',
                                            'Your airdrop file has been downloaded.',
                                            'success'
                                        )
                                        return
                                    } catch (error) {
                                        uiStore.showToast('Transaction Failed', message, 'error')
                                        return
                                    }
                                }

                                // we don't clear states because we need the UI to hide the # of accs being validated
                                setTotalNumberOfAccountsToValidate(0)
                                setCurrentIndexDuringAccountValidation(0)
                                setAreAllAccountsValid(true)

                                const actions = []

                                // check if user has EOS wallet account
                                // https://github.com/Novusphere/discussions-app/issues/102

                                if (!authStore.hasEOSWallet) {
                                    await eos.logout()
                                    await eos.detectWallet()
                                    await eos.login()
                                }

                                if (typeof eos.auth !== 'undefined') {
                                    // iteratee order not required
                                    accountNamesAsArray.map(async recipient => {
                                        const isRecipientAPublicKey = ecc.isValidPublic(recipient)

                                        if (values.hasOwnProperty('p2k') && isRecipientAPublicKey) {
                                            actions.push({
                                                account: result.token.value,
                                                name: 'transfer',
                                                data: {
                                                    from: eos.auth.accountName,
                                                    to: result.p2k.contract,
                                                    quantity: `${result.amount} ${result.token.symbol}`,
                                                    memo: recipient,
                                                },
                                            })
                                        } else {
                                            actions.push({
                                                account: result.token.value,
                                                name: 'transfer',
                                                data: {
                                                    from: eos.auth.accountName,
                                                    to: recipient,
                                                    quantity: `${result.amount} ${result.token.symbol}`,
                                                    memo: result.memoId,
                                                },
                                            })
                                        }
                                    })

                                    try {
                                        const transaction_id = await eos.transact(actions)
                                        clearStates()

                                        uiStore.showToast(
                                            'Transaction Success',
                                            'Your transaction was successfully submitted!',
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
                                    } catch (error) {
                                        uiStore.showToast(
                                            'Transaction Failed',
                                            error.message || message,
                                            'error'
                                        )
                                        clearStates()
                                    }
                                } else {
                                    uiStore.showToast('Transaction Failed', message, 'error')
                                    clearStates()
                                    return
                                }
                            }
                        }
                    )
                }
            })
        },
        [tokenVals]
    )

    return (
        <>
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
                            {walletStore.eosTokens.map(option => {
                                return (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                        className={'flex flex-row items-center'}
                                    >
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
                <Form.Item
                    label="Account Names"
                    extra={
                        'Enter alphanumeric account names (that can also contain a period) followed by a comma, a space or a line break.'
                    }
                >
                    {getFieldDecorator('accountNames', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter at least one valid account name',
                            },
                        ],
                    })(<TextArea disabled={!tokenVals} rows={4} />)}
                </Form.Item>
                <Form.Item label="Memo ID">
                    {getFieldDecorator('memoId', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter a memo ID',
                            },
                        ],
                    })(<Input disabled={!tokenVals} size={'large'} style={{ width: '100%' }} />)}
                </Form.Item>
            </Form>

            <div className={'mt3 flex flex-row items-center justify-between'}>
                <span>
                    {totalNumberOfAccountsToValidate > 0 && (
                        <span className={'f6 gray'}>
                            Currently validating: {currentIndexDuringAccountValidation} /{' '}
                            {totalNumberOfAccountsToValidate} accounts
                        </span>
                    )}
                    {areAllAccountsValid && (
                        <span className={'f6 green'}>
                            All accounts are valid, continuing with transaction.
                        </span>
                    )}
                </span>
                <span>
                    <Button
                        type={'primary'}
                        onClick={e => handleAirdropSubmit(e, 'downloadAirdrop')}
                        disabled={!tokenVals || airdropSubmitLoading}
                        loading={downloadAirdropSubmitLoading}
                    >
                        Download Airdrop
                    </Button>
                    <Button
                        type={'primary'}
                        onClick={e => handleAirdropSubmit(e, 'airdrop')}
                        disabled={!tokenVals || downloadAirdropSubmitLoading}
                        loading={airdropSubmitLoading}
                        className={'ml2'}
                    >
                        Airdrop
                    </Button>
                </span>
            </div>
        </>
    )
}

const Airdrop = Form.create({ name: 'airdropForm' })(UnwrappedAirdrop)

const Setting = dynamic(
    () =>
        Promise.resolve(({ page }: any) => {
            switch (page) {
                case 'connections':
                    return <Connections />
                case 'wallet':
                    return <Wallet />
                case 'blocked':
                    return <Blocked />
                case 'moderation':
                    return <Moderation />
                case 'airdrop':
                    return <Airdrop />
                default:
                    return null
            }
        }),
    {
        ssr: false,
    }
)

const className = (current, page) =>
    cx([
        'f6 ph4 pv2 pointer dim',
        {
            'bg-near-white': current === page,
        },
    ])

const SettingsPage: NextPage<any> = ({ page }) => {
    const { uiStore, walletStore }: RootStore = useStores()

    useEffect(() => {
        uiStore.setSidebarHidden('true')

        return () => {
            uiStore.setSidebarHidden('false')
        }
    }, [])

    return (
        <div className={'flex flex-row'}>
            <div className={'w-30 vh-75 bg-white card'}>
                <div className={'db'}>
                    <span className={'db f6 b black ph4 pt4'}>Settings</span>

                    <ul className={'list pa0 ma0 mt3'}>
                        <Link
                            href={'/settings/[setting]'}
                            as={'/settings/connections'}
                            replace={true}
                        >
                            <a className={'gray'}>
                                <li className={className(page, 'connections')}>Connections</li>
                            </a>
                        </Link>

                        <Link href={'/settings/[setting]'} as={'/settings/wallet'} replace={true}>
                            <a className={'gray'}>
                                <li className={className(page, 'wallet')}>Wallet </li>
                            </a>
                        </Link>

                        <Link
                            href={'/settings/[setting]'}
                            as={'/settings/moderation'}
                            replace={true}
                        >
                            <a className={'gray'}>
                                <li className={className(page, 'moderation')}>Moderation</li>
                            </a>
                        </Link>

                        <Link href={'/settings/[setting]'} as={'/settings/airdrop'} replace={true}>
                            <a className={'gray'}>
                                <li className={className(page, 'airdrop')}>Airdrop </li>
                            </a>
                        </Link>

                        <Link href={'/settings/[setting]'} as={'/settings/blocked'} replace={true}>
                            <a className={'gray'}>
                                <li className={className(page, 'blocked')}>Blocked</li>
                            </a>
                        </Link>
                    </ul>
                </div>
                <div className={'db'}>
                    <span
                        className={
                            'db f6 b black ph4 pt4 flex flex-row justify-between items-center'
                        }
                    >
                        Balances{' '}
                        {!walletStore.refreshAllBalances['pending'] ? (
                            <Icon type="reload" onClick={walletStore.refreshAllBalances} />
                        ) : (
                            <Icon type="loading" />
                        )}
                    </span>

                    <UserBalances className={'ph4'} />
                </div>
            </div>
            <div className={'fl ml3 w-70 bg-white card pa4'}>
                <span className={'f4 b black db mb3'}>{_.startCase(page)}</span>
                <Setting page={page} />
            </div>
        </div>
    )
}

SettingsPage.getInitialProps = async function({ query }) {
    let page = query.setting as string

    if (['connections', 'wallet', 'moderation', 'airdrop', 'blocked'].indexOf(page) === -1) {
        page = 'connections'
    }

    return {
        page,
    }
}

export default observer(SettingsPage)
