const state = {
  children: [],
  currentChildId: window.localStorage.getItem('current_child_id') || null,
  fetchingChildren: false
}

const getters = {
  currentChild (state) {
    return state.children.find(c => c.id === state.currentChildId)
  },
  childrenCount (state) {
    return state.children.length
  },
  fetchingChildren (state) {
    return state.fetchingChildren
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
  }
}

const actions = {
  addChild ({ commit }, child) {
    commit('newChild', child)
  },
  setChildren ({ commit }, children) {
    commit('setChildren', children)
  },
  setFetchingChildren ({ commit }, isFetching) {
    commit('setFetchingChildren', isFetching)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
