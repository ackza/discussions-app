import { useStaticRendering } from 'mobx-react'
import { isServer } from '@utils'
import { AuthStore } from '@stores/authStore'
import { createContext, useContext } from 'react'
import { UIStore } from '@stores/uiStore'
import { set } from 'mobx'
import { TagStore } from '@stores/tagStore'
import { PostsStore } from '@stores/postsStore'
import { UserStore } from '@stores/userStore'
import { SettingsStore } from '@stores/settingsStore'
import { create } from 'mobx-persist'
import { WalletStore } from '@stores/walletStore'

useStaticRendering(isServer)

export const hydrate = storage =>
    create({
        storage: storage,
        jsonify: true,
    })

export class RootStore {
    authStore = new AuthStore(this)
    uiStore = new UIStore(this)
    userStore = new UserStore(this)
    walletStore = new WalletStore(this)
    tagStore = new TagStore(this)
    postsStore = new PostsStore(this)
    settingStore = new SettingsStore(this)

    hydrate({ authStore, postsStore, tagStore, uiStore, userStore, settingStore, walletStore }) {
        if (authStore) {
            set(this.authStore, authStore)
        }

        if (postsStore) {
            set(this.postsStore, postsStore)
        }

        if (userStore) {
            this.userStore.hydrate(userStore)
        }

        if (settingStore) {
            this.settingStore.hydrate(settingStore)
        }
    }
}

const StoreContext = createContext<any | null>(null)

let store
let rootStore: any = {}

function initializeStore(data = rootStore || {}) {
    const stores = new RootStore()

    stores.hydrate({
        authStore: data.authStore,
        postsStore: data.postsStore,
        tagStore: data.tagStore,
        uiStore: data.uiStore,
        walletStore: data.walletStore,
        userStore: data.userStore ? data.userStore : {},
        settingStore: data.settingStore ? data.settingStore : {},
    })

    if (isServer) {
        return stores
    }

    if (!Object.keys(rootStore).length) {
        rootStore = stores

        const hydr = {
            userStore: stores.userStore,
            settingsStore: stores.settingStore,
            tagStore: stores.tagStore,
            walletStore: stores.walletStore,
        }

        Object.keys(hydr).forEach(store => {
            hydrate(localStorage)(store, hydr[store])
        })
    }

    return rootStore
}

function InjectStoreContext({ children, initialData }) {
    const store = initializeStore(initialData)
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStores: any = () => useContext(StoreContext)

export { initializeStore, StoreContext, InjectStoreContext, useStores }
