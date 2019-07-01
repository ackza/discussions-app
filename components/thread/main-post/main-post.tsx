import * as React from 'react'
import { IPost } from '@stores/posts'
import { observer } from 'mobx-react'
import { Attachments, Votes } from '@components'
import { Link } from '@router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faReply,
    faUserCircle,
    faLink,
    faShare,
    faExclamationTriangle,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

interface IMainPost {
    openingPost: IPost
}

const MainPost: React.FC<IMainPost> = ({ openingPost }) => {
    return (
        <>
            <div className={'pb2'}>
                <Link route={`/e/${openingPost.sub}`}>
                    <a className="f6 link dim br2 ph3 pv2 dib white bg-green mr2">
                        <FontAwesomeIcon icon={faArrowLeft} className={'pr1'} />
                        {`e/${openingPost.sub}`}
                    </a>
                </Link>
            </div>
            <div className={'opening-post'}>
                <div className={'post-content'}>
                    <div className={'meta pb2'}>
                        <Link route={`/e/${openingPost.sub}`}>
                            <a>
                                <span className={'b'}>{openingPost.sub}</span>
                            </a>
                        </Link>
                        <span className={'ph1 b'}>&#183;</span>
                        <Link route={`/u/${openingPost.poster}`}>
                            <a>
                                <FontAwesomeIcon icon={faUserCircle} className={'pr1'} />
                                <span>{openingPost.poster}</span>
                            </a>
                        </Link>
                        <span className={'ph1 b'}>&#183;</span>
                        <span> {moment(openingPost.createdAt).fromNow()}</span>
                    </div>

                    <div className={'flex justify-between items-center pb1'}>
                        <span className={'black f4 b'}>{openingPost.title}</span>
                        <Votes votes={openingPost.votes} />
                    </div>

                    <span className={'black f6 lh-copy'}>{openingPost.content}</span>

                    <Attachments attachment={openingPost.attachment} />

                    <div className={'footer flex items-center pt3'}>
                        <button className={'reply mr3'}>
                            <FontAwesomeIcon icon={faReply} className={'pr1'} />
                            reply
                        </button>

                        <FontAwesomeIcon icon={faLink} className={'pr2 black f6'} />
                        <FontAwesomeIcon icon={faShare} className={'pr2 black f6'} />

                        <span className={'f6 black f6'}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={'pr1'} />
                            mark as spam
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default observer(MainPost)