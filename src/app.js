import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import New from './routes/new';
import View from './routes/view';
import Home from './routes/home';

export default function App () {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path='/new'>
            <New />
          </Route>

          <Route path='/view/:pairId'>
            <View />
          </Route>

          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
