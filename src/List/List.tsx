import React from 'react';
import { Link } from 'react-router-dom';

export interface Item {
    to?: string;
    text: string;
}

export interface Props {
    items: Item[];
}

const List: React.FC<Props> = props => {

    const renderItem = (item : Item) => {
        const contents = <li>{item.text}</li>;
        if(item.to) {
            return <Link to={item.to}>{contents}</Link>
        }
        else {
            return <div>{contents}</div>
        }
    }

    return (
        <ul>
            {props.items.map(item => renderItem(item))}
        </ul>
    )
}


export default List;