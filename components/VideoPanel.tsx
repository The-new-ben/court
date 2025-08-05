
import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { GavelIcon } from './icons/GavelIcon';

const VideoFeed: React.FC<{ name: string; role: string; isJudge?: boolean, isLive?: boolean }> = ({ name, role, isJudge = false, isLive = false }) => (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${isJudge ? 'col-span-2' : ''} bg-gray-700 dark:bg-gray-900 border border-gray-600 dark:border-gray-700`}>
        <div className="aspect-video w-full flex items-center justify-center">
            {isJudge ? <GavelIcon className="w-12 h-12 text-gray-500" /> : <UserIcon className="w-12 h-12 text-gray-500" />}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
            <p className="font-semibold text-white text-sm truncate">{name}</p>
            <p className="text-xs text-gray-300">{role}</p>
        </div>
        {isLive && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
            </div>
        )}
    </div>
);

export const VideoPanel: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-2 gap-4">
                <VideoFeed name="Hon. Ada Lovelace" role="Presiding Judge" isJudge={true} isLive={true} />
                <VideoFeed name="Pixel Pete" role="Plaintiff" />
                <VideoFeed name="Anya Petrova" role="Defendant" />
            </div>
        </div>
    );
};
