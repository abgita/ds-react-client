import React from 'react';

import { useParams, useLocation } from 'react-router-dom';

import Pair from './components/pair';

import NewButton from '../../components/new-button';

function useQuery () {
  return new URLSearchParams(useLocation().search);
}

function tryParseInt (value, fallbackValue) {
  const n = parseInt(value);

  if (isNaN(n)) return fallbackValue;

  return n;
}

export default function View () {
  const query = useQuery();

  const { pairId } = useParams();

  const pair = pairId.split(':');

  const stickerId = pair[0];
  const trackId = pair[1];

  // const version = tryParseInt(query.get("v"), 0);
  const autoplay = tryParseInt(query.get('autoplay'), 0) === 1;

  return (
    <>
      <Pair stickerId={stickerId} trackId={trackId} isPlaying={autoplay} />

      <NewButton />
    </>
  );
}
