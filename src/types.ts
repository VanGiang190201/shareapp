export type LinkStatus = 'WAIT_LINK' | 'DONE' | 'WAIT_ORDER' | 'DONE_ORDER'

export interface HistoryRecord {
  id?: string
  link: string
  affiliate?: string
  image?: string
  imageSuccess?: string
  status: LinkStatus
  time: string
  productPrice?: number
  commissionRate?: number
  estimatedCommissionVnd?: number
  requestId?: string
}

export interface SubmitPayload {
  uid: string
  link: string
  key: string
}
