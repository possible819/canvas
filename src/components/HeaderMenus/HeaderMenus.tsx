export interface Menu {
  name: string
  route: string
}

export interface HeaderMenusProps {
  menus: Menu[]
}

const HeaderMenus = ({ menus = [] }: HeaderMenusProps) => {
  return (
    <ul>
      {menus.map((menu) => (
        <li key={menu.name}>
          <a href={menu.route}>{menu.name}</a>
        </li>
      ))}
    </ul>
  )
}

export default HeaderMenus
