import { Component } from 'react'
import PropTypes from 'prop-types'

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newCharsLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newCharsLoading: true
        })
    }

    onListLoaded = (newChars) => {
        let ended = false
        if (newChars.length < 9) {
            ended = true
        }

        this.setState(({ chars, offset }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newCharsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderList(arr) {
        const elements = arr.map((char, i) => {
            let imgStyle = { 'objectFit': 'cover' }
            if (char.thumbnail.includes("not_available")) {
                imgStyle = { 'objectFit': 'unset' }
            }

            return (
                <li
                    className="char__item"
                    key={char.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(char.id)
                        this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(char.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img src={char.thumbnail} alt={char.name} style={imgStyle} />
                    <div className="char__name">{char.name}</div>
                </li >
            )

        })

        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    render() {
        const { chars, loading, error, offset, newCharsLoading, charEnded } = this.state
        const elements = this.renderList(chars)
        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner /> : null
        const content = errorMessage || spinner || elements

        return (
            <div className="char__list">
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newCharsLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;