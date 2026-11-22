import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { Provider } from 'react-redux'
import { getRouter } from './router'
import { store } from './store'

const router = getRouter()

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
}
