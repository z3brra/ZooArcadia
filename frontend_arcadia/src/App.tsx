import { RouterProvider } from 'react-router-dom'
import './scss/main.css'

import { router } from '@routes/router'

export default function App() {
    return <RouterProvider router={router} />
}

