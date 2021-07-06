import React, { useEffect } from 'react';

import LatestPosts from './latest';
import TopPairs from './top';
import NewButton from '../../components/new-button';

import * as style from './style.scss';
import StickerAnimation from '../../components/sticker';
import DancingStickers from '../../ds-api/write';
import { getStickersByEmojiSet } from '../../ds-api/common/stickers';
import { REPO_URL } from '../../config';

export default function Home () {
  useEffect(() => {
    DancingStickers.init().then(() => {
      const stickersList = DancingStickers.stickers().getList();

      const dancingStickers = getStickersByEmojiSet(stickersList, ['💃', '🕺', '🥳']);

      const randomStickerIndex = Math.floor(Math.random() * dancingStickers.length);

      const sticker = dancingStickers[randomStickerIndex];

      DancingStickers.setSticker(sticker.index);
    });

    return () => {
      DancingStickers.setSticker();
    };
  }, []);

  return (
    <div className={style.cont}>
      <div className={style.home}>
        <nav className={style.topNav}>
          <div className={style.sectionNameNoMargin}>
            <a className='nostyle' target='_blank' rel='noreferrer' href={REPO_URL}>
              <div className={style.githubLogo} />
              <div className={style.sourceCode}>Source code</div>
            </a>
          </div>
        </nav>

        <header className={style.title}>
          <div>Dancing</div>

          <div className={style.titleAnimation}>
            <StickerAnimation loop={false} large={false} controller={DancingStickers} />
          </div>

          <div>Stickers</div>
        </header>

        <div className={style.sectionName}>🎧 Recent</div>
        <LatestPosts />

        <div className={style.sectionName}>🔥 Popular</div>
        <TopPairs />

        <NewButton />
      </div>
    </div>
  );
}
