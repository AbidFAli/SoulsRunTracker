import type {ThemeConfig } from 'antd';
import { colors } from '@/util/colors';


export const themeConfig: ThemeConfig = {
  components: {
    Table: {
      colorBgContainer: colors.card,
      headerBg: colors.card,
      filterDropdownMenuBg: colors.dropdown,
      filterDropdownBg: colors.dropdown,
    },
    Dropdown: {
      colorBgElevated: colors.dropdown,
    },
  }
}