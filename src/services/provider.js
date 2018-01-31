import { request, config } from 'utils'

const { APIV1 } = config

export async function list(params) {
  return request({
    url: `${APIV1}/provider`,
    data: params,
  })
}