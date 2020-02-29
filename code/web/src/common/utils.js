export function getQueryParamsString(filters) {
  const queryParamsList = Object.keys(filters).map(filterKey => `${filterKey}=${filters[filterKey]}`)

  if (queryParamsList.length > 0) {
    return `?${queryParamsList.join('&')}`
  }
  return ''
}