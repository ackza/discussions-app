import React, { FunctionComponent } from 'react'

import styles from './UserBalances.module.scss'
import { RootStore, useStores } from '@stores'
import { observer } from 'mobx-react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

interface IUserBalancesProps {
    className?: string
}

const UserBalances: FunctionComponent<IUserBalancesProps> = ({ className }) => {
    const { walletStore, authStore }: RootStore = useStores()

    if (!authStore.hasAccount) {
        return (
            <span className={cx([className, 'mt3 ph4 db f6 light-silver'])}>
                Please sign in to view your balances
            </span>
        )
    }

    let walletStoreLS = window.localStorage.getItem('walletStore')
    let images: any = []

    if (walletStoreLS) {
        walletStoreLS = JSON.parse(walletStoreLS)
        images = walletStoreLS['supportedTokensImages']
    }

    const balances = walletStore.balances.toJSON()

    if (!balances || !Object.keys(balances).length) {
        return (
            <span className={cx('mt3 ph4 db f6 light-silver', className)}>
                You have no balances
            </span>
        )
    }

    return (
        <div className={className}>
            {Object.keys(balances).map(symbol => (
                <Link
                    to={`/tag/${symbol}`}
                    key={symbol}
                    className={'flex flex-row items-center justify-between mt3'}
                    style={{ display: 'flex' }}
                >
                    <img
                        src={images[symbol][0]}
                        alt={`${symbol} image`}
                        className={'dib'}
                        width={25}
                    />
                    <span className={'ml3 tr dib flex flex-column justify-end'}>
                        <span>
                            {balances[symbol]} {symbol}
                        </span>
                        {walletStore.dailyEstimate.has(symbol) && (
                            <span className={'f7 silver'}>
                                Earning ~{walletStore.dailyEstimate.get(symbol)} {symbol}/day
                            </span>
                        )}
                    </span>
                </Link>
            ))}
        </div>
    )
}

UserBalances.defaultProps = {}

export default observer(UserBalances)
