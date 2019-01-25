import { isWebPSupported } from '@/services/SupportManager'

const state = {
  children: [],
  currentChildId: window.localStorage.getItem('current_child_id') || null,
  fetchingChildren: false
}

const getters = {
  currentChild (state) {
    const foundChild = state.children.find(c => c.id === state.currentChildId)
    if (foundChild) {
      return foundChild
    }
    if (state.children.length > 0) {
      const firstChild = state.children[0]
      return firstChild
    }
    return null
  },
  childrenCount (state) {
    return state.children.length
  },
  fetchingChildren (state) {
    return state.fetchingChildren
  },
  children (state) {
    return state.children
  }
}

const mutations = {
  newChild (state, child) {
    state.children.push(child)
    state.currentChildId = child.id
    window.localStorage.setItem('current_child_id', state.currentChildId)
  },
  setChildren (state, children) {
    for (let child of children) {
      state.children.push(child)
    }
  },
  setFetchingChildren (state, isFetching) {
    state.fetchingChildren = isFetching
  },
  currentChildId (state, currentChildId) {
    state.currentChildId = currentChildId
  },
  newChildLog (state, newLog) {
    const currentChild = state.children.find(c => c.id === state.currentChildId)
    currentChild.logs.push(newLog)
  }
}

const actions = {
  async addChild ({ commit }, child) {
    const webPSupport = await isWebPSupported()
    child.src = webPSupport
      ? `${process.env.VUE_APP_SERVER}childImage/${child.id}`
      : `${process.env.VUE_APP_SERVER}childImage/png/${child.id}`
    commit('newChild', child)
  },
  async setChildren ({ commit }, children) {
    const webPSupport = await isWebPSupported()
    children = children.map(child => ({
      ...child,
      src: webPSupport
        ? `${process.env.VUE_APP_SERVER}childImage/${child.id}`
        : `${process.env.VUE_APP_SERVER}childImage/png/${child.id}`
    }))
    commit('setChildren', children)
  },
  setFetchingChildren ({ commit }, isFetching) {
    commit('setFetchingChildren', isFetching)
  },
  setCurrentChild ({ commit }, childId) {
    commit('currentChildId', childId)
  },
  newChildLog ({commit }, newLog) {
    commit('newChildLog', newLog)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
