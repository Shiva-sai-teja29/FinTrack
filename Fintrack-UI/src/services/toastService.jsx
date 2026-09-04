let showToastFn = null

export const registerToast = fn => {
  showToastFn = fn
}

export const showToast = (message, type = 'info') => {
  if (showToastFn) {
    showToastFn({ message, type })
  }
}
