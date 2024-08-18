import React from 'react';
import { Tooltip } from 'flowbite-react';
import { HiPencil, HiTrash,HiRefresh, HiEye  } from "react-icons/hi";
import { useLocation } from 'react-router-dom';

export const TableActionsItemsActive = ({ onEdit, onDelete,onView }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {location.pathname === '/parque-vehiculos' || location.pathname === '/parque-vehiculos-admin' ?
                <Tooltip content="Ver" placement="top">
                    <HiEye onClick={onView} className="h-6 w-6 cursor-pointer" />
                </Tooltip>
             : null
            }
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

