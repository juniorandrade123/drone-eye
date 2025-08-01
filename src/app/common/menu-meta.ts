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
    label: 'Geral',
  isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'solar:chart-linear',
    label: 'Dashboard',
    link:'/index'
  },
  {
    key: 'audits',
    icon: 'solar:file-text-linear',
    label: 'Auditoria',
    link:'/audits/list'
  }
]
