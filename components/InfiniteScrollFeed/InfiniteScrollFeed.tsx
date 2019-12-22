import * as React from 'react'
import { observer, inject } from 'mobx-react'
import InfiniteScroll from 'react-infinite-scroll-component'

import './style.scss'
import { PostPreview } from '@components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { TagModel } from '@models/tagModel'
import { IStores } from '@stores'

interface IInfiniteScrollFeedOuterProps {
    dataLength: number
    hasMore: boolean
    next: () => void
    posts: any[]

    withAnchorUid?: boolean
    tagModel?: TagModel
}

interface IInfiniteScrollFeedState {}

interface IInfiniteScrollFeedInnerProps {
    tagStore: IStores['tagStore']
    settingsStore: IStores['settingsStore']
    userStore: IStores['userStore']
}

@inject('tagStore', 'settingsStore', 'userStore')
@observer
class InfiniteScrollFeed extends React.Component<
    IInfiniteScrollFeedOuterProps & IInfiniteScrollFeedInnerProps,
    IInfiniteScrollFeedState
> {
    private renderEndMessage = () => {
        return (
            <div className={'bg-white tc pa3'}>
                <span className={'f6'}>You have reached the end!</span>
            </div>
        )
    }

    private renderLoadingMessage = () => {
        return (
            <div className={'bg-white tc pa3'}>
                <FontAwesomeIcon width={13} icon={faSpinner} spin />
            </div>
        )
    }

    public render() {
        const {
            dataLength,
            hasMore,
            next,
            posts,
            tagModel,
            withAnchorUid,
            children,
            tagStore: { tags },
            settingsStore: { blockedContentSetting },
            userStore: { blockedPosts, blockedUsers },
        } = this.props

        return (
            <InfiniteScroll
                dataLength={dataLength}
                next={next}
                hasMore={hasMore}
                loader={this.renderLoadingMessage()}
                endMessage={this.renderEndMessage()}
            >
                {!children
                    ? posts.map(post => {
                          return (
                              <PostPreview
                                  post={post as any}
                                  key={post.uuid}
                                  tag={
                                      typeof tagModel !== 'undefined'
                                          ? tagModel
                                          : tags.get(post.sub)
                                  }
                                  voteHandler={post.vote}
                                  blockedContentSetting={blockedContentSetting}
                                  blockedPosts={blockedPosts}
                                  blockedUsers={blockedUsers}
                                  {...(withAnchorUid && { notificationUuid: post.uuid })}
                              />
                          )
                      })
                    : children}
            </InfiniteScroll>
        )
    }
}

export default InfiniteScrollFeed as React.ComponentClass<IInfiniteScrollFeedOuterProps>
