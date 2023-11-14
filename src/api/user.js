import axios from 'axios'

const BASE_URL = '/api'

export const userApi = {
  async getAchievements(name) {
    return await axios.get(`${BASE_URL}user/achievements?name=${name}`).then((response) => {
      return response.data
    })
  }
}
