<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Primary Modules
    |--------------------------------------------------------------------------
    |
    | These are the main sections of your app. You can nest sub‑modules
    | under any primary module using the `children` key.
    |
    */

    'primary' => [

        'invoices' => [
            'actions' => 'read|write|delete',
            'title' => 'Invoices',
            'icon' => 'Boxes',

            // Sub‑menu items under "Invoices"
            'children' => [
                'sales-invoices' => [
                    'actions' => 'read|write|delete',
                    'title' => 'Sales Invoices',
                    'icon' => 'ClipboardList',
                ],
                'sample-invoices' => [
                    'actions' => 'read|write|delete',
                    'title' => 'Sample Invoices',
                    'icon' => 'ClipboardList',
                ],
                'invoices-reports' => [
                    'actions' => 'read',
                    'title' => 'Invoice Reports',
                    'icon' => 'BarChart2',
                ],
            ],
        ],

        'lc-manage' => [
            'actions' => 'read|write|delete',
            'title' => 'LC Manager',
            'icon' => 'ListTree',
        ],

        'inspection-doc' => [
            'actions' => 'read|write|delete',
            'title' => 'Inspection Doc.',
            'icon' => 'Images',
        ],

        'commertial-doc' => [
            'actions' => 'read|write|delete',
            'title' => 'Commercial Inv.',
            'icon' => 'FileBox',
        ],

    ],


    /*
    |--------------------------------------------------------------------------
    | Secondary Modules
    |--------------------------------------------------------------------------
    |
    | These modules usually appear lower in the sidebar or under a "More"
    | section. They have their own permissions and icons.
    |
    */

    'secondary' => [

        'customers' => [
            'actions' => 'read|write|delete',
            'title' => 'Customers',
            'icon' => 'UsersRound',
        ],

        'factories' => [
            'actions' => 'read|write|delete',
            'title' => 'Factories',
            'icon' => 'Tickets',
        ],

        'banks' => [
            'actions' => 'read|write|delete',
            'title' => 'Banks',
            'icon' => 'Tickets',
        ],

        'shippers' => [
            'actions' => 'read|write|delete',
            'title' => 'Shippers',
            'icon' => 'Truck',
        ],

    ],


    /*
    |--------------------------------------------------------------------------
    | Settings Modules
    |--------------------------------------------------------------------------
    |
    | These appear under your user menu or settings section.
    |
    */

    'settings' => [

        'profile' => [
            'actions' => 'read|write|delete',
            'title' => 'Profile',
            'icon' => 'User',
        ],

    ],

];