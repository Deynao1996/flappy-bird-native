import { request } from './axios-utils'

export const registerUser = async (user) => {
  return await request({
    url: '/auth/register',
    method: 'POST',
    data: user
  })
}

export const loginUser = async (user) => {
  return await request({ url: '/auth/login', method: 'POST', data: user })
}

export const loginWithJWT = async (token) => {
  return await request({
    url: '/auth/login/withToken',
    headers: { Authorization: 'Bearer ' + token }
  })
}

export const fetchUser = async (userId) => {
  return await request({ url: `/users/${userId}` })
}

export const fetchUsers = async () => {
  return await request({ url: '/users' })
}

export const updateUser = async ({ userId, data }) => {
  return await request({ url: `/users/${userId}`, method: 'PUT', data })
}

export const sendReview = async (review) => {
  return await request({
    url: '/messages',
    method: 'POST',
    data: review
  })
}
