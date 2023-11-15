import axios from 'axios'

const BASE_URL = '/api/achievement'

export const achievementApi = {
  async getCatalog() {
    return await axios.get(`${BASE_URL}/catalog`).then((response) => {
      return response.data
    })
  }
}
