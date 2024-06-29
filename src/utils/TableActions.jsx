import React from 'react';
import { Tooltip } from 'flowbite-react';
import { HiPencil, HiTrash,HiRefresh } from "react-icons/hi";

export const TableActionsItemsActive = ({ onEdit, onDelete }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Tooltip content="Editar" placement="top">
                <HiPencil onClick={onEdit} className="h-6 w-6 cursor-pointer" />
            </Tooltip>
            <Tooltip content="Eliminar" placement="top">
                <HiTrash onClick={onDelete} className="h-6 w-6 cursor-pointer" />
            </Tooltip>
        </div>
    );
};

export const TableActionsItemsInactive = ({ onActive }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Tooltip content="Activar" placement="top">
            
                <HiRefresh onClick={onActive} className="h-6 w-6 cursor-pointer" />
            
            </Tooltip>
        </div>
    );
};

