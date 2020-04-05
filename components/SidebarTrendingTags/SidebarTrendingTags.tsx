import React, { FunctionComponent, useCallback, useEffect } from 'react'

import styles from './SidebarTrendingTags.module.scss'
import { Icon, Spin } from 'antd'
import { RootStore, useStores } from '@stores'
import { observer } from 'mobx-react-lite'
import { SidebarLinkPopup } from '@components'
import { Link } from 'react-router-dom'

interface ISidebarTrendingTagsProps {}

const SidebarTrendingTags: FunctionComponent<ISidebarTrendingTagsProps> = () => {
    const { tagStore, userStore, authStore }: RootStore = useStores()

    useEffect(() => {
        tagStore.fetchTrendingTags()
    }, [])

    const onSubscribe = useCallback(subscribed => {
        tagStore.addSubscribed(subscribed)
        if (authStore.hasAccount) {
            userStore.syncDataFromLocalToServer()
        }
    }, [])

    if (tagStore.fetchTrendingTags['pending']) {
        return <Spin />
    }

    return (
        <div className={'pa3 bg-white list card mb3'}>
            <span className={'f5 flex flex-row justify-between items-center'}>
                <span>
                    <Icon type="fire" theme="twoTone" twoToneColor={'#FF6300'} />
                    <span className={'ph2 orange'}>Trending Tags</span>
                </span>
                <Link to={'/communities'} className={'f7 o-50 pointer'}>
                    View All
                </Link>
            </span>

            <div className={'mt3'}>
                {tagStore.trendingTags.slice(0, 9).map(({ tag }, index) => {
                    const tagModel: any = tagStore.tagModelFromObservables(tag)

                    return (
                        <span key={tag} className={'f6 dark-gray db pb2'}>
                            <span className={styles.indexContainer}>
                                <span className={'gray f6 mr2'}>{index + 1}</span>
                                <Icon type="caret-up" theme="filled" style={{ color: '#19A974' }} />
                            </span>
                            <SidebarLinkPopup
                                subscribed={tag}
                                tag={tagModel}
                                onSubscribe={onSubscribe}
                            />
                            {/*<img className={'dib mr2'} src={logo} alt={`${tag} icon`} width={25} />*/}
                            {/*<Link to={`/tag/${tag}`}>#{tag}</Link>*/}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

SidebarTrendingTags.defaultProps = {}

export default observer(SidebarTrendingTags)
