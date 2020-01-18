import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { CopyToClipboard, Form, TagDropdown, UserNameWithIcon } from '@components'
import { IStores } from '@stores'
import classNames from 'classnames'
import './style.scss'
import { getIdenticon } from '@utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSpinner, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Link from 'next/link'
import { NextRouter, withRouter } from 'next/router'
import _ from 'lodash'

interface ISettings {
    settingsStore: IStores['settingsStore']
    postsStore: IStores['postsStore']
    uiStore: IStores['uiStore']
    userStore: IStores['userStore']
    tagStore: IStores['tagStore']
    authStore: IStores['authStore']
    router: NextRouter

    setting: string
    side?: string
}

// TODO: Real Data

interface ISettingsState {
    activeSidebar: string
    enteredUserForModeration: string
    tokens: {
        activeIndex: number
    }
}

@(withRouter as any)
@inject('settingsStore', 'postsStore', 'uiStore', 'userStore', 'tagStore', 'authStore')
@observer
class Settings extends React.Component<ISettings, ISettingsState> {
    static async getInitialProps({ store, query }) {
        const uiStore: IStores['uiStore'] = store.uiStore
        const tagStore: IStores['tagStore'] = store.tagStore
        const setting = query.setting

        let side = ''

        if (query.hasOwnProperty('side')) {
            side = query.side
        }

        uiStore.toggleSidebarStatus(false)
        tagStore.destroyActiveTag()

        return {
            setting: setting.toLowerCase(),
            side,
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            enteredUserForModeration: '',
            activeSidebar: props.setting,
            tokens: {
                activeIndex: Number(props.side),
            },
        }
    }

    componentDidUpdate(
        prevProps: Readonly<ISettings>,
        prevState: Readonly<ISettingsState>,
        snapshot?: any
    ): void {
        if (this.props.setting !== prevProps.setting) {
            this.setLinkAsActive(this.props.setting)
        }
    }

    setLinkAsActive = link => {
        let lowerCaseLink = link.toLowerCase()

        this.props.router.replace('/settings/[setting]', `/settings/${link}`, {
            shallow: true,
        })

        if (lowerCaseLink.indexOf('?') !== -1) {
            lowerCaseLink = lowerCaseLink.split('?')[0]
        }

        this.setState({
            activeSidebar: lowerCaseLink,
        })
    }

    componentWillUnmount(): void {
        this.props.settingsStore.thresholdTxID = ''
        this.props.settingsStore.errorMessage = ''
    }

    private renderSidebarContent = () => {
        const { balances, refreshAllBalances } = this.props.authStore

        return (
            <>
                <span className={'b black f5'}>Settings</span>
                <ul className={'list ph2 mt3'}>
                    {[
                        {
                            name: 'connections',
                        },
                        {
                            name: 'wallet',
                        },
                        {
                            name: 'moderation',
                        },
                        {
                            name: 'airdrop',
                        },
                        {
                            name: 'blocked',
                        },
                    ].map(link => (
                        <li
                            onClick={() => this.setLinkAsActive(link.name)}
                            className={classNames([
                                'ph3 dim pv2 pointer',
                                {
                                    'sidebar-link-active': this.state.activeSidebar === link.name,
                                },
                            ])}
                            key={link.name}
                        >
                            <span>{_.upperFirst(link.name)}</span>
                        </li>
                    ))}
                </ul>
                <span className={'b black f5 flex flex-row justify-between'}>
                    <span>Balances</span>
                    {refreshAllBalances['pending'] && (
                        <FontAwesomeIcon width={13} icon={faSpinner} spin />
                    )}
                    {!refreshAllBalances['pending'] && (
                        <span
                            className={'pointer dim'}
                            title={'Refresh'}
                            onClick={refreshAllBalances}
                        >
                            <FontAwesomeIcon icon={faSyncAlt} width={13} />
                        </span>
                    )}
                </span>
                <ul className={'list ph2 mt3'}>
                    {Array.from(balances).map(([symbol, amount]) => (
                        <div key={symbol} className={'mt3 f6 flex flex-row justify-between'}>
                            <span>{symbol}</span>
                            <span>{amount}</span>
                        </div>
                    ))}
                </ul>
            </>
        )
    }

    private renderConnections = () => {
        const {
            hasEOSWalletAccount,
            connectScatterWallet,
            disconnectScatterWallet,
            displayName: { scatter: scatterDisplayName },
        } = this.props.authStore

        return (
            <>
                <div className={'mt3'}>
                    <div
                        className={
                            'flex flex-row justify-between items-center pv3' // bb b--light-gray
                        }
                    >
                        <span className={'flex flex-column tl mr4'}>
                            <span className={'b black f5 pb2'}>EOS Wallet</span>
                            <span className={'f6 lh-copy'}>
                                You can connect your EOS wallets to Discussions App.
                            </span>
                        </span>

                        {!hasEOSWalletAccount && (
                            <span className={'flex flex-row tr'}>
                                <span
                                    className={'green f6 pointer dim pr2'}
                                    onClick={connectScatterWallet}
                                >
                                    (connect)
                                </span>
                                {connectScatterWallet['pending'] && (
                                    <FontAwesomeIcon width={13} icon={faSpinner} spin />
                                )}
                            </span>
                        )}

                        {hasEOSWalletAccount && (
                            <span className={'flex flex-column tr'}>
                                <span className={'black b f6 pb2'}>{scatterDisplayName}</span>
                                <span
                                    className={'red f6 pointer dim'}
                                    onClick={disconnectScatterWallet}
                                >
                                    (disconnect)
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </>
        )
    }

    private handleDeleteUserToModeration = user => {
        this.props.userStore.setModerationMemberByTag(user)
    }

    private renderModeration = () => {
        const { getPlausibleTagOptions } = this.props.postsStore
        const {
            activeDelegatedTagMembers,
            activeDelegatedTag,
            setActiveDelegatedTag,
            setModerationMemberByTag,
        } = this.props.userStore

        return (
            <>
                <div className={'mt3'}>
                    <TagDropdown
                        formatCreateLabel={inputValue => `Choose a tag`}
                        onChange={setActiveDelegatedTag}
                        value={activeDelegatedTag}
                        options={getPlausibleTagOptions}
                    />
                    <div className={'outline-container mt3'}>
                        <div className={'flex flex-column space-between'}>
                            <div className={'mb3'}>
                                {!activeDelegatedTagMembers.length && (
                                    <span className={'mv3 db moon-gray f6 w-100 tc'}>
                                        There are no moderators for this tag.
                                    </span>
                                )}
                                {activeDelegatedTagMembers.slice().map(item => {
                                    const [name, key, tag] = item.split(':')

                                    return (
                                        <span
                                            className={
                                                'flex items-center justify-between pv3 ph2 bb b--light-gray'
                                            }
                                            key={item}
                                        >
                                            <UserNameWithIcon
                                                imageData={getIdenticon(key)}
                                                name={name}
                                                pub={key}
                                            />
                                            <span
                                                onClick={() =>
                                                    this.handleDeleteUserToModeration(
                                                        `${name}:${key}`
                                                    )
                                                }
                                                title={'Remove user from moderation'}
                                            >
                                                <FontAwesomeIcon
                                                    width={13}
                                                    icon={faMinusCircle}
                                                    className={'pointer dim'}
                                                    color={'red'}
                                                />
                                            </span>
                                        </span>
                                    )
                                })}
                            </div>
                            {/*<div*/}
                            {/*    className={*/}
                            {/*        'field-container mb2 relative flex-auto flex items-center'*/}
                            {/*    }*/}
                            {/*>*/}
                            {/*    <input*/}
                            {/*        value={this.state.enteredUserForModeration}*/}
                            {/*        disabled={setModerationMemberByTag['pending']}*/}
                            {/*        onChange={this.handleUserOnChange}*/}
                            {/*        className={'w-100'}*/}
                            {/*        placeholder={'Enter a user'}*/}
                            {/*    />*/}
                            {/*    <span*/}
                            {/*        onClick={this.handleAddUserToModeration}*/}
                            {/*        className={'plus-icon absolute dim pointer'}*/}
                            {/*    >*/}
                            {/*        {setModerationMemberByTag['pending'] ? (*/}
                            {/*            <FontAwesomeIcon width={13} icon={faSpinner} spin />*/}
                            {/*        ) : (*/}
                            {/*            <FontAwesomeIcon*/}
                            {/*                width={13}*/}
                            {/*                icon={faPlus}*/}
                            {/*                title={'Click to add a user'}*/}
                            {/*            />*/}
                            {/*        )}*/}
                            {/*    </span>*/}
                            {/*</div>*/}
                            {/*{setModerationMemberByTag['rejected'] && (*/}
                            {/*    <span className={'error f6 pv2'}>*/}
                            {/*        {setModerationMemberByTag['error']['message']}*/}
                            {/*    </span>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    private renderAirdrop = () => {
        const {
            airdropForm,
            recipientCount,
            thresholdTxID,
            errorMessage,
        } = this.props.settingsStore

        return (
            <>
                <Form form={airdropForm} hideSubmitButton className={'relative'}>
                    <span className={'b absolute rc-container'}>Recipients: {recipientCount}</span>
                </Form>
                {thresholdTxID && (
                    <span className={'w-100 flex items-center justify-end'}>
                        <a
                            target={'_blank'}
                            href={`https://eosq.app/tx/${thresholdTxID}`}
                            className={'pt3 b f6 success'}
                        >
                            Success! Your transaction has been submitted, click here to view!
                        </a>
                    </span>
                )}
                {errorMessage && (
                    <span className={'w-100 red flex items-center justify-end'}>
                        {errorMessage}
                    </span>
                )}
            </>
        )
    }

    private setTokenTab = index => {
        this.setState({ tokens: { activeIndex: index } })
        this.setLinkAsActive(`${this.state.activeSidebar}?side=${index}`)
    }

    private renderTokens = () => {
        const { activeIndex } = this.state.tokens
        const { selectedToken, hasAccount } = this.props.authStore
        const {
            depositsForm,
            withdrawalForm,
            transferForm,
            loadingStates: { transferring, withdrawing },
        } = this.props.settingsStore

        if (!hasAccount) return <div className={'db'}>Please login to continue.</div>

        return (
            <>
                <Tabs selectedIndex={activeIndex} onSelect={this.setTokenTab}>
                    <TabList className={'settings-tabs'}>
                        <Tab className={'settings-tab'}>Deposit</Tab>
                        <Tab className={'settings-tab'}>Transfer</Tab>
                        <Tab className={'settings-tab'}>Withdrawal</Tab>
                    </TabList>

                    <TabPanel>
                        <div className={'flex flex-column items-center'}>
                            <div
                                className={
                                    'w-100 flex flex-column items-center outline-container pa4 mt3'
                                }
                            >
                                <Form className={'db w-100'} form={depositsForm} hideSubmitButton />

                                {selectedToken && (
                                    <div className={'mt3'}>
                                        <span className={'db lh-copy f6'}>
                                            Alternatively, to manually deposit funds from your
                                            wallet or an exchange please send them to
                                        </span>
                                        <div className={'mv3'}>
                                            <CopyToClipboard
                                                label={'Account'}
                                                value={selectedToken.contract}
                                            />
                                            <CopyToClipboard
                                                label={'Memo'}
                                                value={depositsForm.form.$('memoId').value}
                                            />
                                        </div>
                                        <span className={'db lh-copy f6'}>
                                            <strong>Please note:</strong> It's important you use
                                            this memo EXACTLY! If you are depositing from an
                                            exchange and cannot specify a memo then you must first
                                            withdraw to an EOS wallet of your own first!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={'flex flex-column items-center'}>
                            <div
                                className={
                                    'w-100 flex flex-column items-center outline-container pa4 mt3'
                                }
                            >
                                <Form
                                    className={'db w-100'}
                                    form={transferForm}
                                    hideSubmitButton
                                    loading={transferring}
                                />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={'flex flex-column items-center'}>
                            <div
                                className={
                                    'w-100 flex flex-column items-center outline-container pa4 mt3'
                                }
                            >
                                <Form
                                    className={'db w-100'}
                                    form={withdrawalForm}
                                    hideSubmitButton
                                    loading={withdrawing}
                                />
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </>
        )
    }

    private renderBlocked = () => {
        const { blockedPosts, blockedUsers } = this.props.userStore
        const { blockedSettingForm } = this.props.settingsStore

        const { tags } = this.props.tagStore
        const blockedPostsAsArray = Array.from(blockedPosts.keys())
        const blockedUsersAsArray = Array.from(blockedUsers.keys())

        return (
            <>
                <div className={'mb4 db'}>
                    <h3>Display Blocked Content</h3>
                    <span className={'silver f6'}>
                        Here you can set how you wish to view blocked content.
                    </span>
                    <Form form={blockedSettingForm} hideSubmitButton className={'mt3'} />
                </div>
                <hr />
                <h3>Users</h3>
                {!blockedUsersAsArray.length ? (
                    <span className={'moon-gray f6 i'}>You have no blocked users</span>
                ) : (
                    <div className={'outline-container mt3'}>
                        <div className={'flex flex-column space-between'}>
                            <div className={'mb3'}>
                                {blockedUsersAsArray.map((pub, index, array) => (
                                    <span
                                        className={classNames([
                                            'flex items-center justify-between ph2',
                                            {
                                                'bb b--light-gray pv3': index !== array.length - 1,
                                                pt3: index === array.length - 1,
                                            },
                                        ])}
                                        key={pub}
                                    >
                                        <UserNameWithIcon
                                            imageData={getIdenticon(pub)}
                                            name={blockedUsers.get(pub)}
                                            pub={pub}
                                        />
                                        <span
                                            onClick={() => blockedUsers.delete(pub)}
                                            title={'Unblock User'}
                                        >
                                            <FontAwesomeIcon
                                                width={13}
                                                icon={faMinusCircle}
                                                className={'pointer dim'}
                                                color={'red'}
                                            />
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <h3>Posts</h3>
                {!blockedPostsAsArray.length ? (
                    <span className={'moon-gray f6 i'}>You have no blocked posts</span>
                ) : (
                    <div className={'outline-container mt3'}>
                        <div className={'flex flex-column space-between'}>
                            <div className={'mb3'}>
                                {blockedPostsAsArray.map((url, index, array) => (
                                    <span
                                        className={classNames([
                                            'flex items-center justify-between ph2',
                                            {
                                                'bb b--light-gray pv3': index !== array.length - 1,
                                                pt3: index === array.length - 1,
                                            },
                                        ])}
                                        key={url}
                                    >
                                        <Link href={'/tag/[name]/[id]/[title]'} as={url}>
                                            <a className={'flex flex-row items-center'}>
                                                <img
                                                    className={'tag-icon pr2'}
                                                    src={tags.get(url.split('/')[2]).icon}
                                                />
                                                <span>{url}</span>
                                            </a>
                                        </Link>
                                        <span
                                            onClick={() => blockedPosts.delete(url)}
                                            title={'Unblock Post'}
                                        >
                                            <FontAwesomeIcon
                                                width={13}
                                                icon={faMinusCircle}
                                                className={'pointer dim'}
                                                color={'red'}
                                            />
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    private renderContent = () => {
        switch (this.state.activeSidebar) {
            default:
            case 'connections':
                return this.renderConnections()
            case 'moderation':
                return this.renderModeration()
            case 'airdrop':
                return this.renderAirdrop()
            case 'wallet':
                return this.renderTokens()
            case 'blocked':
                return this.renderBlocked()
        }
    }

    public render() {
        return (
            <div className={'flex flex-row relative'}>
                <div className={'card w-30 mr3 pa3'}>{this.renderSidebarContent()}</div>
                <div className={'card w-70 pa4'}>
                    <span className={'b black f4'}>{_.upperFirst(this.state.activeSidebar)}</span>
                    <div className={'mt3'}>{this.renderContent()}</div>
                </div>
            </div>
        )
    }
}

export default Settings
