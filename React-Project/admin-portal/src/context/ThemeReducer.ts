import type { ThemeType } from './ThemeContext';

export interface ThemeState {
  theme: ThemeType;
}

export type ThemeAction = { type: 'TOGGLE_THEME' };

export const themeReducer = (
  state: ThemeState,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };
    default:
      return state;
  }
};
