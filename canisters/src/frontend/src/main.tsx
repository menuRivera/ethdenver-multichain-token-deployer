import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme, ThemeUIProvider } from 'theme-ui'
import './index.css'

const theme: Theme = {
	cards: {
		primary: {
			backgroundColor: '#ece5e5',
			borderRadius: '10px',
			margin: '5vh 10vw',
			padding: '100px',
			boxShadow: '5px 5px 20px 10px lightGray'
		}
	},
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeUIProvider theme={theme}>
			<App />
		</ThemeUIProvider>
	</React.StrictMode>,
)
