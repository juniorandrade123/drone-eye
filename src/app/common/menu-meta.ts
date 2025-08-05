export type MenuItem = {
  key?: string
  label?: string
  icon?: string
  link?: string
  collapsed?: boolean
  subMenu?: any
  isTitle?: boolean
  badge?: any
  parentKey?: string
  disabled?: boolean
}

export const MENU: MenuItem[] = [
  {
    key: 'general',
    label: 'Sistema de Inventário',
  isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'solar:chart-linear',
    label: 'Dashboard',
    link:'/index'
  },
  {
    key: 'inventario',
    icon: 'solar:chart-linear',
    label: 'Consulta Inventário',
    link:'/inventario/index'
  }
]
