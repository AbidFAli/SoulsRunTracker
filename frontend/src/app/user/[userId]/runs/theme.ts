import type {ThemeConfig } from 'antd';
import { colors } from '@/util/colors';

export const dropdownColor = '#1F1F1F';
export const themeConfig: ThemeConfig = {
  components: {
    Table: {
      colorBgContainer: colors.card,
      headerBg: colors.card,
      filterDropdownMenuBg: dropdownColor,
      filterDropdownBg: dropdownColor,
    },
    Dropdown: {
      colorBgElevated: dropdownColor
    },
  }
}