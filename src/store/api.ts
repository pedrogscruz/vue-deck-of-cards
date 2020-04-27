import axios from 'axios';
export default axios.create({
	baseURL: 'https://deckofcardsapi.com/api/deck/',
	timeout: 5000
});