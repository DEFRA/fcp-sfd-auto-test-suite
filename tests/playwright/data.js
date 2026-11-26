import { faker } from '@faker-js/faker'

export function randomPhoneNumber() {
  let phone = '0'
  for (let i = 0; i < 10; i++) phone += Math.floor(Math.random() * 10)
  return phone
}

export function randomEmail() {
  const randomString = Math.random().toString(36).substring(2, 8)
  return `test_${randomString}_${Date.now()}@test.com`
}

export function randomEmailOfLength(length) {
  const domain = '@example.com'
  if (!length || length <= domain.length) return ''
  return (
    faker.string.alphanumeric(length - domain.length).toLowerCase() + domain
  )
}

// Phone numbers for the validation scenarios: a string of exactly `length` digits ('' gives '').
export function phoneOfLength(length) {
  let value = ''
  while (value.length < length) value += randomPhoneNumber()
  return value.substring(0, length)
}
