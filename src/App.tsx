import { default as axios } from "axios";
import * as Promise from "bluebird";
import * as R from "ramda";
import * as React from "react";
import FitText = require("react-fittext");
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { ISpotifyCurrentSong } from "../server/interfaces";
import { ISongMethods, songMethods } from "./redux/modules/song";

import "./App.scss";

interface IState {
  song: ISpotifyCurrentSong;
}

interface IDispatch {
  dispatch: Dispatch<{}>;
}

type IProps = IState & IDispatch & ISongMethods;
class NowPlaying extends React.Component<IProps, {}> {
  songQueryLoop() {
    const name = R.last(window.location.href.split("/"));
    Promise.resolve(axios.get(`/api/playing/${name}`))
      .then(R.prop("data"))
      .then((data: ISpotifyCurrentSong) => {
        if (this.props.song.id !== data.id) {
          // Preload images as soon as possible.
          const img = document.createElement("img");
          img.src = data.album_art;

          return this.props.updateSong(data);
        }

        return;
      })
      .delay(2000)
      .then(() => this.songQueryLoop());
  }

  componentDidMount() {
    this.songQueryLoop();
  }

  render() {
    const song = this.props.song;
    const coverStyle = {backgroundImage: `url("${song.album_art}")`};

    return (
       <div>
        <div className="nowplaying">
          <div className="display">
            <div className="art" style={coverStyle} />
            <div className="coverart" />
            <div className="text">
              <p className="artist">{song.artist}</p>
              <p className="album">{song.album}</p>
              <FitText>
                <p className="track">{song.song}</p>
              </FitText>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: IState) => ({song: state.song}),
  (dispatch: Dispatch<{}>) => bindActionCreators(songMethods, dispatch)
)(NowPlaying);
