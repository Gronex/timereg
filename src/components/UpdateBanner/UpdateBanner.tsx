import React, { useState } from "react";

interface Props {
    onUpdateAccepted: () => void,
    version?: string
}

const UpdateBanner: React.FC<Props> = props => {
    const [dismissed, updateDismissed] = useState(false)
    if (!dismissed && props.version) {
        return (
            <div className="w-full bg-green-700 text-gray-900 font-bold text-center fixed inset-x-0 bottom-0 pt-4">
                <div className="">
                    <p>A new version <a href="https://github.com/Gronex/timereg/blob/master/CHANGELOG.md" className="underline text-orange-600" target="_blank">{props.version}</a> is now available!</p>
                    <p>Would you like to update now?</p>
                </div>
                <div className="grid grid-cols-6 gap-4 my-2">
                    <button
                        className="col-span-3 md:col-start-3 md:col-span-1 shadow bg-transparent hover:bg-green-600 focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                        onClick={props.onUpdateAccepted}>Update now</button>
                    <button
                        className="col-span-3 md:col-span-1 bg-transparent hover:bg-green-600 focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                        onClick={() => updateDismissed(true)}>Dismiss</button>
                </div>
            </div>
        );
    }
    else{
        return null;
    }
}

export default UpdateBanner;