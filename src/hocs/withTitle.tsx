import usePageTitle from '../hooks/usePageTitle'

const withTitle = (Component: React.ComponentType, title: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usePageTitle(title)
  return <Component />
}

export default withTitle
