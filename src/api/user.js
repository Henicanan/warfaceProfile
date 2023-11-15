import axios from 'axios'

const BASE_URL = '/api/user'

export const userApi = {
  async getAchievements(name) {
    return await axios.get(`${BASE_URL}/achievements?name=${name}`).then((response) => {
      return response.data
    })
  }
}
