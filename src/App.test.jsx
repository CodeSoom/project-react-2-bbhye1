import React from 'react';

import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import App from './App';

import { loadItem } from './sevices/storage';

import MYPLAYLISTS from '../fixtures/myplaylists';

jest.mock('react-redux');
jest.mock('./sevices/storage');

describe('App', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();

    useDispatch.mockImplementation(() => dispatch);

    useSelector.mockImplementation((selector) => selector(
      {
        moodselectFields: {
          energy: '',
          brightness: '',
        },
        moodCategories: [],
        myPlaylists: [],
      },
    ));
  });

  function renderApp({ path }) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
  }

  it('renders navigation bar', () => {
    const { container } = renderApp({ path: '/project-react-2-bbhye1' });
    expect(container).toHaveTextContent('무드 선택');
    expect(container).toHaveTextContent('홈');
  });

  context('with path /project-react-2-bbhye1', () => {
    it('renders the Mood controller page', () => {
      const { container } = renderApp({ path: '/project-react-2-bbhye1' });

      expect(container).toHaveTextContent('오늘은 어떤 날인가요?');
    });
  });

  context('with path /project-react-2-bbhye1//moodplay', () => {
    it('renders the Mood controller page', () => {
      const { container } = renderApp({ path: '/project-react-2-bbhye1/moodplay' });

      expect(container).toHaveTextContent('기분에 어울리는 장르들이에요!');
    });
  });

  context('with path /project-react-2-bbhye1/myplay', () => {
    it('renders the Mood controller page', () => {
      const { container } = renderApp({ path: '/project-react-2-bbhye1/myplay' });

      expect(container).toHaveTextContent('마이 플레이리스트');
    });
  });

  context('with stored myPlaylists', () => {
    const myplaylists = MYPLAYLISTS;

    beforeEach(() => {
      loadItem.mockImplementation(() => myplaylists);
    });

    it('calls dispatch with "setMyPlaylists" action', () => {
      renderApp({ path: '/project-react-2-bbhye1' });

      expect(dispatch).toBeCalledWith({
        type: 'application/setMyPlaylists',
        payload: myplaylists,
      });
    });
  });

  context('without stored myPlaylists', () => {
    beforeEach(() => {
      loadItem.mockImplementation(() => null);
    });

    it('calls dispatch with "setMyPlaylists" action', () => {
      renderApp({ path: '/project-react-2-bbhye1' });

      expect(dispatch).not.toBeCalled();
    });
  });
});
