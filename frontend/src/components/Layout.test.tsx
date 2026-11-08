// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Layout from './Layout';

describe('Layout', () => {
  it('renders the header above the routed page', () => {
    render(
      <MemoryRouter initialEntries={['/mypage']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/mypage" element={<p>마이페이지 본문</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('위닝')).not.toBeNull();
    expect(screen.getByText('마이페이지 본문')).not.toBeNull();
  });
});
