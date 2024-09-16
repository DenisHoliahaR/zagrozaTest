import React from 'react';
import CustomDropdown from './components/CustomDropdown/CustomDropdown';

import './index.scss';

function App() {
    return (
        <div className="App">
            <CustomDropdown />
            <CustomDropdown openMethod='hover' withAdd={false} />
            <CustomDropdown withSearch={false} />
            <CustomDropdown withAdd={false} withSearch={false} />
        </div>
    );
}

export default App;
