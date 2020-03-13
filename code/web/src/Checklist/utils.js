import _ from 'lodash';


export function handleItemsChange(values, append) {
  console.log('Checking!!!!')
  console.log(values)
  if (shouldAddExtraItem(values)) {
    console.log('Should add yes')
    append()
  } else {
    console.log('Dont add')
  }
}


export function shouldAddExtraItem(values) {
  const itemFieldKeys = Object.keys(values).filter(fieldName => fieldName.indexOf('items[') === 0 && fieldName.indexOf('.text') > -1)
  const itemFieldValues = itemFieldKeys.map(key => values[key])
  return _.every(itemFieldValues.map(val => val.trim() !== ""))
}