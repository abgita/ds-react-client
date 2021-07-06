import React, { useState } from 'react';
import PropTypes from 'prop-types';

import DancingStickers from '../../../../../ds-api/write';
import { useSearchFieldState } from '@react-stately/searchfield';
import { useSearchField } from '@react-aria/searchfield';
import debounce from 'lodash.debounce';

import TrackItem from './track-item';

import * as style from './style.scss';

function InputLoadingAnimation ({ visible }) {
  return (
    <div className={style.searchInputLoading + ' ' + (visible ? style.searchInputLoadingVisible : '')}>
      <div />
    </div>
  );
}

InputLoadingAnimation.propTypes = {
  visible: PropTypes.bool
};

function useSearchTrackState ({ onTrackSelected }) {
  const [results, setResults] = useState([]);
  const [isSearching, setSearching] = useState(false);

  return {
    results: results,

    hasResults: () => {
      return results && results.length > 0;
    },

    setResults: (results = []) => {
      setResults(results);

      // this is unintuitive, TODO: replace for something else...
      // like a play/pause button for the music
      // or a reset/clear button for the selected track
      if (results.length < 1) {
        onTrackSelected(null);
      }
    },

    clearResults: () => setResults([]),

    selectTrackItem: onTrackSelected,

    isSearching: isSearching,
    setSearching: setSearching
  };
}

function useSearchTrack (searchTrackState) {
  const searchTrack = debounce(async (value) => {
    if (!value || value.length === 0) {
      searchTrackState.setResults([]);
    } else {
      const tracks = await DancingStickers.music().searchTrack(value);

      searchTrackState.setResults(tracks);
    }

    searchTrackState.setSearching(false);
  }, 500);

  return value => {
    searchTrackState.setSearching(true);
    searchTrack(value);
  };
}

function SearchTrackInput ({ searchTrackState }) {
  const searchTrack = useSearchTrack(searchTrackState);

  const searchFieldProps = {
    label: 'Search',
    placeholder: 'Song',
    autoFocus: true,

    onClear: searchTrack,
    onChange: searchTrack
  };

  const state = useSearchFieldState(searchFieldProps);

  const ref = React.useRef();
  const { labelProps, inputProps } = useSearchField(searchFieldProps, state, ref);

  return (
    <div className={style.trackSearchInputArea}>
      <label {...labelProps} className={style.trackSearchInputLabel}>{searchFieldProps.label}</label>

      <div className={style.trackSearchInput}>
        <img className={style.trackSearchInputIcon} src='/images/search.svg' alt='search input icon' />

        <input {...inputProps} ref={ref} />

        <InputLoadingAnimation visible={searchTrackState.isSearching} />
      </div>
    </div>
  );
}

SearchTrackInput.propTypes = {
  searchTrackState: PropTypes.object
};

function SearchTrackResults ({ searchTrackState }) {
  if (!searchTrackState.hasResults()) return <></>;

  const results = searchTrackState.results;

  return (
    <div className={style.trackSearchResultsArea}>
      <div className={style.trackSearchResults}>
        <ul>
          {
            results.map(track => {
              const trackId = track.trackId;
              const onPress = () => searchTrackState.selectTrackItem(trackId);

              return (
                <li key={trackId} onClick={onPress}>
                  <TrackItem track={track} />
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}

SearchTrackResults.propTypes = {
  searchTrackState: PropTypes.object
};

export default function TrackSearch ({ onSelect }) {
  const searchTrackState = useSearchTrackState({
    onTrackSelected: trackId => {
      searchTrackState.clearResults();

      onSelect(trackId);
    }
  });

  return (
    <div className={style.trackSearch}>
      <SearchTrackInput searchTrackState={searchTrackState} />
      <SearchTrackResults searchTrackState={searchTrackState} />
    </div>
  );
}

TrackSearch.propTypes = {
  onSelect: PropTypes.func
};
