import axios from 'axios'

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apiKey = process.env.REACT_APP_MARVEL_API_KEY
    _baseOffset = 210

    getResource = async (url, limit, offset) => {
        return await axios.get(url, {
            params: {
                apikey: this._apiKey,
                limit: limit,
                offset: offset
            }
        }).catch(error => console.error(error))
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters`, 9, offset)
        return res.data.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}`)
        return this._transformCharacter(res.data.data.results[0])
    }

    _transformCharacter = (char) => {
        const noDescription = 'There is no description to this character'

        if (char.description.length > 200) {
            char.description = char.description.slice(0, 200) + '...'
        }

        return {
            name: char.name,
            id: char.id,
            description: char.description ? `${char.description.slice(0, 200)}...` : noDescription,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension} `,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        }
    }
}

export default MarvelService