import colors from './colors'
import { Theme } from '@emotion/styled'
const Poppins = 'Poppins'
const Segoe = 'SegoeUI'

export const darkTheme: Theme = {
  accent: '#FF4A57',
  navBarBackground: colors.DarkPurple,
  text: colors.white,
  white: colors.white,
  background: colors.purple,

  shaded: colors.DarkPurple,
  lightText: '#707070',
  lightText2: '#757575',
  lightText3: '#B1ACAC',
  lightText4: '#D4D4D4',
  lightText5: '#6B6B6B',
  lightText6: '#9F9B9B',

  titleFont: Poppins,
  bodyFont: Segoe,
}
