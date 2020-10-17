import React from 'react';
import { useHistory } from "react-router-dom";

const AddButton: React.FC = _props => {
    const history = useHistory();
    const handleAdd = () => {
        history.push('/new');
    }

    return (
        <button onClick={handleAdd}>Add</button>
    )
}


export default AddButton;