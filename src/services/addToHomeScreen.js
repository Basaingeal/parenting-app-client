import store from '../store/index'

window.addEventListener('beforeinstallprompt', e => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()

  console.log('beforeinstallprompt event fired')
  console.log(e)
  // Stash the event so it can be triggered later.
  window.bipEvent = e
  store.dispatch('installPromptEvent', e)
  store.dispatch('toggleInstallSnackbar')
})
