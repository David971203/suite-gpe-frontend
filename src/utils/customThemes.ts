import type { CustomFlowbiteTheme } from "flowbite-react";

export const customSidebar: CustomFlowbiteTheme['sidebar'] = {
   
    
    
};

export const customTable: CustomFlowbiteTheme['table'] = {
    "root": {
        "base": "w-full text-left text-sm text-gray-500 dark:text-gray-400",
        "shadow": "absolute bg-white dark:bg-black w-full h-full top-0 left-0 drop-shadow-md -z-10",
        "wrapper": "relative"
    },
    "body": {
        "base": "group/body",
        "cell": {
            "base": "px-4 py-3"
        }
    },
    "head": {
        "base": "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
        "cell": {
            "base": "bg-gray-50 dark:bg-gray-700 px-4 py-3"
        }
    },
};

export const customThemeInput: CustomFlowbiteTheme['textInput'] = {
    "field": {
        "input": {
            "colors": {
                "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
            },
        }
    }
};

export const customDatepicker: CustomFlowbiteTheme['datepicker'] = {
    "root": {
        "base": ""
    },
};

export const customRangeSlider: CustomFlowbiteTheme['rangeSlider'] = {
    "field": {
        "base": "relative w-full",
        "input": {
            "base": "w-full bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500",
        }
    }
}

export const customThemeTree: CustomFlowbiteTheme['sidebar'] = {
    root: {
        "inner": "h-full overflow-y-auto overflow-x-hidden rounded-none bg-white py-4 px-3 dark:bg-gray-800",
        "collapsed": {
            "on": "w-16",
            "off": "w-80"
        },
    },
    collapse: {
        "list": "space-y-1 py-2",
    },
    item: {
        "base": "group flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        "content": {
            "base": "px-3 flex-1 whitespace-nowrap truncate"
        },
    },
    itemGroup: {
        "base": "mt-2 space-y-1 border-t border-gray-200 pt-3 pb-2 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
};

export const customThemeTooltip: CustomFlowbiteTheme['tooltip'] = {
    target: "w-full",
};

export const customFooter: CustomFlowbiteTheme['footer'] = {
    "root": {
        "base": "w-full bg-white dark:bg-gray-800 md:flex md:items-center md:justify-between",
        "container": "w-full p-4 md:px-8",
    },
    "divider": {
        "base": "w-full border-gray-200 dark:border-gray-700 sm:mx-auto"
    },
};

export const customTimeline: CustomFlowbiteTheme['timeline'] = {
    "item": {
        "point": {
            "horizontal": "flex items-center",
            "line": "hidden h-0.5 w-full bg-gray-200 dark:bg-gray-500 sm:flex",
            "marker": {
                "base": {
                    "horizontal": "absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
                },
                "icon": {
                    "base": "h-3 w-3 text-primary-600 dark:text-primary-300",
                    "wrapper": "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-white dark:bg-primary-900 dark:ring-gray-900"
                }
            },
        }
    }
}