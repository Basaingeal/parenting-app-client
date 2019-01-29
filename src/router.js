import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/auth/logincallback',
      name: 'logincallback',
      component: () => import(/* webpackChunkName: "logincallback" */ './views/auth/LoginCallback.vue')
    },
    {
      path: '/auth/logoutcallback',
      name: 'logoutcallback',
      component: () => import(/* webpackChunkName: "logoutcallback" */ './views/auth/LogoutCallback.vue')
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import(/* webpackChunkName: "welcome" */ './views/Welcome.vue')
    },
    {
      path: '/newchild',
      name: 'newchild',
      component: () => import(/* webpackChunkName: "newchild" */ './views/NewChild.vue')
    },
    {
      path: '/log/newbreastfeedinglog',
      name: 'newbreastfeedinglog',
      component: () => import(/* webpackChunkName: "newbreastfeedinglog" */ './views/log/NewBreastFeedingLog.vue')
    }
  ]
})

function nextFactory (context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Than run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    const context = {
      from,
      next,
      router,
      to
    }
    const nextMiddleware = nextFactory(context, middleware, 1)

    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})

export default router
