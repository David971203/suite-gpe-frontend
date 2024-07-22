import React from 'react';
import { Toast } from 'flowbite-react';
import { HiX, HiCheck } from "react-icons/hi";

const ToastNotification = ({ show, type, message, onClose }) => {
    return show ? (
        <div className="fixed top-24 right-8">
            <Toast>
                <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${type === 'success' ? 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'}`}>
                    {type === 'success' ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                <Toast.Toggle onClick={onClose} />
            </Toast>
        </div>
    ) : null;
};

export default ToastNotification;
