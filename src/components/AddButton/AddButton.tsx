import React from 'react';
import { Link, useLocation, useParams } from "react-router-dom";

const AddButton: React.FC = _props => {
    let { date } = useParams<{date?: string}>();
    return (
        <div className="py-6 px-6 sticky bottom-0 float-right">
            <Link to={{pathname: '/new', search: date ? `?date=${date}` : undefined}}
                className="inline-block p-0 w-12 h-12 bg-blue-600 hover:bg-blue-400 rounded-full mouse shadow active:shadow-lg transition ease-in duration-200 focus:outline-none">
                <svg aria-label="Add" viewBox="0 0 20 20" className="inline-block">
                    <path className="w-6 h-6" fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z" />
                </svg>
            </Link>
        </div>
    )
}


export default AddButton;