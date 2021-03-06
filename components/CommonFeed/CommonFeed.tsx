import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'

import styles from './CommonFeed.module.scss'
import { Post } from '@novuspherejs'
import { RootStore, useStores } from '@stores'
import { Empty } from 'antd'
import { InfiniteScrollFeed, Sorter } from '@components'
import { observer } from 'mobx-react-lite'

interface ICommonFeedProps {
    onFetch: ({ sort, postPub }: { sort: string; postPub: string }) => void
    emptyDescription: string
    posts: Post[]
    dataLength: number
    cursorId: number | undefined
    tag?: string
    hideSort?: boolean
    preventRefetch?: boolean
}

const CommonFeed: FunctionComponent<ICommonFeedProps> = ({
    onFetch,
    emptyDescription,
    posts,
    dataLength,
    cursorId,
    tag,
    hideSort,
    preventRefetch,
}) => {
    const { authStore, postsStore, userStore }: RootStore = useStores()
    const [sort, setSort] = useState('popular')
    const postPub = useMemo(() => authStore.postPub, [])
    const resetAndFetch = () => {
        if (!preventRefetch) {
            userStore.updateFromActiveDelegatedMembers()
            postsStore.resetPostsAndPosition()
            onFetch({ sort, postPub })
        }
    }
    const onChange = useCallback(
        option => {
            setSort(option)
        },
        [sort]
    )

    useEffect(() => {
        resetAndFetch()
    }, [sort, tag, userStore])

    if (cursorId === 0 && !posts.length) {
        return <Empty description={emptyDescription} />
    }

    return (
        <>
            {!hideSort && <Sorter onChange={onChange} value={sort} />}
            <InfiniteScrollFeed
                withAnchorUid
                dataLength={dataLength}
                hasMore={cursorId !== 0}
                next={() => onFetch({ sort, postPub })}
                posts={posts}
            />
        </>
    )
}

CommonFeed.defaultProps = {
    hideSort: false,
}

export default observer(CommonFeed)
