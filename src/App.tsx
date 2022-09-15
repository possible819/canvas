import { Route, Routes } from 'react-router-dom'
import HeaderMenus from './components/HeaderMenus/HeaderMenus'
import MENUS from './constants/menus'
import withTitle from './hocs/withTitle'
import ControllableBox from './pages/ControllableBox/ControllableBox'
import MovingBox from './pages/MovingBox/MovingBox'
import Painter from './pages/Painter/Painter'
import RacingCar from './pages/RacingCar/RacingCar'
import Transforming from './pages/Transforming/Transforming'

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
        <Route
          path="/controllable-box"
          element={withTitle(
            ControllableBox,
            'Canvas Playground - Controllable Box'
          )}
        />
        <Route
          path="/transforming"
          element={withTitle(Transforming, 'Canvas Playground - Transforming')}
        />
        <Route
          path="/racing-car"
          element={withTitle(RacingCar, 'Canvas Playground - Racing car')}
        />
      </Routes>
    </main>
  </>
)

export default App
