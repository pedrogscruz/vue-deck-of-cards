import Vue from 'vue';
import Vuex, { ActionTree, MutationTree, GetterTree } from 'vuex';
import { getDeck } from '../utils/card';
import { deck, getDeckResponse } from './types';

const state = {
  cards: [] as string[],
  rotationCard: '',
  submitValid: false as boolean,
  deck: true as boolean | deck
};

type stateType = typeof state;

import Api from './api';

Vue.use(Vuex);

export const actions: ActionTree<stateType, {}> = {
  CREATE_NEW_DECK: async (store, cards: [string]) => {
    const response = await Api.get<{ deck_id: string }>('new/draw/?count=52');
    if (!response?.data) return null;
    await Api.get(response.data.deck_id+'/pile/my_pile/add/?cards='+cards.join(',').toUpperCase());
    return response.data.deck_id;
  },
  GET_DECK: async (store, deckId: string) => {
    store.state.deck = true;
    const getPromise = Api.get<getDeckResponse>(deckId +'/pile/my_pile/list/');
    getPromise.catch(() => {
      store.state.deck = false;
    })
    const response = await getPromise; 
    store.commit('SET_DECK', response?.data?.piles.my_pile.cards);
  }
}

const mutations: MutationTree<stateType> = {
  SET_DECK: async (state, pile = []) => {
    if (!pile) return state.deck = false;
    state.deck = getDeck(pile);
  }
}

const getters: GetterTree<stateType, {}> = {
  deck: (state) => state.deck
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});