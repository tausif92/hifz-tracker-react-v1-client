// src/GlobalContext.js
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [currentPara, setCurrentPara] = useState('');

	return (
		<GlobalContext.Provider value={{ currentPara, setCurrentPara }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
