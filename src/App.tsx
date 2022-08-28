import { Route, Routes } from 'react-router-dom'
import HeaderMenus from './components/HeaderMenus/HeaderMenus'
import MENUS from './constants/menus'
import withTitle from './hocs/withTitle'
import Painter from './pages/Painter/Painter'

const App = () => (
  <>
    <header>
      <nav>
        <HeaderMenus menus={MENUS} />
      </nav>
    </header>

    <main>
      <Routes>
        <Route
          path="/painter"
          element={withTitle(Painter, 'Canvas Playground - Painter')}
        />
      </Routes>
    </main>
  </>
)

export default App
