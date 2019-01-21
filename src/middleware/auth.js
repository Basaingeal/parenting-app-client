import store from '@/store/index'

export default function auth ({ next, router }) {
  if (!store.getters.authenticated) {
    return router.push({ name: 'welcome' })
  }

  return next()
}
