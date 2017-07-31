import { ActionCreatorsMapObject } from "redux";
import { ISpotifyCurrentSong } from "../../../server/interfaces";

const UPDATE_SONG = "song/update";

export interface SongAction {
  type: string;
  data: ISpotifyCurrentSong;
}

const defaultState: ISpotifyCurrentSong = {
  id: "",
  song: "",
  album: "",
  album_art: "",
  artist: ""
};

export function song(state: ISpotifyCurrentSong = defaultState, action: SongAction): ISpotifyCurrentSong {
  switch (action.type) {
    case UPDATE_SONG:
      return action.data;
    default:
      return state;
  }
}

export function updateSong(data: ISpotifyCurrentSong): SongAction {
  return {
    type: UPDATE_SONG,
    data
  };
}

export interface ISongMethods extends ActionCreatorsMapObject {
  updateSong(data: ISpotifyCurrentSong): SongAction;
}

export const songMethods: ISongMethods = {
  updateSong
};
