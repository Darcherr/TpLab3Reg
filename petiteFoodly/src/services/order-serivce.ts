import client from '@/client'

export default class OrderService {
  async getList() {
    const response = await client.get('order')
    return response.data
  }

  async create(data: any) {
    const response = await client.post('order', data)
    return response.data
  }

  async update(data: any) {
    const response = await client.patch('order', data)
    return response.data
  }

  async delete(data: any) {
    const response = await client.delete('order', data)
    return response.data
  }
}
