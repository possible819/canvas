import { Route, Routes } from 'react-router-dom'
import HeaderMenus from './components/HeaderMenus/HeaderMenus'
import MENUS from './constants/menus'
import withTitle from './hocs/withTitle'
import MovingBox from './pages/MovingBox/MovingBox'
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
        <Route
          path="/moving-box"
          element={withTitle(MovingBox, 'Canvas Playground - Moving Box')}
        />
      </Routes>
    </main>
  </>
)

export default App
