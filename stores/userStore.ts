import { persist } from 'mobx-persist'
import { observable, when, computed, ObservableMap, reaction } from 'mobx'
import { RootStore } from '@stores/index'
import axios from 'axios'
import _ from 'lodash'
import { discussions, nsdb, Post } from '@novuspherejs'
import moment from 'moment'
import { getOrigin, removeMD, sleep } from '@utils'

export type BlockedContentSetting = 'hidden' | 'collapsed'

export class UserStore {
    @persist('map') following = observable.map<string, string>()
    @persist('map') watching = observable.map<string, [number, number]>() // [currentCount, prevCount]
    @persist('map') blockedUsers = observable.map<string, string>() // [pubKey, displayName]
    @persist('map') blockedPosts = observable.map<string, string>() // [asPathURL, yyyydd]
    @persist('map') delegated = observable.map<string, string>() // [name:pubKey:tagName, tagName]
    @persist('map') pinnedPosts = observable.map<string, string>() // [asPathURL, tagName]

    pinnedByDelegation = observable.map<string, string>() // [asPathURL, tagName] for delegated users
    blockedByDelegation = observable.map<string, string>() // either blockedUsers or blockedPosts

    @observable notificationCount = 0

    @persist
    @observable
    lastCheckedNotifications = 0

    @observable notifications: Post[] = []

    desktopNotifications = observable.map<number, Notification>()

    @persist
    @observable
    blockedContentSetting: BlockedContentSetting = 'collapsed'

    @persist
    @observable
    unsignedPostsIsSpam = true

    @observable private uiStore: RootStore['uiStore']
    @observable private tagStore: RootStore['tagStore']
    @observable private authStore: RootStore['authStore']

    @observable
    localStorageVersion = {
        following: 1586119165124,
        watching: 1583893581788,
        blockedUsers: 1586119165124,
        blockedPosts: 1586119165124,
        delegated: 1586119165124,
        pinnedPosts: 1583893581788,
    }

    @observable
    hasDataSyncedFromServer = false

    constructor(rootStore: RootStore) {
        this.uiStore = rootStore.uiStore
        this.tagStore = rootStore.tagStore
        this.authStore = rootStore.authStore

        reaction(
            () => this.authStore.hasAccount,
            hasAccount => {
                if (hasAccount) {
                    sleep(500).then(() => {
                        this.syncDataFromServerToLocal({
                            accountPrivKey: this.authStore.accountPrivKey,
                            accountPubKey: this.authStore.accountPubKey,
                        })
                    })
                } else {
                    this.resetUserStore()
                }
            }
        )
    }

    @computed get twitterUsername() {
        if (!this.authStore.socialAuthLinks.twitter) {
            return false
        }

        return this.authStore.socialAuthLinks.twitter.username
    }

    resetPostObservables = () => {
        this.following.replace([])
        this.watching.replace([])
        this.blockedUsers.replace([])
        this.blockedPosts.replace([])
        this.delegated.replace([])
        this.pinnedPosts.replace([])
        this.blockedByDelegation.replace([])
    }

    resetUserStore = () => {
        this.resetPostObservables()
        this.notificationCount = 0
        this.lastCheckedNotifications = 0
        this.notifications = []
        this.unsignedPostsIsSpam = true
        this.blockedContentSetting = 'hidden'
    }

    setBlockedContent = (type: BlockedContentSetting) => {
        this.blockedContentSetting = type
        this.syncDataFromLocalToServer()
    }

    toggleUnsignedPostsIsSpam = () => {
        this.unsignedPostsIsSpam = !this.unsignedPostsIsSpam
        this.syncDataFromLocalToServer()
    }

    private async setAndUpdateDelegatedPosts(
        mergedName: string,
        tagName: string,
        suppressAlert = false
    ) {
        if (!suppressAlert) {
            if (!tagName || tagName === '') {
                this.uiStore.showMessage(
                    'An empty tag string is not valid. Set this user as a global mod by setting the tag to be "all".',
                    'error'
                )
                return
            }
        }

        this.delegated.set(mergedName, tagName)

        if (!suppressAlert) {
            this.uiStore.showMessage('Added user as a moderator', 'success')
        }

        try {
            return await this.updateFromActiveDelegatedMembers()
        } catch (error) {
            return error
        }
    }

    /**
     * Input: USERNAME:KEY:TAG
     * Output: [tag]
     * @param username
     * @param pub
     */
    activeModerationForCurrentUser = (username: string, pub: string) => {
        if (!username || !pub) return []
        const vals = [...this.delegated.keys()]
        return vals
            .filter(val => val.indexOf(`${username}:${pub}`) !== -1)
            .map(val => val.split(':')[2])
    }

    async setPinnedPosts(posts: any[], delegated = false, sync = true) {
        _.forEach(posts, pinnedPosts => {
            const [url, tag] = pinnedPosts
            if (delegated) {
                if (!this.pinnedByDelegation.has(url)) {
                    this.pinnedByDelegation.set(url, tag)
                }
            } else {
                this.pinnedPosts.set(url, tag)
            }
        })

        if (sync) this.syncDataFromLocalToServer()
    }

    /**
     * Sync the data from delegated members
     */
    async updateFromActiveDelegatedMembers() {
        this.pinnedByDelegation.clear()
        this.blockedByDelegation.clear()

        try {
            return await Promise.all(
                [...this.delegated.keys()].map(async delegatedMember => {
                    const [, key] = delegatedMember.split(':')
                    const { data } = await axios.get(
                        `https://atmosdb.novusphere.io/discussions/moderation/${key}?domain=${getOrigin()}`
                    )

                    if (data.hasOwnProperty('moderation')) {
                        const blockedPosts = data['moderation']['blockedPosts']
                        const pinnedPosts = data['moderation']['pinnedPosts']
                        const blockedPostsKeys = Object.keys(blockedPosts)

                        if (pinnedPosts) {
                            this.setPinnedPosts(pinnedPosts, true, false)
                        }

                        if (blockedPostsKeys.length) {
                            blockedPostsKeys.forEach(datestamp => {
                                const blockedPostForDateStamp: string[] = blockedPosts[datestamp]
                                if (blockedPostForDateStamp.length) {
                                    blockedPostForDateStamp.forEach(blockedPost => {
                                        if (this.blockedByDelegation)
                                            this.blockedByDelegation.set(blockedPost, datestamp)
                                    })
                                }
                            })
                        }
                    }
                })
            )
        } catch (error) {
            throw error
        }
    }

    setModerationFromDropdown = async (username: string, key: string, tags: string[]) => {
        // use tags are source of truth for self-delegated
        const current = this.activeModerationForCurrentUser(username, key)
        const usernameWithKey = `${username}:${key}`

        if (tags.length > current.length) {
            // adding
            tags.map(tag => {
                this.delegated.set(`${usernameWithKey}:${tag}`, tag)
            })
        } else if (tags.length < current.length) {
            // remove diff
            const diff = _.difference(current, tags)
            diff.map(tag => {
                this.delegated.delete(`${usernameWithKey}:${tag}`)
            })
        }

        this.uiStore.showMessage('Moderation list updated', 'success')
        this.syncDataFromLocalToServer()
    }

    async setModerationMemberByTag(
        accountNameWithPubKey: string,
        tagName = '',
        suppressAlert = false,
        override = false
    ) {
        const mergedName = `${accountNameWithPubKey}:${tagName}`

        try {
            if (override) {
                return await this.setAndUpdateDelegatedPosts(mergedName, tagName, suppressAlert)
            }

            if (this.delegated.has(mergedName)) {
                if (this.delegated.get(mergedName) === tagName) {
                    this.delegated.delete(mergedName)

                    if (!suppressAlert) {
                        this.uiStore.showMessage('Removed user as a moderator', 'success')
                    }

                    this.updateFromActiveDelegatedMembers()
                } else {
                    await this.setAndUpdateDelegatedPosts(mergedName, tagName, suppressAlert)
                }
            } else {
                await this.setAndUpdateDelegatedPosts(mergedName, tagName, suppressAlert)
            }

            this.syncDataFromLocalToServer()
        } catch (error) {
            return error
        }
    }

    toggleUserFollowing = (user: string, pub: string) => {
        if (this.following.has(pub)) {
            this.following.delete(pub)
            this.uiStore.showMessage('This user has been unfollowed!', 'success')
        } else {
            this.following.set(pub, user)
            this.uiStore.showMessage('You are now following this user!', 'success')
        }

        this.syncDataFromLocalToServer()
    }

    /**
     * @param {string} asPathURL - i.e. /tag/test/1hx6xdq9iwehn/testt
     */
    toggleBlockPost = (asPathURL: string) => {
        if (asPathURL === '') return

        if (this.blockedPosts.has(asPathURL)) {
            this.blockedPosts.delete(asPathURL)
            this.uiStore.showMessage('This post has been unmarked as spam!', 'success')
        } else {
            const dateStamp = `${moment(Date.now()).format('YYYYMM')}`
            this.blockedPosts.set(asPathURL, dateStamp)
            this.uiStore.showMessage('This post has been marked as spam!', 'success')
        }

        this.syncDataFromLocalToServer()
    }

    toggleBlockUser = (displayName: string, pubKey: string) => {
        if (this.blockedUsers.has(pubKey)) {
            this.blockedUsers.delete(pubKey)
        } else {
            this.blockedUsers.set(pubKey, displayName)
        }

        this.syncDataFromLocalToServer()
    }

    toggleThreadWatch = (id: string, { post = null, suppressToast = false }) => {
        if (this.watching.has(id)) {
            this.watching.delete(id)
            this.syncDataFromLocalToServer()
            if (!suppressToast)
                this.uiStore.showMessage('You are no longer watching this thread', 'info')
            return
        }

        if (post && this.watching.size <= 99) {
            this.watching.set(id, {
                ...post,
                watchedAt: Date.now(),
            })
            if (!suppressToast)
                this.uiStore.showMessage('Success! You are watching this thread', 'success')
        } else {
            if (!suppressToast)
                this.uiStore.showMessage('You can only watch a maximum of 100 threads', 'info')
        }

        this.syncDataFromLocalToServer()
    }

    togglePinPost = (tagName: string, asPathURL: string) => {
        if (this.pinnedPosts.has(asPathURL)) {
            this.uiStore.showMessage('This post has been unpinned!', 'success')
            this.pinnedPosts.delete(asPathURL)
        } else {
            this.pinnedPosts.set(asPathURL, tagName)
            this.uiStore.showMessage('This post has been pinned!', 'success')

            this.pinnedPosts.set(asPathURL, tagName)
        }

        this.syncDataFromLocalToServer()
    }

    pingServerForData = () => {
        const authStore = JSON.parse(window.localStorage.getItem('authStore'))
        const data = {
            postPriv: authStore.postPriv,
            postPub: authStore.postPub,
            accountPrivKey: authStore.accountPrivKey,
            accountPubKey: authStore.accountPubKey,
        }

        if (data.postPub && data.postPriv && data.accountPubKey && data.accountPrivKey) {
            this.syncDataFromServerToLocal({
                accountPubKey: data.accountPubKey,
                accountPrivKey: data.accountPrivKey,
            }).then(() => {
                this.fetchNotifications(data.postPub)
            })
        }
    }

    /**
     * Syncing user data with the server
     */
    syncDataFromServerToLocal = async ({ accountPrivKey, accountPubKey }: any) => {
        try {
            if (!accountPrivKey || !accountPubKey) {
                // try to get from ls
                const authStore = window.localStorage.getItem('authStore')
                const parsed = JSON.parse(authStore)

                if (parsed['accountPrivKey']) {
                    accountPrivKey = parsed['accountPrivKey']
                } else {
                    this.uiStore.showToast(
                        'Unable to fetch your data',
                        'Seems like your session is corrupt. Please sign out and sign back in.',
                        'error'
                    )

                    return
                }
            }

            let data = await nsdb.getAccount({
                accountPrivateKey: accountPrivKey,
                accountPublicKey: accountPubKey,
            })

            if (!data) return

            if (data['auth']) {
                if (data['auth']['twitter']) {
                    this.authStore.socialAuthLinks.twitter = data['auth']['twitter']
                }
            }

            data = data['data']

            if (data) {
                if (!_.isNil(data['lastCheckedNotifications']))
                    this.lastCheckedNotifications = data['lastCheckedNotifications']

                if (!_.isNil(data['watching'])) this.watching.replace(data['watching'])

                if (!_.isNil(data['tags'])) {
                    this.tagStore.subscribed = data['tags'].map(tag => tag.trim())
                }

                if (!_.isNil(data['following']))
                    this.following.replace(
                        data['following'].map((obj: { pub: any; name: any }) => [obj.pub, obj.name])
                    )

                if (!_.isNil(data['moderation']['blockedPosts'])) {
                    const blockedPosts = data['moderation']['blockedPosts']

                    if (_.isNil(data['legacy'])) {
                        console.log('found legacy user, updating')
                        this.blockedPosts.replace({})
                    } else {
                        this.blockedPosts.replace(blockedPosts)
                    }
                }

                if (!_.isNil(data['moderation']['delegated'])) {
                    this.delegated.replace(data['moderation']['delegated'])
                    this.updateFromActiveDelegatedMembers()
                }

                if (!_.isNil(data['moderation']['blockedUsers']))
                    this.blockedUsers.replace(data['moderation']['blockedUsers'])

                if (!_.isNil(data['moderation']['pinnedPosts'])) {
                    const pinnedPosts = data['moderation']['pinnedPosts']

                    if (_.isNil(data['legacy'])) {
                        console.log('found legacy user, updating')
                        this.pinnedPosts.replace({})
                    } else {
                        this.pinnedPosts.replace(pinnedPosts)
                    }
                }

                if (!_.isNil(data['moderation']['unsignedPostsIsSpam']))
                    this.unsignedPostsIsSpam = data['moderation']['unsignedPostsIsSpam']

                if (!_.isNil(data['moderation']['blockedContentSetting']))
                    this.blockedContentSetting = data['moderation']['blockedContentSetting']

                /**
                 * Check localStorageVersion for comparison
                 * If version mismatch, reset users' local storage version
                 *
                 * This required to ensure we are able to reset LS when we change code or add features
                 * that affect LS, otherwise there should be a way to migrate.
                 */
                if (
                    typeof data['localStorageVersion'] === undefined ||
                    data['localStorageVersion'] !== this.localStorageVersion
                ) {
                    // find mismatch versions
                    const serverVersions = data['localStorageVersion']

                    if (_.isNil(serverVersions)) {
                        this.resetPostObservables()
                        this.syncDataFromLocalToServer()
                        this.hasDataSyncedFromServer = true
                        return
                    }

                    Object.keys(serverVersions).forEach(version => {
                        if (serverVersions[version] !== this.localStorageVersion[version]) {
                            if (this[version] && this[version] instanceof ObservableMap) {
                                console.log('clearing', version)
                                this[version].replace([])
                            }
                        }
                    })

                    this.syncDataFromLocalToServer()
                    this.hasDataSyncedFromServer = true
                    // exit out
                    return
                }
            }

            this.hasDataSyncedFromServer = true
        } catch (error) {
            console.error(
                `Unable to sync: We experienced some problems syncing your account data to your current browser`,
                error
            )
            return error
        }
    }

    /**
     * Sync the current data in LS to the server
     */
    syncDataFromLocalToServer = async () => {
        try {
            if (!this.hasDataSyncedFromServer) return

            const following = [...this.following.toJS()].map(([pub, name]) => ({
                pub,
                name,
            }))

            // we have to send the entire payload, not just the diff
            const {
                uidwWalletPubKey,
                accountPrivKey,
                accountPubKey,
                postPub,
                displayName,
            } = this.authStore

            const dataToSync = {
                localStorageVersion: this.localStorageVersion,
                uidw: uidwWalletPubKey,
                displayName: displayName,
                postPub: postPub,
                legacy: false, // override
                lastCheckedNotifications: this.lastCheckedNotifications,
                watching: [...this.watching.toJS()],
                following: following,
                tags: [...this.tagStore.subscribed],
                moderation: {
                    blockedPosts: [...this.blockedPosts.toJS()],
                    blockedUsers: [...this.blockedUsers.toJS()],
                    pinnedPosts: [...this.pinnedPosts.toJS()],
                    delegated: [...this.delegated.toJS()],
                    blockedContentSetting: this.blockedContentSetting,
                    unsignedPostsIsSpam: this.unsignedPostsIsSpam,
                },
            }

            if (!accountPubKey) {
                this.uiStore.showToast(
                    'Unable to save your data',
                    'Seems like your session is corrupt. Please sign out and sign back in.',
                    'error'
                )
            }

            await nsdb.saveAccount({
                accountPrivateKey: accountPrivKey,
                accountPublicKey: accountPubKey,
                accountData: dataToSync,
            })
        } catch (error) {
            console.error('ACCOUNT SYNC ERROR', error)
            return error
        }
    }

    @computed get watchedThreadIds() {
        return [...this.watching.entries()]
    }

    /**
     * Delete a notification by index
     *
     * We don't have to clear the badge count because when the user opens the tray
     * it will auto clear.
     * @param {number} index
     */
    deleteNotification = (index: number) => {
        this.notifications.splice(index, 1)
    }

    fetchNotificationsAsync = async ({
        publicKey,
        lastCheckedNotifications,
        watchedIds,
        viewAll,
    }: {
        publicKey: string
        lastCheckedNotifications: number
        watchedIds: any[]
        viewAll: boolean
    }) => {
        try {
            const { payload } = await discussions.getPostsForNotifications(
                publicKey,
                lastCheckedNotifications,
                undefined,
                0,
                250,
                watchedIds,
                viewAll
            )
            return payload
        } catch (error) {
            throw error
        }
    }

    fetchNotifications = async (publicKey: string): Promise<void> => {
        try {
            const payload = await this.fetchNotificationsAsync({
                publicKey,
                lastCheckedNotifications: this.lastCheckedNotifications,
                watchedIds: this.watchedThreadIds,
                viewAll: false,
            })

            this.notificationCount = payload.length
            this.notifications = payload.filter((item: any, index: number) => index <= 5)

            if (Notification.permission === 'granted') {
                payload.map(notification => {
                    if (!this.desktopNotifications.has(notification.id)) {
                        const desktopNotification = new Notification(removeMD(notification.content))
                        this.desktopNotifications.set(notification.id, desktopNotification)
                    }
                })
            }
        } catch (error) {
            this.notifications = []
            return error
        }
    }

    clearNotifications = () => {
        this.notifications = []
        this.notificationCount = 0
        this.uiStore.showMessage('Notifications cleared', 'success')
    }
}
