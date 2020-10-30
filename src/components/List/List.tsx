import { DateTime, Duration } from 'luxon';
import React from 'react';
import { Link } from 'react-router-dom';

export interface Listing {
    iconPath: string;
    text: string;
    ariaLabel: string;
    stroke?: "currentColor";
}

export interface Item {
    to?: string;
    title: string;
    id?: string | number;
    listings?: Listing[];
}

export interface Props {
    items: Item[];
}

export function createTimeListing(time?: number) : Listing{
    time = time ?? 0;
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    const duration = Duration.fromObject({hours, minutes}).normalize();
    let durationText;
    try{
        const minFormat = new Intl.NumberFormat(undefined, {
            style: 'unit',
            unit: 'minute',
            unitDisplay: 'long'
        });
    
        const hourFormat = new Intl.NumberFormat(undefined, {
            style: 'unit',
            unit: 'hour',
            unitDisplay: 'long'
        });

        durationText = `${hourFormat.format(duration.hours)} and ${minFormat.format(duration.minutes)}`;
    }
    catch {
        durationText = `${duration.hours} hour(s) and ${duration.minutes} minute(s)`;
    }



    return {
        iconPath: `M13 2.05v2.02c3.95.49 7 3.85 7
            7.93 0 3.21-1.92 6-4.72 7.28L13
            17v5h5l-1.22-1.22C19.91 19.07 22
            15.76 22
            12c0-5.18-3.95-9.45-9-9.95M11
            2c-1.95.2-3.8.96-5.32 2.21L7.1
            5.63A8.195 8.195 0 0111 4V2M4.2
            5.68C2.96 7.2 2.2 9.05 2
            11h2c.19-1.42.75-2.77
            1.63-3.9L4.2 5.68M6
            8v2h3v1H8c-1.1 0-2 .9-2
            2v3h5v-2H8v-1h1c1.11 0 2-.89
            2-2v-1a2 2 0 00-2-2H6m6
            0v5h3v3h2v-3h1v-2h-1V8h-2v3h-1V8h-2M2
            13c.2 1.95.97 3.8 2.22
            5.32l1.42-1.42A8.21 8.21 0 014
            13H2m5.11 5.37l-1.43 1.42A10.04
            10.04 0 0011 22v-2a8.063 8.063 0
            01-3.89-1.63z`,
        text: durationText,
        ariaLabel: "Time"
    };
}

export function renderListing(listing : Listing) {
    return (
        <div className="flex mr-6" key={listing.ariaLabel}>
            <svg aria-label={listing.ariaLabel} className="h-5 w-5 fill-current text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={listing.stroke}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={listing.iconPath}></path>
            </svg>
            <span className="ml-2 text-sm light-mode:text-gray-600 text-orange-600 capitalize">
                {listing.text}
            </span>
        </div>);
}

const List: React.FC<Props> = props => {
    const renderItem = (item : Item) => {

        const listings = item.listings?.map(renderListing) ?? [];


        const content = (
            <div key={item.id} className="flex flex-row mt-2">
                <div className="flex w-full items-center justify-between 
                    light-mode:bg-white bg-gray-800 px-8 py-6 border-l-4 border-teal-800">
                    <div className="flex flex-col ml-6">
                        <span className="text-lg font-bold text-teal-500">{item.title}</span>
                        <div className="mt-4 flex">
                            {listings}
                        </div>
                    </div>
                </div>
            </div>
        );
        return item.to ? <Link key={item.id} to={item.to}>{content}</Link> : content;
    }

    return (
        <div className="flex flex-col mt-2">
            {props.items.map(item => renderItem(item))}
        </div>
    )
}


export default List;