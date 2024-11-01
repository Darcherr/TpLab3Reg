import client from '@/client'

export default class MenuService {
  async getList() {
    const response = await client.get('menu')
    return response.data
  }

  async create(data: any) {
    const response = await client.post('menu', data)
    return response.data
  }

  async update(data: any) {
    const response = await client.patch('menu', data)
    return response.data
  }

  async delete(data: any) {
    console.log('delete service', data)
    const response = await client.delete('menu', data)
    return response.data
  }
}
