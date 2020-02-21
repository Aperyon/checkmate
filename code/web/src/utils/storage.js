export function removeTokensFromStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}