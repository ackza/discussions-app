import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IStores } from '@stores'
import { InfiniteScrollFeed } from '@components'
import { sleep } from '@utils'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import Link from 'next/link'

interface INotificationsProps {
    notificationsStore: IStores['notificationsStore']
    tagStore: IStores['tagStore']
}

@inject('notificationsStore', 'tagStore')
@observer
class Notifications extends React.Component<INotificationsProps> {
    static async getInitialProps({ store }) {
        const uiStore: IStores['uiStore'] = store.uiStore
        const tagStore: IStores['tagStore'] = store.tagStore
        uiStore.toggleSidebarStatus(true)
        tagStore.destroyActiveTag()
        return {}
    }

    async componentDidMount(): Promise<void> {
        const {
            setTimeStamp,
            resetUnreadCount,
            fetchNotificationsAsFeed,
        } = this.props.notificationsStore

        await sleep(500)

        resetUnreadCount()
        setTimeStamp()

        await fetchNotificationsAsFeed()
    }

    private renderNotifications = () => {
        const {
            fetchNotificationsAsFeed,
            postsPosition,
            notifications,
        } = this.props.notificationsStore

        return (
            <InfiniteScrollFeed
                dataLength={notifications.length}
                hasMore={postsPosition.cursorId !== 0}
                next={fetchNotificationsAsFeed}
                posts={notifications}
                withAnchorUid
            >
                {notifications.map(notification => (
                    <Link
                        href={'/tag/[name]/[id]/[title]'}
                        as={notification.url}
                        key={notification.post.uuid}
                    >
                        <a className={'db card pa4'} title={'Click to go to post'}>
                            <span className={'flex flex-row items-center justify-start f5 tl'}>
                                {notification.image}
                                <span className={'f6 b flex mb2 black'}>{notification.title}</span>
                            </span>
                            {notification.isMentionType && (
                                <object>
                                    <ReactMarkdown
                                        className={'black flex notifications-content'}
                                        source={notification.post.content}
                                    />
                                </object>
                            )}
                            {!notification.isMentionType && (
                                <span className={'black flex notifications-content'}>
                                    {notification.content}
                                </span>
                            )}
                            <span
                                className={'f7 black tl flex mt3'}
                                title={moment(notification.modelCreatedAt).toLocaleString()}
                            >
                                {moment(notification.modelCreatedAt).fromNow()}
                            </span>
                        </a>
                    </Link>
                ))}
            </InfiniteScrollFeed>
        )
    }

    public render(): React.ReactNode {
        return (
            <>
                <div className={'card pa4 mb3'}>
                    <span className={'black f5'}>Viewing all your notifications</span>
                </div>

                {this.renderNotifications()}
            </>
        )
    }
}

export default Notifications
